import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Search, Star } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export const Services = () => {

  const navigate = useNavigate();
  const { user } = useAuth();

  const [searchParams, setSearchParams] = useSearchParams();

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const rawCategory = searchParams.get("category");
  const rawSearch = searchParams.get("search");

  const [activeCategory, setActiveCategory] = useState(
    rawCategory ? decodeURIComponent(rawCategory) : "all"
  );

  const [search, setSearch] = useState(
    rawSearch ? decodeURIComponent(rawSearch) : ""
  );

  const [debouncedSearch, setDebouncedSearch] = useState(search);

  /* ===========================
     DEBOUNCE SEARCH
  =========================== */
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  /* ===========================
     SYNC URL → STATE
  =========================== */
  useEffect(() => {

    const rawCategory = searchParams.get("category");
    const rawSearch = searchParams.get("search");

    setActiveCategory(rawCategory ? decodeURIComponent(rawCategory) : "all");
    setSearch(rawSearch ? decodeURIComponent(rawSearch) : "");

  }, [searchParams]);

  /* ===========================
     FETCH SERVICES
  =========================== */
  useEffect(() => {

    setLoading(true);

    const params = new URLSearchParams();

    if (activeCategory !== "all") {
      params.append("category", activeCategory);
    }

    if (debouncedSearch.trim()) {
      params.append("search", debouncedSearch.trim());
    }

    fetch(`http://localhost:5000/api/services?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        setServices(Array.isArray(data) ? data : []);
      })
      .catch(() => setServices([]))
      .finally(() => setLoading(false));

  }, [activeCategory, debouncedSearch]);

  /* ===========================
     CATEGORY CLICK
  =========================== */
  const handleCategory = (cat) => {

    const p = new URLSearchParams(searchParams);

    if (cat === "all") {
      p.delete("category");
    } else {
      p.set("category", cat);
    }

    setSearchParams(p);
  };

  /* ===========================
     SEARCH INPUT
  =========================== */
  const handleSearch = (e) => {

    const value = e.target.value;
    setSearch(value);

    const p = new URLSearchParams(searchParams);

    const searchValue = value.toLowerCase().trim();

    const categoryMap = {
      photography: "Photography",
      dj: "DJ & Music",
      decoration: "Decoration",
      catering: "Catering",
      makeup: "Makeup",
      planning: "Event Planning"
    };

    const matchedCategory = Object.entries(categoryMap).find(([key, label]) =>
      key.includes(searchValue) || label.toLowerCase().includes(searchValue)
    );

    if (value.trim()) {
      p.set("search", value);

      if (matchedCategory) {
        p.set("category", matchedCategory[1]);
      } else {
        p.delete("category");
      }

    } else {
      p.delete("search");
      p.delete("category");
    }

    setSearchParams(p);
  };

  /* ===========================
     NAVIGATION
  =========================== */
  const handleServiceClick = (id) => {
    if (!user) return navigate("/login");
    navigate(`/service/${id}`);
  };

  const categories = [
    "all",
    "Photography",
    "DJ & Music",
    "Decoration",
    "Catering",
    "Makeup",
    "Event Planning"
  ];

  /* ===========================
     UI
  =========================== */
  return (

    <div className="max-w-full mx-auto px-20 py-10 bg-[#F8FAFC]">

      <h1 className="text-3xl font-bold text-slate-900">Services</h1>
      <p className="text-slate-500 mt-1">
        Browse and discover event service providers
      </p>

      {/* SEARCH */}
      <div className="mt-6 relative max-w-xl">
        <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />

        <input
          type="text"
          value={search}
          onChange={handleSearch}
          placeholder="Search services..."
          className="w-full pl-10 pr-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-slate-600 bg-white text-slate-900"
        />
      </div>

      {/* CATEGORY */}
      <div className="flex gap-2 mt-6 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategory(cat)}
            className={`h-9 px-4 border rounded-lg text-sm transition hover:bg-slate-900 hover:text-white
              ${activeCategory === cat
                ? "bg-slate-900 text-white"
                : "bg-white text-slate-600"
              }
            `}
          >
            {cat === "all" ? "All" : cat}
          </button>
        ))}
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">

        {loading ? (

          <div className="col-span-full flex flex-col justify-center items-center py-20 gap-2">
            <div className="w-8 h-8 border-4 border-slate-300 border-t-slate-900 rounded-full animate-spin"></div>
            <p className="text-slate-500 text-lg">Loading...</p>
          </div>

        ) : services.length === 0 ? (

          <div className="col-span-full flex justify-center items-center py-20">
            <p className="text-slate-500 text-lg">No services found</p>
          </div>

        ) : (

          services.map((service) => (

            <div
              key={service.id}
              onClick={() => handleServiceClick(service.id)}
              className="bg-[#FFFFFF] rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-xl transition overflow-hidden group cursor-pointer"
            >

              {/* IMAGE */}
              <div className="overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-52 object-cover transition duration-300 group-hover:scale-105"
                />
              </div>

              <div className="p-4">

                {/* CATEGORY + RATING */}
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

                {/* DESCRIPTION */}
                <p className="text-gray-500 text-sm mt-1 line-clamp-1">
                  {service.description || ""}
                </p>

                {/* PRICE + PROVIDER */}
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

    </div>
  );
};