import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { User, CalendarDays } from "lucide-react";
import toast from "react-hot-toast";

export const MyBookings = () => {

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ NEW STATES (modal)
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  // ✅ fetch from backend
  useEffect(() => {

    const fetchBookings = async () => {

      try {

        const res = await fetch("http://localhost:5000/api/bookings/my", {
          credentials: "include"
        });

        const data = await res.json();

        console.log(data);
        
        if (!res.ok) {
          throw new Error(data.message);
        }

        setBookings(data);

      } catch (err) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }

    };

    fetchBookings();

  }, []);

  // ✅ OPEN MODAL
  const handleCancel = (id) => {
    setSelectedId(id);
    setShowModal(true);
  };

  // ✅ CONFIRM DELETE
  const confirmCancel = async () => {
    try {

      const res = await fetch(`http://localhost:5000/api/bookings/${selectedId}`, {
        method: "DELETE",
        credentials: "include"
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      // update UI
      setBookings(prev => prev.filter(b => b.id !== selectedId));

      setShowModal(false);

      toast.success("Booking cancelled");

    } catch (err) {
      toast.error(err.message);
    }
  };

  // ✅ loader
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading bookings...</p>
      </div>
    );
  }

  return (

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      <div className="max-w-7xl mx-auto">

        {/* title */}
        <div className="mb-8">

          <h1 className="text-3xl font-bold text-slate-950 tracking-tight">
            My Bookings
          </h1>

          <p className="text-slate-500 text-sm mt-1">
            Track and manage your service bookings
          </p>

        </div>

        {/* if no bookings */}
        {bookings.length === 0 ? (

          <div className="bg-white border border-slate-200 rounded-lg p-20 text-center">

            <p className="text-slate-500 text-lg">
              No bookings yet
            </p>

            <p className="text-slate-400 text-sm mt-1">
              Start by browsing our services
            </p>

            <Link to="/services">
              <button className="mt-6 bg-slate-950 text-white px-6 py-2 rounded-lg hover:bg-slate-900 transition">
                Browse services
              </button>
            </Link>

          </div>

        ) : (

          <div className="space-y-4">

            {bookings.map((booking) => (

              <div
                key={booking.id}
                className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-4"
              >

                {/* image */}
                <img
                  src={booking.image}
                  alt={booking.title}
                  className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                />

                {/* details */}
                <div className="flex-1 min-w-0">

                  <h3 className="font-semibold text-slate-950 text-base">
                    {booking.title}
                  </h3>

                  <p className="flex items-center gap-2 text-sm text-slate-500 mt-0.5">
                    <User className="w-4 h-4 text-slate-400" />
                    <span>Provider: {booking.provider}</span>
                  </p>

                  <p className="flex items-center gap-2 text-sm text-slate-400 mt-0.5">
                    <CalendarDays className="w-4 h-4" />
                    <span>
                      Event Date:{" "}
                      {new Date(booking.booking_date).toLocaleDateString("en-US", {
                        weekday: "short",
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                      })}
                    </span>
                  </p>

                </div>

                {/* right side */}
                <div className="flex items-center gap-3 flex-shrink-0">

                  {/* price */}
                  <span className="font-bold text-slate-950">
                    ${booking.price?.toLocaleString()}
                  </span>

                  {/* status */}
                  <span className="text-xs capitalize bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1 rounded-lg">
                    {booking.status}
                  </span>

                  {/* cancel */}
                  <button
                    onClick={() => handleCancel(booking.id)}
                    className="text-xs text-red-600 hover:bg-red-50 border border-red-200 px-3 py-1 rounded-lg transition"
                  >
                    Cancel
                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

      {/* ✅ MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-start justify-center z-50">

          <div className="bg-white rounded-2xl p-6 w-[90%] max-w-sm shadow-xl">

            <h2 className="text-lg font-semibold">
              Cancel Booking
            </h2>

            <p className="text-sm text-slate-500 mt-2">
              Are you sure you want to cancel this booking?
            </p>

            <div className="flex justify-end gap-3 mt-6">

              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg border hover:bg-slate-100"
              >
                No
              </button>

              <button
                onClick={confirmCancel}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                Yes, Cancel
              </button>

            </div>

          </div>

        </div>
      )}

    </div>

  );

};