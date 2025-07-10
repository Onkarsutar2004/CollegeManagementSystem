import {
  type User, type InsertUser,
  type Department, type InsertDepartment,
  type Course, type InsertCourse,
  type Enrollment, type InsertEnrollment
} from "@shared/schema";
import { connectToMongoDB, getCollections, getNextId } from "./mongodb";
import { ObjectId } from "mongodb";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Department operations
  getAllDepartments(): Promise<Department[]>;
  getDepartment(id: number): Promise<Department | undefined>;
  getDepartmentByName(name: string): Promise<Department | undefined>;
  createDepartment(department: InsertDepartment): Promise<Department>;
  
  // Course operations
  getAllCourses(): Promise<Course[]>;
  getCourse(id: number): Promise<Course | undefined>;
  getCoursesByDepartment(departmentId: number): Promise<Course[]>;
  createCourse(course: InsertCourse): Promise<Course>;
  
  // Enrollment operations
  createEnrollment(enrollment: InsertEnrollment): Promise<Enrollment>;
  getEnrollmentsByUser(userId: number): Promise<Enrollment[]>;
  getEnrollmentsByCourse(courseId: number): Promise<Enrollment[]>;
}

export class MongoDBStorage implements IStorage {
  private usersCollection: any;
  private departmentsCollection: any;
  private coursesCollection: any;
  private enrollmentsCollection: any;
  private isInitialized: boolean = false;

  constructor() {
    this.initialize();
  }

  private async initialize() {
    if (this.isInitialized) return;
    
    const collections = await connectToMongoDB();
    this.usersCollection = collections.usersCollection;
    this.departmentsCollection = collections.departmentsCollection;
    this.coursesCollection = collections.coursesCollection;
    this.enrollmentsCollection = collections.enrollmentsCollection;
    
    this.isInitialized = true;

    // Initialize sample data
    setTimeout(() => this.initializeSampleData(), 1000);
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    await this.ensureInitialized();
    const user = await this.usersCollection.findOne({ id });
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    await this.ensureInitialized();
    const user = await this.usersCollection.findOne({ username });
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    await this.ensureInitialized();
    const user = await this.usersCollection.findOne({ email });
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    await this.ensureInitialized();
    const id = await getNextId("users");
    const now = new Date();
    
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: now
    };
    
