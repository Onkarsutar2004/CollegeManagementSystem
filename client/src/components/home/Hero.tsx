import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { slideImages, campusBuildingImages } from "@/lib/images";

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slideImages.length - 1 ? 0 : prev + 1));
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };
  
  return (
    <section className="relative h-[500px] overflow-hidden">
      <div className="relative h-full">
        {slideImages.map((slide, index) => (
          <div 
            key={index}
            className={`hero-slide absolute inset-0 bg-cover bg-center ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="absolute inset-0 bg-black/30"></div>
            <div className="container mx-auto px-4 h-full flex items-center">
              <div className="max-w-lg text-white">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">{slide.title}</h1>
                <p className="text-xl mb-6">{slide.description}</p>
                <Button className="px-6 py-3 bg-accent hover:bg-accent/90 text-white font-medium rounded-md transition">
                  {slide.buttonText}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Carousel Controls */}
      <div className="absolute bottom-5 left-0 right-0 flex justify-center space-x-2">
        {slideImages.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full bg-white ${
              index === currentSlide ? "opacity-100" : "opacity-50"
            }`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          ></button>
        ))}
      </div>
    </section>
  );
};

export default Hero;
