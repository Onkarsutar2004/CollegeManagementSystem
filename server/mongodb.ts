import { MongoClient, ServerApiVersion } from 'mongodb';

// MongoDB connection URI - Check if MONGODB_URI is provided and properly formatted
let uri = "mongodb://localhost:27017/collegeManagementSystem"; // Default fallback

if (process.env.MONGODB_URI) {
  // Check if it's a valid MongoDB URI
  if (process.env.MONGODB_URI.startsWith('mongodb://') || process.env.MONGODB_URI.startsWith('mongodb+srv://')) {
    uri = process.env.MONGODB_URI;
    console.log("Using provided MongoDB URI");
  } else {
    console.error("Invalid MONGODB_URI format. URI must start with 'mongodb://' or 'mongodb+srv://'");
    console.error("Falling back to local MongoDB instance");
  }
} else {
  console.warn("No MONGODB_URI provided, using local fallback");
}

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  connectTimeoutMS: 5000, // 5 seconds timeout
  socketTimeoutMS: 45000, // 45 seconds timeout
});

// Database and collections
let db: any;
let usersCollection: any;
let departmentsCollection: any;
let coursesCollection: any;
let enrollmentsCollection: any;

// In-memory fallback data (only used if MongoDB connection fails)
class MemoryDB {
  private static instance: MemoryDB;
  private users: Map<number, any> = new Map();
  private departments: Map<number, any> = new Map();
  private courses: Map<number, any> = new Map();
  private enrollments: Map<number, any> = new Map();
  private counters: Map<string, number> = new Map();

  private constructor() {}

  public static getInstance(): MemoryDB {
    if (!MemoryDB.instance) {
      MemoryDB.instance = new MemoryDB();
    }
    return MemoryDB.instance;
  }

  getCollection(name: string): any {
    switch (name) {
      case 'users': return { 
        findOne: async (query: any) => {
          if (query.id) return this.users.get(query.id);
          if (query.username) return Array.from(this.users.values()).find(u => u.username === query.username);
          if (query.email) return Array.from(this.users.values()).find(u => u.email === query.email);
          return null;
        },
        find: () => ({ toArray: async () => Array.from(this.users.values()) }),
        insertOne: async (doc: any) => { this.users.set(doc.id, doc); return { insertedId: doc.id }; },
        createIndex: async () => {}
      };
      case 'departments': return {
        findOne: async (query: any) => {
          if (query.id) return this.departments.get(query.id);
          if (query.name) return Array.from(this.departments.values()).find(d => d.name === query.name);
          return null;
        },
        find: () => ({ toArray: async () => Array.from(this.departments.values()) }),
        insertOne: async (doc: any) => { this.departments.set(doc.id, doc); return { insertedId: doc.id }; },
        createIndex: async () => {}
      };
      case 'courses': return {
        findOne: async (query: any) => {
          if (query.id) return this.courses.get(query.id);
          if (query.code) return Array.from(this.courses.values()).find(c => c.code === query.code);
          return null;
        },
        find: (query: any = {}) => ({
          toArray: async () => {
            let result = Array.from(this.courses.values());
            if (query.departmentId) {
              result = result.filter(c => c.departmentId === query.departmentId);
            }
            return result;
          }
        }),
        insertOne: async (doc: any) => { this.courses.set(doc.id, doc); return { insertedId: doc.id }; },
        createIndex: async () => {}
      };
      case 'enrollments': return {
        findOne: async (query: any) => {
          if (query.id) return this.enrollments.get(query.id);
          return null;
        },
        find: (query: any = {}) => ({
          toArray: async () => {
            let result = Array.from(this.enrollments.values());
            if (query.userId) {
              result = result.filter(e => e.userId === query.userId);
            }
            if (query.courseId) {
              result = result.filter(e => e.courseId === query.courseId);
            }
            return result;
          }
        }),
        insertOne: async (doc: any) => { this.enrollments.set(doc.id, doc); return { insertedId: doc.id }; },
        createIndex: async () => {}
      };
      case 'counters': return {
        findOneAndUpdate: async (filter: any, update: any, options: any) => {
          const id = filter._id;
          const currentValue = this.counters.get(id) || 0;
          const newValue = currentValue + 1;
          this.counters.set(id, newValue);
          return { sequence_value: newValue };
        }
      };
      default: throw new Error(`Unknown collection: ${name}`);
    }
  }
}

// Connect to MongoDB
export async function connectToMongoDB() {
  // Check for valid MongoDB URI
  if (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://')) {
    return setupMemoryDB();
  }
  
  try {
    // Try to connect to MongoDB with timeout
    const connectPromise = client.connect();
    
    // Add timeout to avoid hanging
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("MongoDB connection timeout after 5 seconds")), 5000);
    });
    
    // Race the connect and timeout promises
    await Promise.race([connectPromise, timeoutPromise]);
    
    console.log("Connected to MongoDB");
    
    // Get database name from connection string or use default
    const dbName = uri.includes('/') && uri.split('/').pop()?.split('?')[0] || "collegeManagementSystem";
    
    // Access the database
    db = client.db(dbName);
    
    // Get references to collections
    usersCollection = db.collection("users");
    departmentsCollection = db.collection("departments");
    coursesCollection = db.collection("courses");
    enrollmentsCollection = db.collection("enrollments");
    
    try {
      // Create indexes for faster queries
      await usersCollection.createIndex({ username: 1 }, { unique: true });
      await usersCollection.createIndex({ email: 1 }, { unique: true });
      await departmentsCollection.createIndex({ name: 1 }, { unique: true });
      await coursesCollection.createIndex({ code: 1 }, { unique: true });
    } catch (indexError) {
      console.warn("Warning: Could not create all indexes:", indexError);
    }
    
    return {
      usersCollection,
      departmentsCollection,
      coursesCollection,
      enrollmentsCollection
    };
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    console.error("Please make sure your MONGODB_URI environment variable is correctly set.");
    
    return setupMemoryDB();
  }
}

// Set up the in-memory database as a fallback
function setupMemoryDB() {
  console.warn("Setting up in-memory database for local development");
  const memoryDB = MemoryDB.getInstance();
  
  db = {
    collection: (name: string) => memoryDB.getCollection(name)
  } as any;
  
  usersCollection = db.collection("users");
  departmentsCollection = db.collection("departments");
  coursesCollection = db.collection("courses");
  enrollmentsCollection = db.collection("enrollments");
  
  return {
    usersCollection,
    departmentsCollection,
    coursesCollection,
    enrollmentsCollection
  };
}

// Close MongoDB connection
export async function closeMongoDB() {
  try {
    await client.close();
    console.log("MongoDB connection closed");
  } catch (error) {
    console.error("Error closing MongoDB connection:", error);
  }
}

// Get MongoDB collections
export function getCollections() {
  return {
    usersCollection,
    departmentsCollection,
    coursesCollection,
    enrollmentsCollection
  };
}

// Generate a sequential ID for a collection
export async function getNextId(collectionName: string) {
  const countersCollection = db.collection("counters");
  
  const result = await countersCollection.findOneAndUpdate(
    { _id: collectionName },
    { $inc: { sequence_value: 1 } },
    { upsert: true, returnDocument: "after" }
  );
  
  return result.sequence_value;
}