import {
  Camera,
  Music,
  Palette,
  Utensils,
  Sparkles,
  CalendarCheck,
  BadgeCheck,
  Zap,
  IndianRupee
} from "lucide-react";

export const About = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">

        <p className="text-sm tracking-widest text-gray-500 uppercase mb-4">
          ABOUT EVENT SERVICES PLATFORM
        </p>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
          We Connect You With Perfect
          <br />
          Event Service Professionals
        </h1>

        <p className="mt-6 text-gray-600 max-w-2xl">
          EventBook helps you discover and book trusted professionals for your
          special occasions. Whether it’s a wedding, birthday party, corporate
          function, or celebration, our platform makes it easy to find reliable
          photographers, DJs, decorators, caterers, makeup artists, and event planners.
        </p>

      </section>


      {/* Our Services */}
      <section className="max-w-7xl mx-auto px-6 py-10">

        <h2 className="text-2xl font-semibold text-gray-900 mb-8">
          Our Services
        </h2>

        <div className="grid md:grid-cols-3 gap-6">

          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-xl transition">

            <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-blue-50 mb-4">
              <Camera className="text-blue-600" />
            </div>

            <h3 className="font-semibold text-lg">
              Photography
            </h3>

            <p className="text-gray-600 mt-2 text-sm">
              Professional photographers for weddings, parties, corporate
              events, and personal celebrations.
            </p>

          </div>


          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-xl transition">

            <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-purple-50 mb-4">
              <Music className="text-purple-600" />
            </div>

            <h3 className="font-semibold text-lg">
              DJ & Music
            </h3>

            <p className="text-gray-600 mt-2 text-sm">
              Book DJs and music professionals to create the perfect
              entertainment experience for your event.
            </p>

          </div>


          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-xl transition">

            <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-pink-50 mb-4">
              <Palette className="text-pink-600" />
            </div>

            <h3 className="font-semibold text-lg">
              Decoration
            </h3>

            <p className="text-gray-600 mt-2 text-sm">
              Creative decorators to transform your venue with beautiful themes
              and customized designs.
            </p>

          </div>


          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-xl transition">

            <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-yellow-50 mb-4">
              <Utensils className="text-yellow-600" />
            </div>

            <h3 className="font-semibold text-lg">
              Catering
            </h3>

            <p className="text-gray-600 mt-2 text-sm">
              Professional catering services offering delicious food for all
              types of events.
            </p>

          </div>


          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-xl transition">

            <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-rose-50 mb-4">
              <Sparkles className="text-rose-600" />
            </div>

            <h3 className="font-semibold text-lg">
              Makeup Artists
            </h3>

            <p className="text-gray-600 mt-2 text-sm">
              Experienced makeup professionals to help you look your best for
              special occasions.
            </p>

          </div>


          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-xl transition">

            <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-green-50 mb-4">
              <CalendarCheck className="text-green-600" />
            </div>

            <h3 className="font-semibold text-lg">
              Event Planning
            </h3>

            <p className="text-gray-600 mt-2 text-sm">
              Expert event planners to organize and manage your events
              professionally and efficiently.
            </p>

          </div>

        </div>

      </section>


      {/* Why Choose Us */}
      <section className="max-w-7xl mx-auto px-6 py-16">

        <h2 className="text-2xl font-semibold text-gray-900 mb-10">
          Why Choose EventBook
        </h2>

        <div className="grid md:grid-cols-3 gap-8">

          <div>

            <BadgeCheck className="mb-3 text-blue-600" />

            <h3 className="font-semibold text-lg">
              Verified Professionals
            </h3>

            <p className="text-gray-600 mt-2 text-sm">
              We connect you with trusted and verified service providers.
            </p>

          </div>

          <div>

            <Zap className="mb-3 text-purple-600" />

            <h3 className="font-semibold text-lg">
              Easy Booking
            </h3>

            <p className="text-gray-600 mt-2 text-sm">
              Book services quickly with simple and user-friendly interface.
            </p>

          </div>

          <div>

            <IndianRupee className="mb-3 text-green-600" />

            <h3 className="font-semibold text-lg">
              Affordable Pricing
            </h3>

            <p className="text-gray-600 mt-2 text-sm">
              Compare prices and choose services that fit your budget.
            </p>

          </div>

        </div>

      </section>

    </div>
  );
};
