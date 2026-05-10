import { useNavigate } from "react-router-dom";
import { Camera, Music, Palette, Utensils, Sparkles, ClipboardList } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export const Footer = () => {

  const navigate = useNavigate();

  const {user} = useAuth();

  const handleCategoryNav = (category) => {
    navigate(`/services?category=${encodeURIComponent(category)}`);
  };

  return (
    <footer data-testid="footer" className="bg-slate-950 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          <div className="md:col-span-1">
            <h3 className="font-outfit text-lg font-bold tracking-tight mb-3">EventBook</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Discover and book the best event service providers for your special occasions.
            </p>
          </div>

          <div>
            <h4 className="font-outfit font-semibold text-sm tracking-wider uppercase text-slate-300 mb-3">Platform</h4>
            <div className="space-y-2">
              <span
                onClick={() => navigate("/services")}
                className="block text-slate-400 hover:text-white transition text-sm cursor-pointer"
              >
                Browse Services
              </span>

              <span
                onClick={() => navigate(
                  user?.role === "provider"
                    ? "/provider-dashboard"
                    : "/signup"
                )}
                className="block text-slate-400 hover:text-white transition text-sm cursor-pointer"
              >
                Become a Provider
              </span>
            </div>
          </div>

          <div>
            <h4 className="font-outfit font-semibold text-sm tracking-wider uppercase text-slate-300 mb-3">Categories</h4>
            <div className="space-y-2">

              <span
                onClick={() => handleCategoryNav("Photography")}
                className="block text-slate-400 hover:text-white transition text-sm cursor-pointer"
              >
                <Camera className="w-4 h-4 inline mr-2" />
                Photography
              </span>

              <span
                onClick={() => handleCategoryNav("DJ & Music")}
                className="block text-slate-400 hover:text-white transition text-sm cursor-pointer"
              >
                <Music className="w-4 h-4 inline mr-2" />
                DJ & Music
              </span>

              <span
                onClick={() => handleCategoryNav("Decoration")}
                className="block text-slate-400 hover:text-white transition text-sm cursor-pointer"
              >
                <Palette className="w-4 h-4 inline mr-2" />
                Decoration
              </span>

              <span
                onClick={() => handleCategoryNav("Catering")}
                className="block text-slate-400 hover:text-white transition text-sm cursor-pointer"
              >
                <Utensils className="w-4 h-4 inline mr-2" />
                Catering
              </span>

              <span
                onClick={() => handleCategoryNav("Makeup")}
                className="block text-slate-400 hover:text-white transition text-sm cursor-pointer"
              >
                <Sparkles className="w-4 h-4 inline mr-2" />
                Makeup
              </span>

              <span
                onClick={() => handleCategoryNav("Event Planning")}
                className="block text-slate-400 hover:text-white transition text-sm cursor-pointer"
              >
                <ClipboardList className="w-4 h-4 inline mr-2" />
                Event Planning
              </span>

            </div>
          </div>

          <div>
            <h4 className="font-outfit font-semibold text-sm tracking-wider uppercase text-slate-300 mb-3">Support</h4>
            <div className="space-y-2">
              <span className="block text-slate-400 text-sm">help@eventbook.com</span>
              <span className="block text-slate-400 text-sm">1-800-EVENT</span>
            </div>
          </div>

        </div>

        <div className="border-t border-slate-800 mt-10 pt-6 text-center">
          <p className="text-slate-500 text-xs">
            &copy; {new Date().getFullYear()} EventBook. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
};