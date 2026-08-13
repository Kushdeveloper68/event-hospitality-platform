import React from "react";
import { Link } from "react-router-dom";

const FOOTER_LINKS = {
  Product: [
    { redirect: "#", content: "Features" },
    { redirect: "#", content: "API Reference" },
    { redirect: "#", content: "Integrations" },
    { redirect: "#", content: "Changelog" },
  ],
  Company: [
    { redirect: "#", content: "About Us" },
    { redirect: "#", content: "Careers" },
    { redirect: "#", content: "Success Stories" },
    { redirect: "#", content: "Contact" },
  ],
  Legal: [
    { redirect: "/privacy", content: "Privacy Policy" },
    { redirect: "/terms", content: "Terms of Service" },
    { redirect: "/manual", content: "User Manual" },
  ],
};

function Footer() {
  return (
    <footer className="bg-white dark:bg-surface-dark-soft border-t border-slate-200 dark:border-slate-800 pt-12 pb-8 sm:pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-10 mb-12">
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4 w-fit">
              <div className="size-8 rounded-lg flex items-center justify-center shrink-0">
                <img
                  src="/event-logo-with-icon-dark-bg-removebg-preview.png"
                  alt="EventCure Logo"
                  loading="lazy"
                />
              </div>
              <div>
                <p className="font-display text-card-h3 text-slate-900 dark:text-white tracking-tight leading-none">
                  EventCure
                </p>
                <p className="text-micro text-slate-400 dark:text-slate-500 tracking-wider uppercase mt-0.5">
                  Hospitality
                </p>
              </div>
            </Link>
            <p className="text-body text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
              The ultimate platform for enterprise hospitality management.
              Built for scale, designed for simplicity.
            </p>
          </div>

          {Object.entries(FOOTER_LINKS).map(([section, items]) => (
            <div key={section}>
              <h6 className="text-card-h3 text-slate-900 dark:text-white mb-4">
                {section}
              </h6>
              <ul className="space-y-3 text-body text-slate-500 dark:text-slate-400">
                {items.map((item) => (
                  <li key={item.content}>
                    <Link
                      className="hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                      to={item.redirect}
                    >
                      {item.content}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col-reverse sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
          <p className="text-caption text-slate-500 dark:text-slate-500">
            © {new Date().getFullYear()} EventCure Inc. All rights reserved.
            <span className="mx-2">•</span>
            <a
              href="https://kushdeveloper.me"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
            >
              Made by Kush Developer
            </a>
          </p>
          <div className="flex gap-5">
            <a
              className="text-slate-400 dark:text-slate-500 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
              href="#"
              aria-label="Twitter"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
              </svg>
            </a>
            <a
              className="text-slate-400 dark:text-slate-500 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
              href="#"
              aria-label="LinkedIn"
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