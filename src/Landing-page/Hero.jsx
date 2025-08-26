import { Link } from "react-router-dom";

const Hero = () => {
  const isLoggedIn =
    typeof window !== "undefined" && localStorage.getItem("session");

  return (
    <section
      className="relative isolate overflow-hidden min-h-screen px-4 py-20 md:py-[8rem] md:px-8 bg-black"
      id="home"
    >
      {/* BACKGROUND BLOBS */}
      <div className="absolute top-0 left-1/2 -z-10 h-[300px] w-[720px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-[#1de4bf] via-[#0bf3a2] to-transparent opacity-20 blur-[160px]" />
      <div className="absolute bottom-10 right-10 -z-10 h-[200px] w-[200px] rounded-full bg-[#1de4bf33] blur-[140px] opacity-10" />
      <div className="absolute top-1/2 left-0 -z-10 h-[400px] w-[400px] rounded-full bg-gradient-to-br from-[#1de4bf] to-transparent opacity-10 blur-[120px]" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          {/* LEFT SIDE - TEXT CONTENT */}
          <div className="lg:pt-4 lg:pr-8">
            <div className="lg:max-w-lg">
              <div className="text-white space-y-8">
                <div className="space-y-6">
                  <h1 className="font-semibold text-[48px] sm:text-[56px] lg:text-[64px] leading-tight tracking-tight">
                    One-Time Links That
                    <br />
                    <span className="bg-gradient-to-r from-[#1de4bf] to-[#0bf3a2] text-transparent bg-clip-text">
                      Self-Destruct
                    </span>
                  </h1>

                  <p className="text-lg sm:text-xl text-gray-300 leading-relaxed w-[28rem] font-normal">
                    Share sensitive files and links that automatically delete
                    themselves after being viewed. Complete privacy, zero traces
                    left behind.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row flex-nowrap gap-4 pt-4">
                  {isLoggedIn ? (
                    <Link
                      to="/dashboard"
                      className="group relative bg-gradient-to-r from-[#1de4bf] to-[#0bf3a2] text-black font-medium px-8 py-4 rounded-full text-base focus:outline-none focus:ring-2 focus:ring-[#1de4bf] focus:ring-offset-2 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl flex items-center justify-center"
                    >
                      <span className="relative z-10">Go to Dashboard</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-[#0bf3a2] to-[#1de4bf] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </Link>
                  ) : (
                    <>
                      <Link
                        to="/register"
                        className="group relative bg-gradient-to-r from-[#1de4bf] to-[#0bf3a2] text-black font-medium px-8 py-4 rounded-full text-base focus:outline-none focus:ring-2 focus:ring-[#1de4bf] focus:ring-offset-2 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl flex items-center justify-center"
                      >
                        <span className="relative z-10">
                          Start Sharing Securely
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-[#0bf3a2] to-[#1de4bf] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </Link>
                      <Link
                        to="/login"
                        className="group relative bg-transparent text-white border-2 border-white/30 font-medium px-8 py-4 rounded-full text-base focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 transition-all duration-300 hover:bg-white hover:text-black hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl flex items-center justify-center"
                      >
                        Sign In
                      </Link>
                    </>
                  )}
                </div>

                <div className="text-sm text-gray-400 font-normal">
                  No credit card required. Get started for free.
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - DASHBOARD IMAGE */}
          <img
            src="/dashboard.png"
            alt="LinkNuke Dashboard"
            className="w-3xl max-w-md md:max-w-none rounded-xl shadow-xl ring-1 ring-white/10 sm:w-228 md:-ml-4 lg:-ml-0 lg:w-[130%] lg:-mr-28 xl:w-[150%] xl:-mr-56"
            style={{
              filter: "drop-shadow(0 20px 40px rgba(29, 228, 191, 0.2))",
              boxShadow: "0 60px 120px rgba(0, 0, 0, 0.6)",
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
