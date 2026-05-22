import React from "react";
import {Footer} from '../../components';

function PlatformLandingPage() {
  return (
    <div className="bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-950/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="text-primary">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  viewBox="0 0 48 48"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z"
                    fill="currentColor"
                  ></path>
                </svg>
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Event Hospitality
              </span>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <a
                className="text-sm font-medium text-slate-600 hover:text-primary transition-colors dark:text-slate-300"
                href="#features"
              >
                Features
              </a>
              <a
                className="text-sm font-medium text-slate-600 hover:text-primary transition-colors dark:text-slate-300"
                href="#how-it-works"
              >
                How it Works
              </a>
              <a
                className="text-sm font-medium text-slate-600 hover:text-primary transition-colors dark:text-slate-300"
                href="#pricing"
              >
                Pricing
              </a>
            </nav>
            <div className="flex items-center gap-3">
              <button className="hidden sm:block px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-gray-100 rounded-lg transition-all dark:text-slate-300 dark:hover:bg-slate-800">
                Login
              </button>
              <button className="px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-lg shadow-sm hover:bg-blue-700 transition-all">
                Signup
              </button>
            </div>
          </div>
        </div>
      </header>
      <main>
        {/* <!-- Hero Section --> */}
        <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-32 bg-linear-to-b from-white via-slate-50 to-slate-100 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-12 lg:gap-12 items-center">
              <div className="lg:col-span-6 text-left">
                <h1 className="text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-slate-900 mb-6 dark:text-white">
                  Streamline Your Event <br />
                  <span className="text-primary">Hospitality Operations</span>
                </h1>
                <p className="text-lg text-slate-600 leading-relaxed mb-10 max-w-xl dark:text-slate-300">
                  Move beyond messy spreadsheets. Centralize guest management,
                  room assignments, and service requests in one secure
                  enterprise platform built for high-stakes operations.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="px-8 py-4 bg-primary text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:bg-blue-700 transition-all text-lg">
                    Start Managing Events
                  </button>
                  <button className="px-8 py-4 bg-slate-100 text-slate-900 font-bold rounded-xl hover:bg-gray-200 transition-all text-lg flex items-center justify-center gap-2 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700">
                    <span className="material-symbols-outlined">
                      play_circle
                    </span>
                    Watch Demo
                  </button>
                </div>
                <div className="mt-8 flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                  <div className="flex -space-x-2">
                    <img
                      alt="User"
                      className="w-8 h-8 rounded-full border-2 border-slate-50 bg-gray-200 dark:border-slate-900 dark:bg-slate-700"
                      data-alt="User avatar profile picture"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCm1U2hjlGo7A-V1eolVGw6zWy3UEPmPut9zBAABESNi492uMxhJXuJwCLnziKA8F53m32EixYroF1E1JLRoogfO3qtKDEqtDtcnYgT0HRFHqGfgNEDY77p8cv4EiiYwYKEDJglDWr3AlYVU4q9ZAHLO4SD_NfRYaQm9gONE2VN_QJN9Q5EHOO-Q82hULYLOeHjGUdsmSDSncb8lQ-el4wuNPE_HKCbZQfJkROwE-pTfEaX_FLOORqdZf_9fzq1e-soxWZ3lseKanXc"
                    />
                    <img
                      alt="User"
                      className="w-8 h-8 rounded-full border-2 border-slate-50 bg-gray-200 dark:border-slate-900 dark:bg-slate-700"
                      data-alt="User avatar profile picture"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBNeSIovh25TIzV1x7O60sqZeGL2I7bXUF-lupKPiRGkXtSyZDBGK7-ameBW20iI_PJt1NK_8Qo4Xt2BLcld6jw6PWU_-RW8cNvm_0n8g7t2meHJIMgB6t1cndxNsj7SqPEseVZUzKbEgPBXSw4S8DQicSDdP73LRstKXbiwzIMq-X6-SlNUuVFW4ruOgP4gaoxs21WAMAnQznnU35Z7JccMQ5fwxwLTFyTATjlRYL9_MWnBjWHnP5wU6sFydaF4B-LijeEVr8TPDYe"
                    />
                    <img
                      alt="User"
                      className="w-8 h-8 rounded-full border-2 border-slate-50 bg-gray-200 dark:border-slate-900 dark:bg-slate-700"
                      data-alt="User avatar profile picture"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCIgLk7XmFEejDsAUizg_nqmiZfVkeq7CD4Dc_6y9OGkCyqkYTI9DapyL152hK-p-uczD8hDP5SFl2w2jbGm4xb3DNUwrWnfcJBvvgiwDkFa9XLJZ5k7J6AA4ljxlVTzF1-lfCrzy58Zrw8XLvCMbqfiJgndiCM83-pWB6zPvfXU5wayXmFa-4Ll4hXkExKIhdq5-APzsomya4WrwKKXV4bnHSOTmv0__dAMQNTaoXMJS3MihrWiAjIplyR7G16YDUILWjZ8KtaxXcW"
                    />
                  </div>
                  <span>Trusted by 500+ operations teams worldwide</span>
                </div>
              </div>
              <div className="mt-16 lg:mt-0 lg:col-span-6 relative">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
                  <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex gap-1.5 dark:bg-slate-800 dark:border-slate-700">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                  <div className="p-4">
                    <div
                      className="w-full bg-slate-100 aspect-4/3 rounded-lg animate-pulse dark:bg-slate-800"
                      style={{
                        backgroundImage:
                          "linear-gradient( 135deg, #f8fafc 0%, #e2e8f0 100% )",
                      }}
                    >
                      <div className="p-8 space-y-6">
                        <div className="h-8 bg-white rounded w-1/3 dark:bg-slate-900"></div>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="h-24 bg-white rounded-lg shadow-sm border border-gray-100 dark:bg-slate-900 dark:border-slate-800"></div>
                          <div className="h-24 bg-white rounded-lg shadow-sm border border-gray-100 dark:bg-slate-900 dark:border-slate-800"></div>
                          <div className="h-24 bg-white rounded-lg shadow-sm border border-gray-100 dark:bg-slate-900 dark:border-slate-800"></div>
                        </div>
                        <div className="h-48 bg-white rounded-lg shadow-sm border border-gray-100 dark:bg-slate-900 dark:border-slate-800"></div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* <!-- Decorative element --> */}
                <div className="absolute -z-10 -bottom-6 -right-6 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
              </div>
            </div>
          </div>
        </section>
        {/* <!-- Features Section --> */}
        <section className="py-24 bg-slate-50 dark:bg-slate-900/60" id="features">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-base font-bold text-primary tracking-wider uppercase mb-3">
                Enterprise Features
              </h2>
              <h3 className="text-4xl font-bold text-slate-900 tracking-tight dark:text-white">
                Powerful Tools for Operations Teams
              </h3>
              <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto dark:text-slate-300">
                Everything you need to manage high-stakes event hospitality at
                scale with zero friction.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* <!-- Feature Components --> */}
              <FeatureCompo/>
            </div>
          </div>
        </section>
        {/* <!-- How it Works Section --> */}
        <section className="py-24 bg-white dark:bg-slate-950" id="how-it-works">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight">
                Three Steps to Operational Excellence
              </h2>
            </div>
            <div className="relative">
              <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 -translate-y-1/2 hidden lg:block dark:bg-slate-800"></div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative">
                {[
                  {
                  step:1,
                  title:'Import Data',
                  desc:"Upload guest lists and inventory via CSV or connect directly through our API."
                },
                  {
                  step:2,
                  title:'Automate Assignments',
                  desc:"Our engine handles rules, tags, and proximity requirements in seconds."
                },
                  {
                  step:3,
                  title:'Monitor Real-time',
                  desc:"Track every movement and request from your centralized command dashboard."
                },
                ].map((item , index)=> (
                    // Steps 
                <div className="flex flex-col items-center text-center bg-white px-4 dark:bg-transparent" key={index}>
                  <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center font-bold text-2xl mb-6 shadow-lg z-10">
                   {item.step}
                  </div>
                  <h5 className="text-xl font-bold mb-2">{item.title}</h5>
                  <p className="text-slate-600 dark:text-slate-300">
                    {item.desc}
                  </p>
                </div>
                  
                ))}
              
               
              </div>
            </div>
          </div>
        </section>
        {/* <!-- Pricing Placeholder --> */}
        <section
          className="py-24 bg-slate-50 border-t border-gray-100 dark:bg-slate-900/60 dark:border-slate-800"
          id="pricing"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Pricing Plans</h2>
              <p className="text-slate-600 dark:text-slate-300">
                Simple, transparent pricing for teams of all sizes.
              </p>
            </div>
            <div className="max-w-3xl mx-auto bg-white border-2 border-dashed border-gray-300 rounded-3xl p-12 flex flex-col items-center justify-center text-center dark:bg-slate-900 dark:border-slate-700">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 dark:bg-slate-800">
                <span className="material-symbols-outlined text-4xl text-gray-400 dark:text-slate-500">
                  payments
                </span>
              </div>
              <h4 className="text-2xl font-bold text-slate-900 mb-2 dark:text-white">
                Custom Enterprise Pricing
              </h4>
              <p className="text-slate-600 mb-8 dark:text-slate-300">
                We offer flexible plans based on your event volume and guest
                count. Contact our sales team for a custom quote.
              </p>
              <button className="px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-blue-700 transition-colors">
                Contact Sales
              </button>
            </div>
          </div>
        </section>
        {/* <!-- CTA Section --> */}
        <section className="py-20 bg-primary">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-6">
              Ready to transform your hospitality operations?
            </h2>
            <p className="text-blue-100/90 text-xl mb-10 dark:text-blue-100">
              Join leading events teams using our platform to deliver
              world-className guest experiences.
            </p>
            <button className="px-10 py-5 bg-white text-primary font-black rounded-xl text-lg shadow-xl hover:bg-gray-50 transition-all transform hover:scale-105 dark:bg-slate-100 dark:hover:bg-white">
              Get Started for Free
            </button>
          </div>
        </section>
      </main>
      {/* <!-- Footer --> */}
      <Footer/>
    </div>
  );
}

const FeatureCompo = () => {
  let feature = [
    {
      icon: "group",
      title: "Guest Management",
      desc: "Centralized attendee database with real-time updates and segmented profile views.",
    },
    {
      icon: "bed",
      title: "Room Assignment",
      desc: "Automated room allocation engine that honors complex guest preferences instantly.",
    },
    {
      icon: "check_circle",
      title: "Check-in Tracking",
      desc: " Seamless QR and mobile-ready check-in workflows to eliminate guest queues.",
    },
    {
      icon: "notifications_active",
      title: "Service Requests",
      desc: "Instant task routing and status updates for floor staff via their mobile devices.",
    },
  ];
    return (
      <>
      {feature.map((item , index) => (
        <div
        className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow group dark:bg-slate-900 dark:border-slate-800"
        key={index}
      >
        <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
          <span className="material-symbols-outlined text-2xl">
            {item.icon}
          </span>
        </div>
        <h4 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">{item.title}</h4>
        <p className="text-gray-600 text-sm leading-relaxed dark:text-slate-300">{item.desc}</p>
      </div>
      ))}
      </>
    )
};

export default PlatformLandingPage;
