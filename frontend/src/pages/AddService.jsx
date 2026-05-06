import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export const AddService = () => {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    category: "",
    price: "",
    description: "",
    image: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);

    console.log(form);

    try {

      const res = await fetch("http://localhost:5000/api/services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
            title: form.title,
            category: form.category,
            price: Number(form.price),
            description: form.description,
            image: form.image
            })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      toast.success("Service created successfully!");

      setTimeout(() => {
        navigate("/provider-dashboard");
      }, 1200);

    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }

  };

  return (

    <div className="min-h-screen bg-slate-50 px-4 py-10">

      <div className="max-w-2xl mx-auto">

        {/* BACK */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {/* CARD */}
        <div className="bg-white border rounded-2xl p-8 shadow-sm">

          <h1 className="text-3xl font-bold text-slate-950 mb-8">
            Add New Service
          </h1>

          <form onSubmit={handleSubmit} className="space-y-3">

            {/* TITLE */}
            <div>

              <label className="block text-sm mb-2 text-slate-700">
                Title
              </label>

              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Premium Wedding Photography"
                className="w-full border rounded-xl px-4 h-12 outline-none"
                required
              />

            </div>

            {/* CATEGORY */}
            <div>

              <label className="block text-sm mb-2 text-slate-700">
                Category
              </label>

              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full border rounded-xl px-4 h-12 outline-none"
                required
              >
                <option value="">Select category</option>
                <option value="Photography">Photography</option>
                <option value="DJ & Music">DJ & Music</option>
                <option value="Decoration">Decoration</option>
                <option value="Catering">Catering</option>
                <option value="Makeup">Makeup</option>
                <option value="Event Planning">Event Planning</option>
              </select>

            </div>

            {/* PRICE */}
            <div>

              <label className="block text-sm mb-2 text-slate-700">
                Price ($)
              </label>

              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="1500"
                className="w-full border rounded-xl px-4 h-12 outline-none"
                required
              />

            </div>

            {/* DESCRIPTION */}
            <div>

              <label className="block text-sm mb-2 text-slate-700">
                Description
              </label>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows="4"
                placeholder="Describe your service in detail..."
                className="w-full border rounded-xl px-4 py-3 outline-none resize-none"
                required
              />

            </div>

            {/* IMAGE URL */}
            <div>

              <label className="block text-sm mb-2 text-slate-700">
                Image URL
              </label>

              <input
                type="text"
                name="image"
                value={form.image}
                onChange={handleChange}
                placeholder="https://images.unsplash.com/..."
                className="w-full border rounded-xl px-4 h-12 outline-none"
              />

              <p className="text-xs text-slate-400 mt-2">
                Leave empty for default image
              </p>

            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full h-12 rounded-xl text-white transition ${
                loading
                  ? "bg-slate-400 cursor-not-allowed"
                  : "bg-slate-950 hover:bg-slate-900"
              }`}
            >

              {loading ? (
                <div className="flex items-center justify-center gap-2">

                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>

                  Creating...

                </div>
              ) : (
                "Create Service"
              )}

            </button>

          </form>

        </div>

      </div>

    </div>

  );

};