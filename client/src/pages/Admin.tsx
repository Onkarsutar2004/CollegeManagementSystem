import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { DepartmentType, CourseType } from "@/lib/types";
import { useLocation } from "wouter";
import { Helmet } from "react-helmet";

// Department form schema
const departmentSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  head: z.string().min(2, "Department head name is required"),
  imageUrl: z.string().url("Must provide a valid URL for the image"),
});

// Course form schema
const courseSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  code: z.string().min(2, "Course code is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  departmentId: z.string().transform((val) => parseInt(val, 10)),
  credits: z.string().transform((val) => parseInt(val, 10)),
  imageUrl: z.string().url("Must provide a valid URL for the image"),
});

type DepartmentFormValues = z.infer<typeof departmentSchema>;
type CourseFormValues = z.infer<typeof courseSchema>;

const Admin = () => {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("departments");
  
  // Redirect if not admin
  if (!user || user.role !== "admin") {
    navigate("/login");
    return null;
  }
  
  // Get departments for select dropdown
  const { data: departments } = useQuery<DepartmentType[]>({
    queryKey: ["/api/departments"],
  });
  
  // Department form
  const departmentForm = useForm<DepartmentFormValues>({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      name: "",
      description: "",
      head: "",
      imageUrl: "",
    },
  });
  
  // Course form
  const courseForm = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      name: "",
      code: "",
      description: "",
      departmentId: "",
      credits: "",
      imageUrl: "",
    },
  });
  
  // Department mutation
  const departmentMutation = useMutation({
    mutationFn: async (data: DepartmentFormValues) => {
      return apiRequest("POST", "/api/departments", data);
    },
    onSuccess: () => {
      toast({
        title: "Department created",
        description: "The department has been created successfully.",
      });
      departmentForm.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/departments"] });
    },
    onError: (error) => {
      toast({
        title: "Failed to create department",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    },
  });
  
  // Course mutation
  const courseMutation = useMutation({
    mutationFn: async (data: CourseFormValues) => {
      return apiRequest("POST", "/api/courses", data);
    },
    onSuccess: () => {
      toast({
        title: "Course created",
        description: "The course has been created successfully.",
      });
      courseForm.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/courses"] });
    },
    onError: (error) => {
      toast({
        title: "Failed to create course",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    },
  });
  
  // Form submit handlers
  const onDepartmentSubmit = (values: DepartmentFormValues) => {
    departmentMutation.mutate(values);
  };
  
  const onCourseSubmit = (values: CourseFormValues) => {
    courseMutation.mutate(values);
  };
  
  return (
    <div className="page-container">
      <Helmet>
        <title>Admin Dashboard - EduTech</title>
        <meta name="description" content="Administrative dashboard for managing departments, courses, and users." />
      </Helmet>
      <Navbar />
      <main className="main-content bg-slate-50 py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Admin Dashboard</h1>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-4xl mx-auto">
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="departments">Departments</TabsTrigger>
              <TabsTrigger value="courses">Courses</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
            </TabsList>
            
            <TabsContent value="departments">
              <Card>
                <CardHeader className="bg-primary-50 px-6 py-4 border-b border-primary-100">
                  <h2 className="text-xl font-semibold text-primary-800">Add New Department</h2>
                </CardHeader>
                <CardContent className="p-6">
                  <Form {...departmentForm}>
                    <form onSubmit={departmentForm.handleSubmit(onDepartmentSubmit)} className="space-y-4">
                      <FormField
                        control={departmentForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Department Name</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. Computer Science" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={departmentForm.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Provide a description of the department" 
                                className="min-h-[100px]" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={departmentForm.control}
                        name="head"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Department Head</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. Dr. John Smith" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={departmentForm.control}
                        name="imageUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Image URL</FormLabel>
                            <FormControl>
                              <Input placeholder="https://example.com/image.jpg" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        className="w-full mt-6"
                        disabled={departmentMutation.isPending}
                      >
                        {departmentMutation.isPending ? "Creating..." : "Create Department"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="courses">
              <Card>
                <CardHeader className="bg-primary-50 px-6 py-4 border-b border-primary-100">
                  <h2 className="text-xl font-semibold text-primary-800">Add New Course</h2>
                </CardHeader>
                <CardContent className="p-6">
                  <Form {...courseForm}>
                    <form onSubmit={courseForm.handleSubmit(onCourseSubmit)} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={courseForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Course Name</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. Introduction to Programming" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={courseForm.control}
                          name="code"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Course Code</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. CS101" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={courseForm.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Provide a description of the course" 
                                className="min-h-[100px]" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={courseForm.control}
                          name="departmentId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Department</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value.toString()}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a department" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {departments?.map((dept) => (
                                    <SelectItem key={dept.id} value={dept.id.toString()}>
                                      {dept.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={courseForm.control}
                          name="credits"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Credits</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value.toString()}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select credits" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="1">1 Credit</SelectItem>
                                  <SelectItem value="2">2 Credits</SelectItem>
                                  <SelectItem value="3">3 Credits</SelectItem>
                                  <SelectItem value="4">4 Credits</SelectItem>
                                  <SelectItem value="5">5 Credits</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={courseForm.control}
                        name="imageUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Image URL</FormLabel>
                            <FormControl>
                              <Input placeholder="https://example.com/image.jpg" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        className="w-full mt-6"
                        disabled={courseMutation.isPending}
                      >
                        {courseMutation.isPending ? "Creating..." : "Create Course"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="users">
              <Card>
                <CardHeader className="bg-primary-50 px-6 py-4 border-b border-primary-100">
                  <h2 className="text-xl font-semibold text-primary-800">User Management</h2>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="text-center text-gray-600 mb-4">
                    User management interface will be implemented in a future update.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Admin;
