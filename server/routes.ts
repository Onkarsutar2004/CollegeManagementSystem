import express, { type Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertDepartmentSchema, insertCourseSchema, insertEnrollmentSchema } from "@shared/schema";
import { compare, hash } from "bcryptjs";
import session from "express-session";
import MemoryStore from "memorystore";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

export async function registerRoutes(app: Express): Promise<Server> {
  // Configure session middleware
  const MemoryStoreSession = MemoryStore(session);
  app.use(
    session({
      cookie: { maxAge: 86400000 }, // 24 hours
      store: new MemoryStoreSession({ checkPeriod: 86400000 }),
      resave: false,
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET || "edutech-college-secret",
    })
  );

  // Configure passport for authentication
  app.use(passport.initialize());
  app.use(passport.session());

  // Passport local strategy setup
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user) {
          return done(null, false, { message: "Incorrect username" });
        }

        const isMatch = await compare(password, user.password);
        if (!isMatch) {
          return done(null, false, { message: "Incorrect password" });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  // Auth routes
  app.post("/api/login", passport.authenticate("local"), (req, res) => {
    // Return the user directly without wrapping in an object
    res.json(req.user);
  });

  app.post("/api/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: "Error logging out" });
      }
      res.json({ message: "Logout successful" });
    });
  });

  // Keep the /api/me endpoint for backward compatibility
  app.get("/api/me", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    res.json(req.user);
  });
  
  // Add /api/user endpoint to match our updated client code
  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    res.json(req.user);
  });

  // User register route
  app.post("/api/register", async (req: Request, res: Response) => {
    try {
      // Check if username already exists
      const existingUser = await storage.getUserByUsername(req.body.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      // Check if email already exists
      if (req.body.email) {
        const existingEmail = await storage.getUserByEmail(req.body.email);
        if (existingEmail) {
          return res.status(400).json({ message: "Email already exists" });
        }
      }
      
      const userData = insertUserSchema.parse(req.body);
      
      // Hash password before storing
      const hashedPassword = await hash(userData.password, 10);
      
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword,
        role: userData.role || "student" // Default role to student if not provided
      });
      
      // Log the user in automatically
      req.login(user, (err) => {
        if (err) {
          return res.status(500).json({ message: "Error logging in after registration" });
        }
        
        // Return user without password
        const { password, ...userWithoutPassword } = user;
        res.status(201).json(userWithoutPassword);
      });
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Invalid user data" });
    }
  });
  
  // Keep the old endpoint for backward compatibility
  app.post("/api/users", async (req: Request, res: Response) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Hash password before storing
      const hashedPassword = await hash(userData.password, 10);
      
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword,
        role: userData.role || "student" // Default role to student if not provided
      });
      
      // Return user without password
      const { password, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Invalid user data" });
    }
  });

  // Department routes
  app.get("/api/departments", async (req: Request, res: Response) => {
    try {
      const departments = await storage.getAllDepartments();
      res.json(departments);
    } catch (error) {
      res.status(500).json({ message: "Failed to get departments" });
    }
  });

  app.get("/api/departments/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const department = await storage.getDepartment(id);
      
      if (!department) {
        return res.status(404).json({ message: "Department not found" });
      }
      
      res.json(department);
    } catch (error) {
      res.status(500).json({ message: "Failed to get department" });
    }
  });

  app.post("/api/departments", async (req: Request, res: Response) => {
    try {
      if (!req.isAuthenticated() || (req.user as any).role !== "admin") {
        return res.status(403).json({ message: "Unauthorized" });
      }
      
      const departmentData = insertDepartmentSchema.parse(req.body);
      const department = await storage.createDepartment(departmentData);
      res.status(201).json(department);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Invalid department data" });
    }
  });

  // Course routes
  app.get("/api/courses", async (req: Request, res: Response) => {
    try {
      const departmentId = req.query.departmentId ? parseInt(req.query.departmentId as string) : undefined;
      const courses = departmentId 
        ? await storage.getCoursesByDepartment(departmentId)
        : await storage.getAllCourses();
      
      res.json(courses);
    } catch (error) {
      res.status(500).json({ message: "Failed to get courses" });
    }
  });

  app.get("/api/courses/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const course = await storage.getCourse(id);
      
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      
      res.json(course);
    } catch (error) {
      res.status(500).json({ message: "Failed to get course" });
    }
  });

  app.post("/api/courses", async (req: Request, res: Response) => {
    try {
      if (!req.isAuthenticated() || (req.user as any).role !== "admin") {
        return res.status(403).json({ message: "Unauthorized" });
      }
      
      const courseData = insertCourseSchema.parse(req.body);
      const course = await storage.createCourse(courseData);
      res.status(201).json(course);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Invalid course data" });
    }
  });

  // Enrollment routes
  app.post("/api/enrollments", async (req: Request, res: Response) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const enrollmentData = insertEnrollmentSchema.parse({
        ...req.body,
        userId: (req.user as any).id
      });
      
      const enrollment = await storage.createEnrollment(enrollmentData);
      res.status(201).json(enrollment);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Invalid enrollment data" });
    }
  });

  app.get("/api/user/enrollments", async (req: Request, res: Response) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const enrollments = await storage.getEnrollmentsByUser((req.user as any).id);
      res.json(enrollments);
    } catch (error) {
      res.status(500).json({ message: "Failed to get enrollments" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
