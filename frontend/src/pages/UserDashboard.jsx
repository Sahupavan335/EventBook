import { Link } from "react-router-dom";
import { CalendarDays, Clock, CheckCircle, User } from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";

export const UserDashboard = () => {

  const { user } = useAuth();

  const userName = user?.name || "User";
  const userEmail = user?.email || "user@email.com";
  const role = user?.role || "user";

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [total, setTotal] = useState(0);
  const [pending, setPending] = useState(0);
  const [completed, setCompleted] = useState(0);


  // ✅ fetch bookings from backend
  useEffect(() => {

    const fetchBookings = async () => {

      try {

        const res = await fetch("http://localhost:5000/api/bookings/my", {
          credentials: "include"
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message);
        }

        setBookings(data);

        // ✅ calculate stats
        setTotal(data.length);

        setPending(
          data.filter(b => b.status === "pending").length
        );

        setCompleted(
          data.filter(b => b.status === "completed").length
        );

      } catch (err) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }

    };

    fetchBookings();

  }, []);


  // ✅ loader
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading dashboard...</p>
      </div>
    );
  }


  return (

    <div className="min-h-screen bg-slate-50">

      <div className="max-w-7xl mx-auto px-6 py-10">

        <h1 className="text-3xl font-bold text-slate-900">
          Dashboard
        </h1>

        <p className="text-slate-500 mt-1">
          Welcome back, {userName}
        </p>


        {/* stats */}
        <div className="grid md:grid-cols-3 gap-6 mt-8">

          <div className="bg-white border rounded-xl p-6 flex justify-between items-center">
            <div>
              <p className="text-xs tracking-wider text-slate-400">
                TOTAL BOOKINGS
              </p>
              <h2 className="text-2xl font-bold mt-2">
                {total}
              </h2>
            </div>
            <CalendarDays className="text-slate-400" />
          </div>

          <div className="bg-white border rounded-xl p-6 flex justify-between items-center">
            <div>
              <p className="text-xs tracking-wider text-slate-400">
                PENDING
              </p>
              <h2 className="text-2xl font-bold mt-2">
                {pending}
              </h2>
              <p className="text-xs text-slate-500">
                Awaiting confirmation
              </p>
            </div>
            <Clock className="text-slate-400" />
          </div>

          <div className="bg-white border rounded-xl p-6 flex justify-between items-center">
            <div>
              <p className="text-xs tracking-wider text-slate-400">
                COMPLETED
              </p>
              <h2 className="text-2xl font-bold mt-2">
                {completed}
              </h2>
            </div>
            <CheckCircle className="text-slate-400" />
          </div>

        </div>


        {/* profile + bookings */}
        <div className="grid md:grid-cols-2 gap-6 mt-8">

          {/* profile */}
          <div className="bg-white border rounded-xl p-6">

            <div className="flex items-center gap-2 mb-4">
              <User className="w-4 h-4" />
              <h3 className="font-semibold">
                Profile
              </h3>
            </div>

            <div className="space-y-3 text-sm">

              <div>
                <p className="text-slate-400 text-xs">NAME</p>
                <p className="text-slate-700">{userName}</p>
              </div>

              <div>
                <p className="text-slate-400 text-xs">EMAIL</p>
                <p className="text-slate-700">{userEmail}</p>
              </div>

              <div>
                <p className="text-slate-400 text-xs">ROLE</p>
                <span className="bg-slate-100 px-2 py-1 rounded text-xs">
                  {role}
                </span>
              </div>

            </div>

          </div>


          {/* recent bookings */}
          <div className="bg-white border rounded-xl p-6">

            <div className="flex justify-between items-center">
              <h3 className="font-semibold">
                Recent Bookings
              </h3>
              <Link to="/mybookings" className="text-sm text-slate-500">
                View All
              </Link>
            </div>

            {bookings.length === 0 ? (

              <p className="text-sm text-slate-400 mt-6">
                No bookings yet
              </p>

            ) : (

              bookings.slice(0, 3).map(booking => (

                <div
                  key={booking.id}
                  className="flex items-center justify-between mt-6"
                >

                  <div className="flex items-center gap-3">

                    <img
                      src={booking.image}
                      className="w-10 h-10 rounded-md object-cover"
                    />

                    <div>
                      <p className="text-sm font-medium">
                        {booking.title}
                      </p>

                      <p className="text-xs text-slate-400">
                        {new Date(booking.booking_date).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric"
                        })}
                      </p>
                    </div>

                  </div>

                  <span
                    className={`px-3 py-1 rounded-lg text-sm font-medium border
                      ${
                        booking.status === "pending"
                          ? "bg-yellow-100 text-yellow-700 border-yellow-200"

                        : booking.status === "confirmed"
                          ? "bg-blue-100 text-blue-700 border-blue-200"

                        : booking.status === "cancelled"
                          ? "bg-red-100 text-red-700 border-red-200"

                        : booking.status === "completed"
                          ? "bg-green-100 text-green-700 border-green-200"

                        : "bg-slate-100 text-slate-700 border-slate-200"
                      }
                    `}
                  >
                    {booking.status === "confirmed"
                      ? "Accepted"
                      : booking.status.charAt(0).toUpperCase() +
                        booking.status.slice(1)}
                  </span>

                </div>

              ))

            )}

          </div>

        </div>

      </div>

    </div>

  );

};