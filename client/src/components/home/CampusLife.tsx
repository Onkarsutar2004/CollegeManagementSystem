import { Link } from "wouter";
import { campusLifeImages } from "@/lib/images";

const CampusLife = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Campus Life</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Experience a vibrant campus community with endless opportunities for growth, learning, and making lifelong connections.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="rounded-lg overflow-hidden h-80 relative group">
            <img 
              src={campusLifeImages.studentLife} 
              alt="Student Life" 
              className="w-full h-full object-cover transition duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
              <div className="p-6 text-white">
                <h3 className="text-xl font-semibold mb-2">Student Life</h3>
                <p className="mb-3 opacity-90">Join over 50 student clubs and organizations catering to diverse interests and hobbies.</p>
                <Link href="/campus-life/activities">
                  <a className="text-white hover:text-accent-300 font-medium flex items-center">
                    Explore Activities <i className="fas fa-arrow-right ml-2"></i>
                  </a>
                </Link>
              </div>
            </div>
          </div>
          
          <div className="rounded-lg overflow-hidden h-80 relative group">
            <img 
              src={campusLifeImages.academicResources} 
              alt="Academic Resources" 
              className="w-full h-full object-cover transition duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
              <div className="p-6 text-white">
                <h3 className="text-xl font-semibold mb-2">Academic Resources</h3>
                <p className="mb-3 opacity-90">Access state-of-the-art libraries, research centers, and support services.</p>
                <Link href="/campus-life/resources">
                  <a className="text-white hover:text-accent-300 font-medium flex items-center">
                    Discover Resources <i className="fas fa-arrow-right ml-2"></i>
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="rounded-lg overflow-hidden h-64 relative group">
            <img 
              src={campusLifeImages.athletics} 
              alt="Athletics" 
              className="w-full h-full object-cover transition duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
              <div className="p-4 text-white">
                <h3 className="text-lg font-semibold mb-1">Athletics</h3>
                <Link href="/campus-life/athletics">
                  <a className="text-white hover:text-accent-300 text-sm font-medium flex items-center">
                    View Programs <i className="fas fa-arrow-right ml-1"></i>
                  </a>
                </Link>
              </div>
            </div>
          </div>
          
          <div className="rounded-lg overflow-hidden h-64 relative group">
            <img 
              src={campusLifeImages.housing} 
              alt="Housing" 
              className="w-full h-full object-cover transition duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
              <div className="p-4 text-white">
                <h3 className="text-lg font-semibold mb-1">Housing</h3>
                <Link href="/campus-life/housing">
                  <a className="text-white hover:text-accent-300 text-sm font-medium flex items-center">
                    Housing Options <i className="fas fa-arrow-right ml-1"></i>
                  </a>
                </Link>
              </div>
            </div>
          </div>
          
          <div className="rounded-lg overflow-hidden h-64 relative group">
            <img 
              src={campusLifeImages.careerServices} 
              alt="Career Services" 
              className="w-full h-full object-cover transition duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
              <div className="p-4 text-white">
                <h3 className="text-lg font-semibold mb-1">Career Services</h3>
                <Link href="/campus-life/career">
                  <a className="text-white hover:text-accent-300 text-sm font-medium flex items-center">
                    Explore Opportunities <i className="fas fa-arrow-right ml-1"></i>
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CampusLife;
