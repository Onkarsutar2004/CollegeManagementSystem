import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import QuickInfo from "@/components/home/QuickInfo";
import Departments from "@/components/home/Departments";
import CampusLife from "@/components/home/CampusLife";
import CTA from "@/components/home/CTA";
import { Helmet } from "react-helmet";

const Home = () => {
  return (
    <div className="page-container">
      <Helmet>
        <title>EduTech - Excellence in Education</title>
        <meta name="description" content="Welcome to EduTech University, a leading institution dedicated to excellence in education, research, and innovation since 1985." />
      </Helmet>
      <Navbar />
      <main className="main-content">
        <Hero />
        <QuickInfo />
        <Departments />
        <CampusLife />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
