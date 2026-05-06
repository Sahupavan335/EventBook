import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export const BookingSuccess = () => {

  const [latestBooking, setLatestBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchLatestBooking = async () => {

      try {

        const res = await fetch("http://localhost:5000/api/bookings/my", {
          credentials: "include"
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message);
        }

        // ✅ get latest booking (first item if sorted DESC)
        setLatestBooking(data[0]);

      } catch (err) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }

    };

    fetchLatestBooking();

  }, []);

  return (

    <div className="min-h-[80vh] flex items-center justify-center bg-slate-50">

      <div className="text-center max-w-md">

        {/* icon */}
        <div className="flex justify-center">
          <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-600"/>
          </div>
        </div>

        {/* title */}
        <h1 className="text-2xl font-semibold mt-6">
          Booking Confirmed!
        </h1>

        {/* loading */}
        {loading ? (
          <p className="text-slate-400 mt-2">
            Loading booking details...
          </p>
        ) : (

          <p className="text-slate-500 mt-2">

            Your booking request for

            <span className="font-medium">
              {" "} {latestBooking?.title || "this service"} {" "}
            </span>

            has been sent to the provider 
            <span className="font-medium">
            {" "} {latestBooking?.provider} {" "}
            </span>
            for approval.
          </p>

        )}

        {/* buttons */}
        <div className="mt-6 flex gap-3 justify-center">

          <Link to="/mybookings">
            <button className="bg-slate-950 text-white px-5 py-2 rounded-lg hover:bg-slate-900 transition">
              View My Bookings
            </button>
          </Link>

          <Link to="/services">
            <button className="border px-5 py-2 rounded-lg hover:bg-slate-100 transition">
              Browse More
            </button>
          </Link>

        </div>

      </div>

    </div>

  );

};