import React from "react";
import { Link } from "react-router-dom";
function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 pt-16 pb-8 dark:bg-slate-950 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="text-primary">
                <svg
                  className="w-6 h-6"
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
              <span className="text-lg font-bold text-slate-900 dark:text-white">Event Hospitality</span>
            </div>
            <p className="text-gray-500 dark:text-slate-400 max-w-xs text-sm leading-relaxed">
              The ultimate platform for enterprise hospitality management. Built
              for scale, designed for simplicity.
            </p>
          </div>
          <div>
            <h6 className="font-bold text-gray-900 dark:text-white mb-4">Product</h6>

            <ul className="space-y-3 text-sm text-gray-600 dark:text-slate-400">
              {[
                {
                  redirect: "#",
                  content: "Features",
                },
                {
                  redirect: "#",
                  content: "API Reference",
                },
                {
                  redirect: "#",
                  content: "Integrations",
                },
                {
                  redirect: "#",
                  content: "Changelog",
                },
              ].map((item, index) => (
                <li key={index}>
                  <a
                    className="hover:text-primary transition-colors"
                    href={item.redirect}
                  >
                    {item.content}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h6 className="font-bold text-gray-900 dark:text-white mb-4">Company</h6>
            <ul className="space-y-3 text-sm text-gray-600 dark:text-slate-400">
              {[
                {
                  redirect: "#",
                  content: "About Us",
                },
                {
                  redirect: "#",
                  content: " Careers",
                },
                {
                  redirect: "#",
                  content: "Success Stories",
                },
                {
                  redirect: "#",
                  content: " Contact",
                },
              ].map((item, index) => (
                <li key={index}>
                  <a
                    className="hover:text-primary transition-colors"
                    href={item.redirect}
                  >
                    {item.content}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h6 className="font-bold text-gray-900 dark:text-white mb-4">Legal</h6>
            <ul className="space-y-3 text-sm text-gray-600 dark:text-slate-400">
              {[
                {
                  redirect: "#",
                  content: "Privacy Policy",
                },
                {
                  redirect: "#",
                  content: " Terms of Service",
                },
                {
                  redirect: "#",
                  content: "Security",
                },
              ].map((item, index) => (
                <li key={index}>
                  <a
                    className="hover:text-primary transition-colors"
                    href={item.redirect}
                  >
                    {item.content}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-gray-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500 dark:text-slate-500">
            © 2024 Event Hospitality Management Inc. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a
              className="text-gray-400 hover:text-primary transition-colors dark:text-slate-500 dark:hover:text-sky-400"
              href="#"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
              </svg>
            </a>
            <a
              className="text-gray-400 hover:text-primary transition-colors dark:text-slate-500 dark:hover:text-sky-400"
              href="#"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
