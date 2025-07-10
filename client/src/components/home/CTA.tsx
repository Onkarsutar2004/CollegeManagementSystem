import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const CTA = () => {
  return (
    <section className="py-16 bg-primary-800 text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Shape Your Future?</h2>
          <p className="text-lg mb-8 opacity-90">
            Take the first step towards a transformative educational experience that will prepare you for a successful career and meaningful life.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/register">
              <Button className="px-6 py-3 bg-white text-primary-800 font-medium rounded-md hover:bg-gray-100 transition">
                Apply Now
              </Button>
            </Link>
            <Link href="/visit">
              <Button variant="outline" className="px-6 py-3 bg-transparent border-2 border-white text-white font-medium rounded-md hover:bg-white/10 transition">
                Schedule a Visit
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
