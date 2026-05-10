export const Contact = () => {

  return (

    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-[#F8FAFC]">

      <div className="w-full max-w-xl">

        <div className="bg-white border border-slate-200/60 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8">


          {/* heading */}

          <div className="text-center mb-8">

            <h1 className="text-2xl font-bold text-slate-950">

              Contact Us

            </h1>

            <p className="text-sm text-slate-500 mt-1">

              Have questions? We'd love to hear from you.

            </p>

          </div>



          {/* form */}
          <form className="space-y-5">

            <div>

              <label className="text-sm font-medium text-slate-700">
                Full Name
              </label>

              <input
                type="text"
                placeholder="John Doe"
                className="mt-1.5 w-full h-11 px-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-slate-950 focus:border-transparent outline-none"
              />

            </div>


            <div>

              <label className="text-sm font-medium text-slate-700">
                Email
              </label>

              <input
                type="email"
                placeholder="name@gmail.com"
                className="mt-1.5 w-full h-11 px-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-slate-950 focus:border-transparent outline-none"
              />

            </div>


            <div>

              <label className="text-sm font-medium text-slate-700">
                Message
              </label>

              <textarea
                rows="4"
                placeholder="Write your message..."
                className="mt-1.5 w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-slate-950 focus:border-transparent outline-none resize-none"
              />

            </div>

            <button
              type="submit"
              className="w-full h-11 bg-slate-950 text-white hover:bg-slate-900 rounded-lg font-medium transition"
            >
              Send Message
            </button>

          </form>

        </div>

      </div>

    </div>

  );

};