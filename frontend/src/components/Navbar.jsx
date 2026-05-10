import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  CalendarDays,
  LogOut,
  Plus
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

export const Navbar = () => {

  const [isOpen, setIsOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const profileMenuRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const userName = user?.name || "";
  const userRole = user?.role || "";

  const navLinkClass = (path) => {

    return `text-sm font-medium transition ${
      location.pathname === path
        ? "text-slate-950 font-semibold"
        : "text-slate-600 hover:text-slate-950"
    }`;

  };

  /* ===========================
     CLOSE PROFILE MENU
  =========================== */
  useEffect(() => {

    const handleClickOutside = (event) => {

      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setShowProfileMenu(false);
      }

    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };

  }, []);

  /* ===========================
     LOGOUT
  =========================== */
  const handleLogout = () => {

    logout();

    navigate("/login");

  };

  return (

    <nav className="sticky top-0 z-50 glass-nav border-b border-slate-200/50 bg-white/95 backdrop-blur-sm">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex justify-between items-center h-16">

          {/* LOGO */}
          <Link
            to="/"
            className="font-outfit text-xl font-bold text-slate-950 tracking-tight"
          >
            EventBook
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex gap-6 flex-1 justify-end items-center">

            <Link
              to="/"
              className={navLinkClass("/")}
            >
              Home
            </Link>

            <Link
              to="/about"
              className={navLinkClass("/about")}
            >
              About
            </Link>

            <Link
              to="/services"
              className={navLinkClass("/services")}
            >
              Services
            </Link>

            <Link
              to="/contact"
              className={navLinkClass("/contact")}
            >
              Contact
            </Link>

            {/* AUTH */}
            {!user ? (

              <>

                <Link
                  to="/login"
                  className={navLinkClass("/login")}
                >
                  Login
                </Link>

                <Link
                  to="/signup"
                  className="bg-slate-950 text-white text-sm px-5 py-2 rounded-lg hover:bg-slate-900"
                >
                  Sign up
                </Link>

              </>

            ) : (

              <div
                ref={profileMenuRef}
                className="relative"
              >

                {/* PROFILE BUTTON */}
                <button
                  onClick={() =>
                    setShowProfileMenu(!showProfileMenu)
                  }
                  className="flex items-center gap-3 hover:bg-slate-100 transition px-2 py-2 rounded-2xl"
                >

                  <div className="w-10 h-10 rounded-full bg-slate-950 text-white flex items-center justify-center text-sm font-medium">
                    {userName?.charAt(0)?.toUpperCase()}
                  </div>

                  <span className="text-sm font-medium text-slate-700">
                    {userName}
                  </span>

                </button>

                {/* PROFILE MENU */}
                {showProfileMenu && (

                  <div className="absolute right-0 mt-3 w-44 bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden z-50">

                    {/* USER MENU */}
                    {userRole === "user" && (

                      <>

                        <Link
                          to="/user-dashboard"
                          onClick={() => setShowProfileMenu(false)}
                          className="flex items-center gap-3 px-5 py-2 hover:bg-slate-100 transition"
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          Dashboard
                        </Link>

                        <Link
                          to="/mybookings"
                          onClick={() => setShowProfileMenu(false)}
                          className="flex items-center gap-3 px-5 py-2 hover:bg-slate-100 transition"
                        >
                          <CalendarDays className="w-4 h-4" />
                          My Bookings
                        </Link>

                      </>

                    )}

                    {/* PROVIDER MENU */}
                    {userRole === "provider" && (

                      <>

                        <Link
                          to="/provider-dashboard"
                          onClick={() => setShowProfileMenu(false)}
                          className="flex items-center gap-3 px-5 py-2 hover:bg-slate-100 transition"
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          Dashboard
                        </Link>

                        <Link
                          to="/add-service"
                          onClick={() => setShowProfileMenu(false)}
                          className="flex items-center gap-3 px-5 py-2 hover:bg-slate-100 transition"
                        >
                          <Plus className="w-4 h-4" />
                          Add Service
                        </Link>

                      </>

                    )}

                    {/* LOGOUT */}
                    <div className="border-t">

                      <button
                        onClick={() => {
                          handleLogout();
                          setShowProfileMenu(false);
                        }}
                        className="flex items-center gap-3 px-5 py-2.5 text-sm hover:bg-slate-100 transition w-full text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Log out
                      </button>

                    </div>

                  </div>

                )}

              </div>

            )}

          </div>

          {/* MOBILE BUTTON */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            ☰
          </button>

        </div>

      </div>

      {/* MOBILE MENU */}
      {isOpen && (

        <div className="md:hidden pb-4 space-y-1 border-t pt-3">

          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 text-sm"
          >
            Home
          </Link>

          <Link
            to="/about"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 text-sm"
          >
            About
          </Link>

          <Link
            to="/services"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 text-sm"
          >
            Services
          </Link>

          <Link
            to="/contact"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 text-sm"
          >
            Contact
          </Link>

          {!user ? (

            <Link
              to="/login"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 text-sm"
            >
              Login
            </Link>

          ) : (

            <>

              {/* USER MOBILE MENU */}
              {userRole === "user" && (

                <>

                  <Link
                    to="/user-dashboard"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 text-sm"
                  >
                    Dashboard
                  </Link>

                  <Link
                    to="/mybookings"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 text-sm"
                  >
                    My Bookings
                  </Link>

                </>

              )}

              {/* PROVIDER MOBILE MENU */}
              {userRole === "provider" && (

                <>

                  <Link
                    to="/provider-dashboard"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 text-sm"
                  >
                    Dashboard
                  </Link>

                  <Link
                    to="/add-service"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 text-sm"
                  >
                    Add Service
                  </Link>

                </>

              )}

              <button
                onClick={handleLogout}
                className="block px-3 py-2 text-sm text-left w-full"
              >
                Log out
              </button>

            </>

          )}

        </div>

      )}

    </nav>

  );

};