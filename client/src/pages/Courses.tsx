import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CourseType } from "@/lib/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search } from "lucide-react";
import { Helmet } from "react-helmet";

const Courses = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  
  const { data: courses, isLoading } = useQuery<CourseType[]>({
    queryKey: ["/api/courses"],
  });
  
  const filteredCourses = courses?.filter(course => {
    const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          course.code.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === "all") return matchesSearch;
    
    // Map department IDs to levels for demo
    const departmentToLevel: Record<number, string> = {
      1: "undergraduate", // Computer Science
      2: "undergraduate", // Mechanical
      3: "graduate",      // Electrical
      4: "certificate"    // Civil
    };
    
    return matchesSearch && departmentToLevel[course.departmentId] === activeTab;
  });
  
  return (
    <div className="page-container">
      <Helmet>
        <title>Courses - EduTech</title>
        <meta name="description" content="Browse our comprehensive range of undergraduate, graduate and certificate courses across various departments." />
      </Helmet>
      <Navbar />
      <main className="main-content bg-slate-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Course Catalog</h1>
            <p className="text-lg text-gray-600">
              Browse our comprehensive range of courses designed to provide you with the knowledge and skills needed for success.
            </p>
          </div>
          
          <div className="max-w-5xl mx-auto">
            <div className="mb-8 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search courses by name or code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-8">
              <TabsList className="grid grid-cols-4 mb-8">
                <TabsTrigger value="all">All Courses</TabsTrigger>
                <TabsTrigger value="undergraduate">Undergraduate</TabsTrigger>
                <TabsTrigger value="graduate">Graduate</TabsTrigger>
                <TabsTrigger value="certificate">Certificate</TabsTrigger>
              </TabsList>
              
              <TabsContent value={activeTab}>
                {isLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[...Array(6)].map((_, i) => (
                      <Card key={i} className="overflow-hidden">
                        <div className="h-40 bg-gray-200 animate-pulse"></div>
                        <CardContent className="p-5">
                          <div className="h-5 bg-gray-200 rounded w-1/4 mb-2 animate-pulse"></div>
                          <div className="h-6 bg-gray-200 rounded w-3/4 mb-4 animate-pulse"></div>
                          <div className="h-4 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
                          <div className="h-4 bg-gray-200 rounded w-full mb-4 animate-pulse"></div>
                          <div className="flex justify-between items-center">
                            <div className="h-6 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                            <div className="h-9 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : filteredCourses && filteredCourses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredCourses.map((course) => (
                      <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="h-40 bg-cover bg-center" style={{ backgroundImage: `url(${course.imageUrl || 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=300'})` }}></div>
                        <CardContent className="p-5">
                          <div className="text-sm font-semibold text-primary-600 mb-1">{course.code}</div>
                          <h3 className="text-xl font-bold mb-2">{course.name}</h3>
                          <ScrollArea className="h-24 mb-4">
                            <p className="text-gray-600">{course.description}</p>
                          </ScrollArea>
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
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <h3 className="text-xl font-semibold mb-2">No courses found</h3>
                    <p className="text-gray-600 mb-4">Try adjusting your search criteria or explore other categories.</p>
                    <Button onClick={() => { setSearchTerm(''); setActiveTab('all'); }}>
                      Reset Filters
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Courses;
