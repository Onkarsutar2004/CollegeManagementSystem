import { Link } from "wouter";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="text-xl font-semibold mb-4">About EduTech</h3>
            <p className="text-gray-400 mb-4">
              A leading institution dedicated to excellence in education, research, and innovation since 1985.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition"
                aria-label="Facebook"
              >
                <i className="fab fa-facebook-f"></i>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition"
                aria-label="Twitter"
              >
                <i className="fab fa-twitter"></i>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition"
                aria-label="Instagram"
              >
                <i className="fab fa-instagram"></i>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition"
                aria-label="LinkedIn"
              >
                <i className="fab fa-linkedin-in"></i>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition"
                aria-label="YouTube"
              >
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about">
                  <a className="text-gray-400 hover:text-white transition">About Us</a>
                </Link>
              </li>
              <li>
                <Link href="/academics">
                  <a className="text-gray-400 hover:text-white transition">Academics</a>
                </Link>
              </li>
              <li>
                <Link href="/admissions">
                  <a className="text-gray-400 hover:text-white transition">Admissions</a>
                </Link>
              </li>
              <li>
                <Link href="/campus-life">
                  <a className="text-gray-400 hover:text-white transition">Campus Life</a>
                </Link>
              </li>
              <li>
                <Link href="/research">
                  <a className="text-gray-400 hover:text-white transition">Research</a>
                </Link>
              </li>
              <li>
                <Link href="/alumni">
                  <a className="text-gray-400 hover:text-white transition">Alumni</a>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/library">
                  <a className="text-gray-400 hover:text-white transition">Library</a>
                </Link>
              </li>
              <li>
                <Link href="/career-services">
                  <a className="text-gray-400 hover:text-white transition">Career Services</a>
                </Link>
              </li>
              <li>
                <Link href="/student-portal">
                  <a className="text-gray-400 hover:text-white transition">Student Portal</a>
                </Link>
              </li>
              <li>
                <Link href="/it-support">
                  <a className="text-gray-400 hover:text-white transition">IT Support</a>
                </Link>
              </li>
              <li>
                <Link href="/financial-aid">
                  <a className="text-gray-400 hover:text-white transition">Financial Aid</a>
                </Link>
              </li>
              <li>
                <Link href="/campus-safety">
                  <a className="text-gray-400 hover:text-white transition">Campus Safety</a>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
            <address className="not-italic text-gray-400">
              <p className="mb-2">123 University Avenue</p>
              <p className="mb-2">Edutown, ET 12345</p>
              <p className="mb-2">United States</p>
            </address>
            <p className="text-gray-400 mb-2">
              <i className="fas fa-phone mr-2"></i> (123) 456-7890
            </p>
            <p className="text-gray-400">
              <i className="fas fa-envelope mr-2"></i> info@edutech.edu
            </p>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 mb-4 md:mb-0">
              © {new Date().getFullYear()} EduTech University. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link href="/privacy-policy">
                <a className="text-gray-500 hover:text-white transition">
                  Privacy Policy
                </a>
              </Link>
              <Link href="/terms-of-service">
                <a className="text-gray-500 hover:text-white transition">
                  Terms of Service
                </a>
              </Link>
              <Link href="/accessibility">
                <a className="text-gray-500 hover:text-white transition">
                  Accessibility
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
