import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Star, ArrowLeft, CalendarDays, User, Clock } from "lucide-react";
import { useAuth } from "../context/AuthContext";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import toast from "react-hot-toast";

export const ServiceDetails = () => {

  const { id } = useParams();
  const navigate = useNavigate();

  const { user } = useAuth();

  const isProvider = user?.role === "provider";

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  /* ===========================
     FETCH SERVICE
  =========================== */
  useEffect(() => {

    const fetchService = async () => {

      try {

        const res = await fetch(
          `http://localhost:5000/api/services/${id}`
        );

        const data = await res.json();

        setService(data);

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);

      }

    };

    fetchService();

  }, [id]);

  /* ===========================
     LOADING
  =========================== */
  if (loading || !service) {

    return (

      <div className="flex justify-center items-center min-h-screen">

        <p>Loading service...</p>

      </div>

    );

  }

  /* ===========================
     CONFIRM BOOKING
  =========================== */
  const confirmBooking = async () => {

    if (!user) {
      navigate("/login");
      return;
    }

    if (!selectedDate) {
      alert("Please select a date");
      return;
    }

    try {

      const res = await fetch(
        "http://localhost:5000/api/bookings",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include",
          body: JSON.stringify({
            service_id: service.id,
            booking_date:
              selectedDate.toLocaleDateString("en-CA")
          })
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      toast.success("Booking request sent!");

      setTimeout(() => {

        navigate("/booking-success", {
          state: {
            serviceName: service.title
          }
        });

      }, 1000);

    } catch (err) {

      alert(err.message);

    }

  };

  return (

    <div className="bg-slate-50 min-h-screen px-6 py-10">

      <div className="max-w-7xl mx-auto">

        {/* BACK BUTTON */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 mb-6"
        >

          <ArrowLeft className="w-5 h-5" />

          <span className="text-sm font-semibold">
            Back
          </span>

        </button>

        <div className="grid lg:grid-cols-2 gap-8">

          {/* LEFT SIDE */}
          {!showCalendar ? (

            <img
              src={service.image}
              alt={service.title}
              className="rounded-2xl w-full h-[420px] object-cover shadow-xl"
            />

          ) : (

            <div className="bg-white border rounded-2xl p-9 shadow-xl">

              <h1 className="text-3xl font-bold text-slate-950 mb-6">
                Book Service
              </h1>

              <img
                src={service.image}
                alt={service.title}
                className="border rounded-xl w-full h-[300px] object-cover"
              />

              <h2 className="text-lg font-semibold mt-4">
                {service.title}
              </h2>

              <p className="font-semibold text-sm text-slate-500">
                {service.provider}
              </p>

              <div className="border-t mt-4 pt-4">

                <p className="font-semibold text-sm text-slate-400">
                  PRICE
                </p>

                <p className="text-xl font-bold">
                  ${service.price}
                </p>

              </div>

            </div>

          )}

          {/* RIGHT SIDE */}
          <div className="bg-white border rounded-2xl p-8 shadow-xl">

            {!showCalendar ? (

              <>

                {/* CATEGORY */}
                <span className="bg-slate-100 px-3 py-1 rounded-2xl text-sm">
                  {service.category}
                </span>

                {/* TITLE */}
                <h1 className="text-2xl font-bold mt-3">
                  {service.title}
                </h1>

                {/* RATING */}
                <div className="flex items-center gap-2 mt-2 text-sm">

                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />

                  <span className="font-semibold text-slate-900">
                    {Number(service.rating || 0).toFixed(1)}
                  </span>

                  <span className="text-slate-500">
                    ({service.reviewCount || 0} reviews)
                  </span>

                </div>

                {/* DESCRIPTION */}
                <p className="text-gray-500 text-sm mt-4 leading-relaxed">
                  {service.description || ""}
                </p>

                {/* PROVIDER */}
                <div className="flex items-center gap-2 mt-6 text-sm text-slate-500">

                  <User className="w-4 h-4" />

                  <p>Provider:</p>

                  <span className="font-semibold text-slate-700">
                    {service.provider}
                  </span>

                </div>

                {/* RESPONSE TIME */}
                <div className="flex items-center gap-2 mt-2 text-sm text-slate-500">

                  <Clock className="w-4 h-4" />

                  <p>Usually responds within 24 hours</p>

                </div>

                {/* PRICE + BUTTON */}
                <div className="border-t mt-6 pt-6">

                  <p className="font-semibold text-xs text-slate-400">
                    STARTING FROM
                  </p>

                  <p className="text-2xl font-bold">
                    ${service.price}
                  </p>

                  {!isProvider && (

                    <button
                      onClick={() => setShowCalendar(true)}
                      className="mt-6 w-full bg-slate-950 text-white py-3 rounded-lg hover:bg-slate-900 transition"
                    >
                      Book Now
                    </button>

                  )}

                </div>

              </>

            ) : (

              <>

                {/* BACK */}
                <button
                  onClick={() => setShowCalendar(false)}
                  className="flex items-center gap-2 text-sm text-slate-500 mb-3"
                >

                  <ArrowLeft className="w-5 h-5" />

                  <span className="text-sm font-semibold">
                    Back
                  </span>

                </button>

                {/* TITLE */}
                <div className="flex items-center gap-2">

                  <CalendarDays className="w-4 h-4" />

                  <p className="text-lg font-semibold">
                    Select Event Date
                  </p>

                </div>

                <p className="text-sm text-slate-500 mb-4">
                  Choose your preferred date for the event
                </p>

                {/* CALENDAR */}
                <div className="flex justify-center items-center">

                  <DatePicker
                    selected={selectedDate}
                    onChange={(date) => {

                      if (
                        selectedDate &&
                        date &&
                        selectedDate.toDateString() ===
                        date.toDateString()
                      ) {

                        setSelectedDate(null);

                      } else {

                        setSelectedDate(date);

                      }

                    }}
                    minDate={new Date()}
                    inline
                  />

                </div>

                {/* SELECTED DATE */}
                {selectedDate && (

                  <p className="text-center mt-2">

                    Selected:{" "}

                    {selectedDate.toLocaleDateString(
                      "en-US",
                      {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                      }
                    )}

                  </p>

                )}

                {/* CONFIRM BUTTON */}
                <button
                  disabled={!selectedDate}
                  onClick={confirmBooking}
                  className={`font-semibold mt-6 w-full py-3 rounded-lg ${
                    selectedDate
                      ? "bg-slate-950 text-white"
                      : "bg-slate-300 text-slate-500 cursor-not-allowed"
                  }`}
                >
                  Confirm Booking
                </button>

              </>

            )}

          </div>

        </div>

      </div>

    </div>

  );

};