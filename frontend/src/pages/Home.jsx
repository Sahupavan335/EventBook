import bgImage from '../assets/Home-BG.png';
import GetStart from '../assets/GetStart-bg.png';
import { Search, ArrowRight, Star } from 'lucide-react';
import { Loader2 } from 'lucide-react';

import { Link, useNavigate } from 'react-router-dom';
import { CategoryCard } from '../components/CategoryCard';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = ["photography", "dj", "decoration", "catering", "makeup", "planning"];

const categoryMap = {
  photography: "Photography",
  dj: "DJ & Music",
  decoration: "Decoration",
  catering: "Catering",
  makeup: "Makeup",
  planning: "Event Planning"
};

export const Home = () => {

  const [services, setServices] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  /* ===========================
     FETCH SERVICES
  =========================== */
  useEffect(() => {

    const fetchServices = async () => {

      setLoading(true);

      try {
        const res = await fetch("http://localhost:5000/api/services?limit=6");
        const data = await res.json();

        setServices(Array.isArray(data) ? data : []); // ✅ SAFE FIX

      } catch (err) {
        console.error("Error fetching services:", err);
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();

  }, []);

  const featuredServices = services;

  /* ===========================
     SEARCH
  =========================== */
  const handleSearch = () => {

    if (!searchValue.trim()) return;

    const value = searchValue.toLowerCase().trim();

    let matchedCategory = null;

    for (let key in categoryMap) {
      if (key.includes(value) || categoryMap[key].toLowerCase().includes(value)) {
        matchedCategory = categoryMap[key];
        break;
      }
    }

    const url = matchedCategory
      ? `/services?search=${searchValue}&category=${matchedCategory}`
      : `/services?search=${searchValue}`;

    navigate(url);
  };

  /* ===========================
     CATEGORY CLICK
  =========================== */
  const handleCategoryClick = (cat) => {

    const mappedCategory = categoryMap[cat];

    
    navigate(`/services?category=${mappedCategory}`);
  };

  /* ===========================
     SERVICE CLICK
  =========================== */
  const handleServiceClick = (id) => {

    if (!user) {
      navigate("/login");
      return;
    }

    navigate(`/service/${id}`);
  };

  return (

    <div className="min-h-screen bg-[#F8FAFC]">

      {/* HERO */}
      <section
        className="relative overflow-hidden"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >

        <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/60 to-[#F8FAFC]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">

          <div className="max-w-2xl">

            <p className="text-xs tracking-[0.2em] uppercase font-semibold text-slate-500 mb-4">
              Event Services Marketplace
            </p>

            <h1 className="font-outfit text-4xl sm:text-5xl lg:text-6xl tracking-tight font-bold text-slate-950 mb-6">
              Find Perfect Services for Your Events
            </h1>

            <p className="text-base sm:text-lg text-slate-600 mb-8 leading-relaxed">
              Book photographers, DJs, decorators and caterers easily. Discover top-rated professionals for every occasion.
            </p>

            {/* SEARCH */}
            <div className="flex gap-2 max-w-lg items-center">

              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSearch();
                    }
                  }}
                  placeholder="Search services..."
                  className="w-full pl-10 pr-4 h-12 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                onClick={handleSearch}
                className="h-12 px-6 bg-slate-950 text-white rounded-lg hover:outline hover:outline-2 hover:outline-blue-500"
              >
                Search
              </button>

            </div>

          </div>

        </div>

      </section>

      {/* CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">

          {CATEGORIES.map((cat) => (
            <CategoryCard
              key={cat}
              categoryKey={cat}
              onClick={() => handleCategoryClick(cat)}
            />
          ))}

        </div>

      </section>

      {/* SERVICES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        <div className="flex items-center justify-between mb-8">

          <div>
            <h2 className="font-outfit text-2xl sm:text-3xl font-semibold text-slate-950">
              Featured Services
            </h2>

            <p className="text-slate-500 text-sm mt-1">
              Handpicked top-rated service providers
            </p>
          </div>

          <Link
            to="/services"
            className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-950 transition"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>

        </div>

        <div className="flex flex-wrap gap-6">

          {loading ? (

            <div className="w-full flex flex-col justify-center items-center py-20 gap-2">
              <div className="w-8 h-8 border-4 border-slate-300 border-t-slate-900 rounded-full animate-spin"></div>
              <p className="text-slate-500 text-lg">Loading...</p>
            </div>

          ) : services.length === 0 ? (

            <div className="w-full flex justify-center items-center py-20">
              <p className="text-slate-500 text-lg">No services found</p>
            </div>

          ) : (

            featuredServices.map((service) => (

              <div
                key={service.id}
                onClick={() => handleServiceClick(service.id)}
                className="bg-[#FFFFFF] rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-xl transition overflow-hidden w-full sm:w-[48%] lg:w-[32%] group cursor-pointer"
              >

                <div className="overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-52 object-cover transition duration-300 group-hover:scale-105"
                  />
                </div>

                <div className="p-4">

                  {/* TOP ROW */}
                  <div className="flex items-center justify-between text-sm">

                    <span className="bg-gray-100 px-2 py-1 rounded text-xs text-gray-600">
                      {service.category || "General"}
                    </span>

                    <div className="flex items-center gap-1">

                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />

                      <span className="font-semibold text-slate-900">
                        {Number(service.rating || 0).toFixed(1)}
                      </span>

                      <span className="text-slate-400 text-xs">
                        ({service.reviewCount || 0})
                      </span>

                    </div>

                  </div>

                  {/* TITLE */}
                  <h3 className="mt-3 font-semibold text-gray-900 line-clamp-1">
                    {service.title}
                  </h3>

                  {/* DESCRIPTION (NEW) */}
                  <p className="text-gray-500 text-sm mt-1 line-clamp-1">
                    {service.description || ""}
                  </p>

                  {/* PRICE + PROVIDER (SAME LINE) */}
                  <div className="mt-3 flex items-center justify-between">

                    <p className="font-semibold text-gray-900">
                      ${service.price}
                    </p>

                    <p className="text-gray-500 text-sm">
                      {service.provider || "Unknown"}
                    </p>

                  </div>

                </div>

              </div>

            ))

          )}

        </div>

      </section>

      {/* CTA */}
      <section
        className="relative overflow-hidden"
        style={{
          backgroundImage: `url(${GetStart})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >

        <div className="absolute inset-0 bg-slate-950/80" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">

          <h2 className="text-3xl font-semibold text-white mb-4">
            Are you a service provider?
          </h2>

          <p className="text-slate-300 mb-8 max-w-lg mx-auto">
            Join our marketplace and reach thousands of clients looking for your services.
          </p>
          
          <Link to={
              user?.role === "provider"
              ? "/provider-dashboard"
              : "/signup"
            }
          >
            <button className="bg-white text-slate-950 hover:bg-slate-100 rounded-lg px-8 h-11 font-medium">
              Get Started
            </button>
          </Link>

        </div>

      </section>

    </div>
  );
};