import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MenuIcon, ChevronDown } from "lucide-react";

const Navbar = () => {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <i className="fas fa-university text-primary text-3xl mr-3"></i>
              <span className="text-2xl font-bold text-primary-800">EduTech</span>
            </Link>
          </div>
          
          {/* Navigation Menu - Desktop */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link href="/" className={`px-3 py-2 ${location === "/" ? "text-primary-800 font-medium bg-primary-50" : "text-primary-800 font-medium hover:bg-primary-50"} rounded-md transition`}>
                Home
            </Link>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="px-3 py-2 text-primary-800 font-medium hover:bg-primary-50 rounded-md transition flex items-center">
                  About <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Link href="/about/history" className="w-full">
                    Our History
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/about/mission" className="w-full">
                    Mission & Vision
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/about/leadership" className="w-full">
                    Leadership
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="px-3 py-2 text-primary-800 font-medium hover:bg-primary-50 rounded-md transition flex items-center">
                  Departments <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Link href="/departments/computer-science" className="w-full">
                    Computer Science
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/departments/mechanical-engineering" className="w-full">
                    Mechanical Engineering
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/departments/electrical-engineering" className="w-full">
                    Electrical Engineering
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/departments/civil-engineering" className="w-full">
                    Civil Engineering
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="px-3 py-2 text-primary-800 font-medium hover:bg-primary-50 rounded-md transition flex items-center">
                  Courses <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Link href="/courses?level=undergraduate" className="w-full">
                    Undergraduate
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/courses?level=graduate" className="w-full">
                    Graduate
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/courses?level=certificate" className="w-full">
                    Certificate Programs
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Link href="/contact" className="px-3 py-2 text-primary-800 font-medium hover:bg-primary-50 rounded-md transition">
                Contact
            </Link>
          </nav>
          
          {/* User Authentication Buttons */}
          <div className="flex items-center space-x-2">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="border-primary-600 text-primary-600">
                    {user.fullName}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <Link href="/profile" className="w-full">
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/my-courses" className="w-full">
                      My Courses
                    </Link>
                  </DropdownMenuItem>
                  {user.role === "admin" && (
                    <DropdownMenuItem>
                      <Link href="/admin" className="w-full">
                        Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={logout}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="outline" className="border-primary-600 text-primary-600">Login</Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-primary-600 text-white hidden md:block">Register</Button>
                </Link>
              </>
            )}
            
            {/* Mobile Menu Button */}
            <Button 
              variant="ghost" 
              size="icon"
              className="md:hidden"
              onClick={toggleMobileMenu}
            >
              <MenuIcon className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link href="/" className={`block px-3 py-2 ${location === "/" ? "bg-primary-100" : "hover:bg-primary-50"} text-primary-800 font-medium rounded-md`}>
                Home
            </Link>
            <Link href="/about" className="block px-3 py-2 text-gray-700 hover:bg-primary-50 rounded-md">
                About
            </Link>
            <Link href="/departments" className="block px-3 py-2 text-gray-700 hover:bg-primary-50 rounded-md">
                Departments
            </Link>
            <Link href="/courses" className="block px-3 py-2 text-gray-700 hover:bg-primary-50 rounded-md">
                Courses
            </Link>
            <Link href="/contact" className="block px-3 py-2 text-gray-700 hover:bg-primary-50 rounded-md">
                Contact
            </Link>
            {!user && (
              <Link href="/register" className="block px-3 py-2 text-primary-600 hover:bg-primary-50 rounded-md font-medium">
                  Register
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
