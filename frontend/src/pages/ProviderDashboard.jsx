import { useNavigate } from "react-router-dom";
import {
  Package,
  CalendarDays,
  DollarSign,
  Plus,
  Pencil,
  Trash2,
  Check,
  X
} from "lucide-react";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export const ProviderDashboard = () => {

  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);

  const [loading, setLoading] = useState(true);

  // EDIT MODAL
  const [showEditModal, setShowEditModal] = useState(false);

  // DELETE MODAL
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [selectedServiceId, setSelectedServiceId] = useState(null);

  const [editForm, setEditForm] = useState({
    id: "",
    title: "",
    category: "",
    price: "",
    description: "",
    image: ""
  });
  /* ===========================
     FETCH DATA
  =========================== */
  useEffect(() => {

    const fetchData = async () => {

      try {

        // SERVICES
        const serviceRes = await fetch(
          "http://localhost:5000/api/services/my/services",
          {
            credentials: "include"
          }
        );

        const serviceData = await serviceRes.json();

        // BOOKINGS
        const bookingRes = await fetch(
          "http://localhost:5000/api/bookings/provider",
          {
            credentials: "include"
          }
        );

        const bookingData = await bookingRes.json();

        setServices(Array.isArray(serviceData) ? serviceData : []);
        setBookings(Array.isArray(bookingData) ? bookingData : []);

      } catch (err) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }

    };

    fetchData();

  }, []);

  /* ===========================
     DELETE SERVICE
  =========================== */
  const handleDelete = async () => {

    try {

      const res = await fetch(
        `http://localhost:5000/api/services/${selectedServiceId}`,
        {
          method: "DELETE",
          credentials: "include"
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      setServices(prev =>
        prev.filter(service => service.id !== selectedServiceId)
      );

      toast.success("Service deleted");

      setShowDeleteModal(false);

    } catch (err) {
      toast.error(err.message);
    }

  };

  /* ===========================
     EDIT SERVICE
  =========================== */
  const handleEditClick = (service) => {

    setEditForm({
      id: service.id,
      title: service.title,
      category: service.category,
      price: service.price,
      description: service.description || "",
      image: service.image || ""
    });

    setShowEditModal(true);

  };

  const handleEditChange = (e) => {

    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value
    });

  };

  const handleUpdateService = async () => {

    try {

      const res = await fetch(
        `http://localhost:5000/api/services/${editForm.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include",
          body: JSON.stringify(editForm)
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      setServices(prev =>
        prev.map(service =>
          service.id === editForm.id
            ? {
                ...service,
                ...editForm
              }
            : service
        )
      );

      setShowEditModal(false);

      toast.success("Service updated");

    } catch (err) {
      toast.error(err.message);
    }

  };

  /* ===========================
     UPDATE BOOKING STATUS
  =========================== */
  const updateBookingStatus = async (id, status) => {

    try {

      const res = await fetch(
        `http://localhost:5000/api/bookings/${id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include",
          body: JSON.stringify({ status })
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      setBookings(prev =>
        prev.map(booking =>
          booking.id === id
            ? { ...booking, status }
            : booking
        )
      );

      toast.success(
        status === "confirmed"
          ? "Booking accepted"
          : "Booking rejected"
      );

    } catch (err) {
      toast.error(err.message);
    }

  };

  /* ===========================
     STATS
  =========================== */
  const totalServices = services.length;

  const totalBookings = bookings.length;

  const earnings = bookings
    .filter(b => b.status === "confirmed")
    .reduce(
      (acc, curr) => acc + Number(curr.price || 0),
      0
    );

  return (

    <div className="min-h-screen bg-slate-50">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">

          <div>

            <h1 className="text-4xl font-bold tracking-tight text-slate-950">
              Provider Dashboard
            </h1>

            <p className="text-slate-500 mt-2 text-lg">
              Welcome back, Sahu Pavan
            </p>

          </div>

          <button
            onClick={() => navigate("/add-service")}
            className="bg-slate-950 text-white h-11 px-5 rounded-xl flex items-center gap-2 hover:bg-slate-900 transition"
          >
            <Plus className="w-4 h-4" />
            Add Service
          </button>

        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">

          {/* SERVICES */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-xs tracking-[0.2em] uppercase font-semibold text-slate-400">
                  Total Services
                </p>

                <h2 className="text-5xl font-bold text-slate-950 mt-3">
                  {totalServices}
                </h2>

              </div>

              <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
                <Package className="w-6 h-6 text-slate-500" />
              </div>

            </div>

          </div>

          {/* BOOKINGS */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-xs tracking-[0.2em] uppercase font-semibold text-slate-400">
                  Total Bookings
                </p>

                <h2 className="text-5xl font-bold text-slate-950 mt-3">
                  {totalBookings}
                </h2>

              </div>

              <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
                <CalendarDays className="w-6 h-6 text-slate-500" />
              </div>

            </div>

          </div>

          {/* EARNINGS */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-xs tracking-[0.2em] uppercase font-semibold text-slate-400">
                  Earnings
                </p>

                <h2 className="text-5xl font-bold text-slate-950 mt-3">
                  ${earnings}
                </h2>

                <p className="text-slate-500 mt-2 text-sm">
                  From accepted bookings
                </p>

              </div>

              <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-slate-500" />
              </div>

            </div>

          </div>

        </div>

        {/* BOTTOM */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">

          {/* BOOKINGS */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 min-h-[260px]">

            <h3 className="text-xl font-semibold text-slate-950 mb-6">
              Recent Booking Requests
            </h3>

            {loading ? (

              <div className="flex justify-center items-center h-[180px]">
                <p className="text-slate-400">Loading...</p>
              </div>

            ) : bookings.length === 0 ? (

              <div className="flex items-center justify-center h-[180px]">

                <p className="text-slate-400 text-lg">
                  No booking requests yet
                </p>

              </div>

            ) : (

              <div className="space-y-4">

                {bookings.map((booking) => (

                  <div
                    key={booking.id}
                    className="border rounded-xl p-4"
                  >

                    <div className="flex flex-col">

                      <div>

                        <h4 className="font-semibold text-slate-900">
                          {booking.title}
                        </h4>

                        <p className="text-sm text-slate-500 mt-1">
                          Date: {new Date(booking.booking_date).toLocaleDateString(
                            "en-US",
                            {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                              year: "numeric"
                            }
                          )}
                        </p>

                        <p className="text-sm text-slate-500 mt-1">
                          Customer: {booking.customer}
                        </p>

                      </div>

                    </div>

                    <div className="flex justify-end items-center gap-2 mt-4">

                      {booking.status === "pending" ? (

                        <>

                          {/* ACCEPT */}
                          <button
                            onClick={() =>
                              updateBookingStatus(
                                booking.id,
                                "confirmed"
                              )
                            }
                            className="w-7 h-7 rounded-full border border-green-500 flex items-center justify-center hover:bg-green-50 transition"
                          >

                           <Check className="w-4 h-4 text-green-600" />

                          </button>

                          {/* REJECT */}
                          <button
                            onClick={() =>
                              updateBookingStatus(
                                booking.id,
                                "cancelled"
                              )
                            }
                            className="w-7 h-7 rounded-full border border-red-500 flex items-center justify-center hover:bg-red-50 transition"
                          >

                           <X className="w-4 h-4 text-red-600"/>

                          </button>

                        </>

                      ) : booking.status === "confirmed" ? (

                        <span className="px-3 py-1 rounded-lg text-sm font-medium bg-blue-100 text-blue-700 border border-blue-200">
                          Accepted
                        </span>

                      ) : (

                        <span className="px-3 py-1 rounded-lg text-sm font-medium bg-red-100 text-red-700 border border-red-200">
                          Rejected
                        </span>

                      )}

                    </div>

                  </div>

                ))}

              </div>

            )}

          </div>

          {/* SERVICES */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 min-h-[260px]">

            <h3 className="text-xl font-semibold text-slate-950 mb-6">
              My Services
            </h3>

            {loading ? (

              <div className="flex justify-center items-center h-[180px]">
                <p className="text-slate-400">Loading...</p>
              </div>

            ) : services.length === 0 ? (

              <div className="flex flex-col items-center justify-center h-[180px]">

                <p className="text-slate-400 text-lg">
                  No services yet
                </p>

                <button
                  onClick={() => navigate("/add-service")}
                  className="mt-3 text-slate-950 font-medium hover:underline"
                >
                  Add your first service
                </button>

              </div>

            ) : (

              <div className="space-y-4">

                {services.map((service) => (

                  <div
                    key={service.id}
                    className="flex gap-4 border rounded-xl p-3"
                  >

                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-20 h-20 rounded-xl object-cover"
                    />

                    <div className="flex-1">

                      <h4 className="font-semibold text-slate-900">
                        {service.title}
                      </h4>

                      <p className="text-sm text-slate-500 mt-1">
                        {service.category}
                      </p>

                      <p className="font-semibold mt-2">
                        ${service.price}
                      </p>

                    </div>

                    <div className="flex flex-col gap-2">

                      <button
                        onClick={() => handleEditClick(service)}
                        className="border px-3 py-2 rounded-lg hover:bg-slate-100"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => {
                          setSelectedServiceId(service.id);
                          setShowDeleteModal(true);
                        }}
                        className="border border-red-200 text-red-600 px-3 py-2 rounded-lg hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                    </div>

                  </div>

                ))}

              </div>

            )}

          </div>

        </div>

      </div>

      {/* EDIT MODAL */}
      {showEditModal && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

            <div className="bg-white rounded-2xl p-6 w-full max-w-lg">

            <h2 className="text-2xl font-semibold text-slate-950 mb-6">
                Edit Service
            </h2>

            <form
                onSubmit={(e) => {
                e.preventDefault();
                handleUpdateService();
                }}
                className="space-y-4"
            >

                {/* TITLE */}
                <div>

                <label className="block text-sm text-slate-700 mb-2">
                    Title
                </label>

                <input
                    type="text"
                    name="title"
                    value={editForm.title}
                    onChange={(e) =>
                    setEditForm({
                        ...editForm,
                        title: e.target.value
                    })
                    }
                    className="w-full border rounded-xl px-4 h-11 outline-none"
                />

                </div>

                {/* CATEGORY */}
                <div>

                <label className="block text-sm text-slate-700 mb-2">
                    Category
                </label>

                <input
                    type="text"
                    name="category"
                    value={editForm.category}
                    onChange={(e) =>
                    setEditForm({
                        ...editForm,
                        category: e.target.value
                    })
                    }
                    className="w-full border rounded-xl px-4 h-11 outline-none"
                />

                </div>

                {/* PRICE */}
                <div>

                <label className="block text-sm text-slate-700 mb-2">
                    Price
                </label>

                <input
                    type="number"
                    name="price"
                    value={editForm.price}
                    onChange={(e) =>
                    setEditForm({
                        ...editForm,
                        price: e.target.value
                    })
                    }
                    className="w-full border rounded-xl px-4 h-11 outline-none"
                />

                </div>

                {/* DESCRIPTION */}
                <div>

                <label className="block text-sm text-slate-700 mb-2">
                    Description
                </label>

                <textarea
                    rows="4"
                    name="description"
                    value={editForm.description}
                    onChange={(e) =>
                    setEditForm({
                        ...editForm,
                        description: e.target.value
                    })
                    }
                    className="w-full border rounded-xl px-4 py-3 outline-none resize-none"
                />

                </div>

                {/* IMAGE URL */}
                <div>

                <label className="block text-sm text-slate-700 mb-2">
                    Image URL
                </label>

                <input
                    type="text"
                    name="image"
                    value={editForm.image}
                    onChange={(e) =>
                    setEditForm({
                        ...editForm,
                        image: e.target.value
                    })
                    }
                    className="w-full border rounded-xl px-4 h-11 outline-none"
                />

                </div>

                {/* BUTTONS */}
                <div className="flex justify-end gap-3 pt-2">

                <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="border px-5 h-11 rounded-xl hover:bg-slate-100"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    className="bg-slate-950 text-white px-5 h-11 rounded-xl hover:bg-slate-900"
                >
                    Save Changes
                </button>

                </div>

            </form>

            </div>

        </div>

        )}

      {/* DELETE MODAL */}
      {showDeleteModal && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white rounded-2xl p-6 w-full max-w-md">

            <h2 className="text-2xl font-semibold text-slate-950">
              Delete Service
            </h2>

            <p className="text-slate-500 mt-3">
              Are you sure you want to delete this service?
            </p>

            <div className="flex justify-end gap-3 mt-8">

              <button
                onClick={() => setShowDeleteModal(false)}
                className="border px-5 h-11 rounded-xl hover:bg-slate-100"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-5 h-11 rounded-xl hover:bg-red-700"
              >
                Delete
              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  );

};