    await this.usersCollection.insertOne(user);
    return user;
  }

  // Department operations
  async getAllDepartments(): Promise<Department[]> {
    await this.ensureInitialized();
    const departments = await this.departmentsCollection.find({}).toArray();
    return departments;
  }

  async getDepartment(id: number): Promise<Department | undefined> {
    await this.ensureInitialized();
    const department = await this.departmentsCollection.findOne({ id });
    return department || undefined;
  }

  async getDepartmentByName(name: string): Promise<Department | undefined> {
    await this.ensureInitialized();
    const department = await this.departmentsCollection.findOne({ name });
    return department || undefined;
  }

  async createDepartment(insertDepartment: InsertDepartment): Promise<Department> {
    await this.ensureInitialized();
    const id = await getNextId("departments");
    
    const department: Department = { 
      ...insertDepartment, 
      id 
    };
    
    await this.departmentsCollection.insertOne(department);
    return department;
  }

  // Course operations
  async getAllCourses(): Promise<Course[]> {
    await this.ensureInitialized();
    const courses = await this.coursesCollection.find({}).toArray();
    return courses;
  }

  async getCourse(id: number): Promise<Course | undefined> {
    await this.ensureInitialized();
    const course = await this.coursesCollection.findOne({ id });
    return course || undefined;
  }

  async getCoursesByDepartment(departmentId: number): Promise<Course[]> {
    await this.ensureInitialized();
    const courses = await this.coursesCollection.find({ departmentId }).toArray();
    return courses;
  }

  async createCourse(insertCourse: InsertCourse): Promise<Course> {
    await this.ensureInitialized();
    const id = await getNextId("courses");
    
    const course: Course = { 
      ...insertCourse, 
      id 
    };
    
    await this.coursesCollection.insertOne(course);
    return course;
  }

  // Enrollment operations
  async createEnrollment(insertEnrollment: InsertEnrollment): Promise<Enrollment> {
    await this.ensureInitialized();
    const id = await getNextId("enrollments");
    const now = new Date();
    
    const enrollment: Enrollment = { 
      ...insertEnrollment, 
      id, 
      enrollmentDate: now 
    };
    
    await this.enrollmentsCollection.insertOne(enrollment);
    return enrollment;
  }

  async getEnrollmentsByUser(userId: number): Promise<Enrollment[]> {
    await this.ensureInitialized();
    const enrollments = await this.enrollmentsCollection.find({ userId }).toArray();
    return enrollments;
  }

  async getEnrollmentsByCourse(courseId: number): Promise<Enrollment[]> {
    await this.ensureInitialized();
    const enrollments = await this.enrollmentsCollection.find({ courseId }).toArray();
    return enrollments;
  }

  // Helper method to ensure MongoDB is initialized
  private async ensureInitialized() {
    if (!this.isInitialized) {
      await this.initialize();
    }
  }

  // Initialize database with sample data
  async initializeSampleData() {
    await this.ensureInitialized();

    // Check if there are already departments in the database
    const existingDepts = await this.getAllDepartments();
    if (existingDepts.length > 0) {
      console.log("Database already contains data, skipping initialization");
      return;
    }

    console.log("Initializing database with sample data");

    // Sample departments
    const departmentsData = [
      {
        name: "Computer Science",
        description: "Cutting-edge programs in software development, AI, machine learning, and cybersecurity.",
        head: "Dr. John Smith",
        imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500"
      },
      {
        name: "Mechanical Engineering",
        description: "Innovative programs in design, manufacturing, robotics, and sustainable energy systems.",
        head: "Dr. Emily Johnson",
        imageUrl: "https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500"
      },
      {
        name: "Electrical Engineering",
        description: "Advanced programs in electronics, power systems, communications, and embedded systems.",
        head: "Dr. Michael Chen",
        imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500"
      },
      {
        name: "Civil Engineering",
        description: "Comprehensive programs in structural design, transportation, environmental, and geotechnical engineering.",
        head: "Dr. Sarah Williams",
        imageUrl: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500"
      }
    ];

    // Create departments
    const createdDepartments: Department[] = [];
    for (const deptData of departmentsData) {
      const dept = await this.createDepartment(deptData);
      createdDepartments.push(dept);
    }

    // Sample courses
    const coursesData = [
      {
        name: "Introduction to Programming",
        code: "CS101",
        description: "Foundational concepts in programming with Python",
        departmentId: createdDepartments[0].id,
        credits: 3,
        imageUrl: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500"
      },
      {
        name: "Data Structures and Algorithms",
        code: "CS201",
        description: "Essential algorithms and data structures for efficient computing",
        departmentId: createdDepartments[0].id,
        credits: 4,
        imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500"
      },
      {
        name: "Thermodynamics",
        code: "ME101",
        description: "Basic principles of energy and heat transfer",
        departmentId: createdDepartments[1].id,
        credits: 3,
        imageUrl: "https://images.unsplash.com/photo-1576086213369-97a306d36557?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500"
      },
      {
        name: "Mechanics of Materials",
        code: "ME201",
        description: "Study of stresses, strains, and deformations in solid materials",
        departmentId: createdDepartments[1].id,
        credits: 4,
        imageUrl: "https://images.unsplash.com/photo-1574271143515-5cddf8da19be?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500"
      },
      {
        name: "Electric Circuits",
        code: "EE101",
        description: "Fundamentals of electric circuit analysis",
        departmentId: createdDepartments[2].id,
        credits: 3,
        imageUrl: "https://images.unsplash.com/photo-1555696958-c5049b866f6f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500"
      },
      {
        name: "Structural Analysis",
        code: "CE101",
        description: "Methods of analyzing statically determinate and indeterminate structures",
        departmentId: createdDepartments[3].id,
        credits: 3,
        imageUrl: "https://images.unsplash.com/photo-1501472139710-f5a3b0d24220?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500"
      }
    ];

    // Create courses
    for (const courseData of coursesData) {
      await this.createCourse(courseData);
    }

    console.log("Sample data initialization complete");
  }
}

export const storage = new MongoDBStorage();
