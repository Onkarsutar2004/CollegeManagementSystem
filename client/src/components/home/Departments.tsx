import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DepartmentType } from "@/lib/types";
import { departmentImages } from "@/lib/images";

const Departments = () => {
  const { data: departments, isLoading, error } = useQuery<DepartmentType[]>({
    queryKey: ["/api/departments"],
  });

  if (isLoading) {
    return (
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Academic Departments</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our diverse departments offering cutting-edge education and research opportunities.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="bg-white rounded-lg overflow-hidden shadow-md">
                <div className="w-full h-48 bg-gray-200 animate-pulse"></div>
                <CardContent className="p-6">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-1 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-4 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Academic Departments</h2>
          <p className="text-red-500">Error loading departments. Please try again later.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Academic Departments</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our diverse departments offering cutting-edge education and research opportunities in various disciplines.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {departments?.map((department) => {
            // Get department-specific images based on department name
            const deptImgKey = department.name === 'Computer Science' ? 'computerScience' : 
                             department.name === 'Mechanical Engineering' ? 'mechanical' :
                             department.name === 'Electrical Engineering' ? 'electrical' : 'civil';
            
            // Use the departmentImages if available, otherwise use the stored imageUrl
            const departmentImage = departmentImages[deptImgKey] ? 
                                  departmentImages[deptImgKey][0] : 
                                  department.imageUrl;
            
            return (
              <div 
                key={department.id}
                className="bg-white rounded-lg overflow-hidden shadow-md transition transform hover:scale-105 hover:shadow-lg"
              >
                <img 
                  src={departmentImage} 
                  alt={`${department.name} Department`} 
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-primary-800">{department.name}</h3>
                  <p className="text-gray-600 mb-4">{department.description}</p>
                  <Link href={`/departments/${department.name.toLowerCase().replace(/\s+/g, '-')}`}>
                    <a className="text-primary-600 font-medium hover:text-primary-700 flex items-center">
                      Learn more <i className="fas fa-arrow-right ml-2"></i>
                    </a>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <Link href="/departments">
            <Button className="px-6 py-3 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 transition">
              View All Departments
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Departments;
