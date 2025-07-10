// Type definitions for the application

// Department type
export interface DepartmentType {
  id: number;
  name: string;
  description: string;
  head: string;
  imageUrl: string;
}

// Course type
export interface CourseType {
  id: number;
  name: string;
  code: string;
  description: string;
  departmentId: number;
  credits: number;
  imageUrl?: string;
}

// User type
export interface UserType {
  id: number;
  username: string;
  email: string;
  fullName: string;
  role: string;
  department?: string;
}

// Info card for quick info section
export interface InfoCard {
  icon: string;
  title: string;
  description: string;
}

// Slide images for hero section
export interface SlideImage {
  image: string;
  title: string;
  description: string;
  buttonText: string;
}

// Enrollment type
export interface EnrollmentType {
  id: number;
  userId: number;
  courseId: number;
  enrollmentDate: string;
}
