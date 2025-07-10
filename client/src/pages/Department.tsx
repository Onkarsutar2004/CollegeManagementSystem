import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { DepartmentType, CourseType } from "@/lib/types";
import { Helmet } from "react-helmet";

const Department = () => {
  const { name } = useParams();
  const departmentName = name?.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  
  const { data: departments, isLoading: isLoadingDepartments } = useQuery<DepartmentType[]>({
    queryKey: ["/api/departments"],
  });
  
  const department = departments?.find(
    (dept) => dept.name.toLowerCase() === departmentName?.toLowerCase()
  );
  
  const { data: courses, isLoading: isLoadingCourses } = useQuery<CourseType[]>({
    queryKey: ["/api/courses", department?.id],
    queryFn: async () => {
      if (!department) return [];
      const res = await fetch(`/api/courses?departmentId=${department.id}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch courses");
      return res.json();
    },
    enabled: !!department,
  });
  
  const isLoading = isLoadingDepartments || isLoadingCourses;
  
  if (isLoading) {
    return (
      <div className="page-container">
        <Navbar />
        <main className="main-content bg-slate-50 py-16">
          <div className="container mx-auto px-4">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-4 mx-auto"></div>
              <div className="h-4 bg-gray-200 rounded max-w-2xl mx-auto mb-8"></div>
              <div className="h-64 bg-gray-200 rounded mb-8"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-48 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (!department) {
    return (
      <div className="page-container">
        <Navbar />
        <main className="main-content bg-slate-50 py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl font-bold mb-4">Department Not Found</h1>
            <p className="text-gray-600 mb-8">
              The department you are looking for does not exist or has been moved.
            </p>
            <Button onClick={() => window.history.back()}>Go Back</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="page-container">
      <Helmet>
        <title>{department.name} Department - EduTech</title>
        <meta name="description" content={`Learn about the ${department.name} department at EduTech University, including courses, faculty, and research opportunities.`} />
      </Helmet>
      <Navbar />
      <main className="main-content bg-slate-50">
        {/* Department Hero */}
        <section 
          className="h-80 bg-cover bg-center relative"
          style={{ backgroundImage: `url(${department.imageUrl})` }}
        >
          <div className="absolute inset-0 bg-black/50"></div>
          <div className="container mx-auto px-4 h-full flex items-center relative z-10">
            <div className="text-white max-w-3xl">
              <h1 className="text-4xl font-bold mb-4">{department.name}</h1>
              <p className="text-xl opacity-90">{department.description}</p>
            </div>
          </div>
        </section>
        
        {/* Department Content */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <Tabs defaultValue="overview" className="max-w-5xl mx-auto">
              <TabsList className="grid grid-cols-4 mb-8">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="courses">Courses</TabsTrigger>
                <TabsTrigger value="faculty">Faculty</TabsTrigger>
                <TabsTrigger value="research">Research</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-2xl font-bold mb-4">Department Overview</h2>
                <p className="mb-4">
                  The {department.name} department at EduTech University is committed to providing students with 
                  a rigorous education that prepares them for successful careers in an ever-evolving 
                  technological landscape.
                </p>
                <p className="mb-4">
                  Our curriculum combines theoretical knowledge with practical application, 
                  ensuring students develop the skills and expertise needed in today's 
                  competitive job market.
                </p>
                
                <div className="mt-8">
                  <h3 className="text-xl font-semibold mb-3">Department Head</h3>
                  <div className="flex items-center">
                    <div className="w-16 h-16 bg-gray-200 rounded-full mr-4"></div>
                    <div>
                      <p className="font-bold">{department.head}</p>
                      <p className="text-gray-600">Department Head</p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                  <div className="bg-primary-50 p-5 rounded-lg border border-primary-100">
                    <h3 className="font-semibold text-lg mb-2">Undergraduate Programs</h3>
                    <p className="text-gray-600">
                      Our bachelor's programs provide a strong foundation in core principles.
                    </p>
                  </div>
                  
                  <div className="bg-primary-50 p-5 rounded-lg border border-primary-100">
                    <h3 className="font-semibold text-lg mb-2">Graduate Programs</h3>
                    <p className="text-gray-600">
                      Master's and PhD programs for advanced specialization.
                    </p>
                  </div>
                  
                  <div className="bg-primary-50 p-5 rounded-lg border border-primary-100">
                    <h3 className="font-semibold text-lg mb-2">Research Areas</h3>
                    <p className="text-gray-600">
                      Cutting-edge research in various domains and applications.
                    </p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="courses">
                <h2 className="text-2xl font-bold mb-6">Courses Offered</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {courses && courses.length > 0 ? (
                    courses.map((course) => (
                      <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                        <div 
                          className="h-40 bg-cover bg-center" 
                          style={{ backgroundImage: `url(${course.imageUrl || 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=300'})` }}
                        ></div>
                        <CardContent className="p-5">
                          <div className="text-sm font-semibold text-primary-600 mb-1">{course.code}</div>
                          <h3 className="text-xl font-bold mb-2">{course.name}</h3>
                          <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                          <div className="flex justify-between items-center">
                            <span className="text-sm bg-primary-100 text-primary-800 py-1 px-2 rounded">
                              {course.credits} Credits
                            </span>
                            <Button variant="outline" className="border-primary-600 text-primary-600">
                              View Details
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="col-span-2 text-center py-12">
                      <h3 className="text-xl font-semibold mb-2">No courses available</h3>
                      <p className="text-gray-600">
                        Courses for this department will be added soon.
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="faculty">
                <h2 className="text-2xl font-bold mb-6">Faculty Members</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center text-center">
                        <div className="w-24 h-24 bg-gray-200 rounded-full mb-4"></div>
                        <h3 className="font-bold text-lg">{department.head}</h3>
                        <p className="text-primary-600">Department Head</p>
                        <p className="text-gray-600 mt-2">
                          PhD in {department.name}, Stanford University
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center text-center">
                        <div className="w-24 h-24 bg-gray-200 rounded-full mb-4"></div>
                        <h3 className="font-bold text-lg">Dr. Jane Doe</h3>
                        <p className="text-primary-600">Associate Professor</p>
                        <p className="text-gray-600 mt-2">
                          PhD in {department.name}, MIT
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center text-center">
                        <div className="w-24 h-24 bg-gray-200 rounded-full mb-4"></div>
                        <h3 className="font-bold text-lg">Dr. Robert Smith</h3>
                        <p className="text-primary-600">Assistant Professor</p>
                        <p className="text-gray-600 mt-2">
                          PhD in {department.name}, UC Berkeley
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="research">
                <h2 className="text-2xl font-bold mb-6">Research Areas</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-xl font-semibold mb-3">Research Area 1</h3>
                    <p className="text-gray-600 mb-4">
                      Our research focuses on developing cutting-edge solutions to real-world problems,
                      with applications in various industries.
                    </p>
                    <Button variant="outline">Learn More</Button>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-xl font-semibold mb-3">Research Area 2</h3>
                    <p className="text-gray-600 mb-4">
                      Investigating novel approaches to improve efficiency, sustainability, and 
                      performance across a range of disciplines.
                    </p>
                    <Button variant="outline">Learn More</Button>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-xl font-semibold mb-3">Research Area 3</h3>
                    <p className="text-gray-600 mb-4">
                      Exploring the intersection of technology and society to address
                      complex challenges facing our world today.
                    </p>
                    <Button variant="outline">Learn More</Button>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-xl font-semibold mb-3">Research Area 4</h3>
                    <p className="text-gray-600 mb-4">
                      Advancing fundamental theoretical understanding while developing
                      practical applications and innovations.
                    </p>
                    <Button variant="outline">Learn More</Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Department;
