import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Navbar from "@/components/Navbar";

const CAROUSEL_IMAGES = [
  {
    id: 1,
    title: "Premium Coffee Selection",
    description: "Discover our finest coffee beans from around the world",
    image:
      "https://cdn.builder.io/api/v1/image/assets%2Faaf2fc6ee0af440db01ff41c78de501a%2F92fff2c14d274f829f70b9d4cbc3064e?format=webp&width=800",
  },
  {
    id: 2,
    title: "Specialty Coffee Blends",
    description: "Expertly curated blends for every taste",
    image:
      "https://cdn.builder.io/api/v1/image/assets%2Faaf2fc6ee0af440db01ff41c78de501a%2Fb64ce8927a4c4c43958d9ce53570d7f3?format=webp&width=800",
  },
  {
    id: 3,
    title: "Easy Pour Experience",
    description: "Convenient brewing solutions for coffee lovers",
    image:
      "https://cdn.builder.io/api/v1/image/assets%2Faaf2fc6ee0af440db01ff41c78de501a%2F6e11841ae24c47da81a489d07b09ee95?format=webp&width=800",
  },
  {
    id: 4,
    title: "Taste Excellence",
    description: "Experience the finest quality in every cup",
    image:
      "https://cdn.builder.io/api/v1/image/assets%2Faaf2fc6ee0af440db01ff41c78de501a%2Fd562816cde3a476394d18812848ee54f?format=webp&width=800",
  },
];

export default function Landing() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % CAROUSEL_IMAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % CAROUSEL_IMAGES.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + CAROUSEL_IMAGES.length) % CAROUSEL_IMAGES.length,
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section with Carousel */}
      <div className="relative h-96 md:h-[500px] w-full overflow-hidden">
        {CAROUSEL_IMAGES.map((image, index) => (
          <div
            key={image.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={image.image}
              alt={image.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center px-4">
                {image.title}
              </h2>
              <p className="text-lg md:text-xl mb-8 text-center px-4 opacity-90">
                {image.description}
              </p>
            </div>
          </div>
        ))}

        {/* Carousel Controls */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full transition"
        >
          <ChevronLeft className="w-6 h-6 text-gray-800" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full transition"
        >
          <ChevronRight className="w-6 h-6 text-gray-800" />
        </button>

        {/* Dot Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {CAROUSEL_IMAGES.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide
                  ? "bg-white w-8"
                  : "bg-white/50 hover:bg-white/75"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Features Section */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
          Why Choose Us?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Easy to Use",
              description:
                "Our intuitive interface makes managing products simple and effortless",
              icon: "✨",
            },
            {
              title: "Secure Storage",
              description: "Your data is safely stored locally on your device",
              icon: "🔒",
            },
            {
              title: "Fast Performance",
              description:
                "Lightning-fast search and filter capabilities for your products",
              icon: "⚡",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200 hover:border-blue-400 hover:shadow-lg transition"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                {feature.title}
              </h3>
              <p className="text-gray-700">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Create an account and start managing your products today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100"
              >
                Sign Up Now
              </Button>
            </Link>
            <Link to="/login">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10"
              >
                Login
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400">
            © 2024 CoffeeHub. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
