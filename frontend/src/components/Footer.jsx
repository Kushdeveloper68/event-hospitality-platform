import React from "react";
import { Link } from "react-router-dom";

const FOOTER_LINKS = {
  Product: [
    { redirect: "/#product", content: "Features" },
    { redirect: "/#how-it-works", content: "How it Works" },
    { redirect: "/#tutorial", content: "Watch Tutorial" },
    { redirect: "/import-guide", content: "Bulk Import" },
  ],
  Resources: [
    { redirect: "/manual", content: "User Manual" },
    { redirect: "/templates/guests-template.csv", content: "Guest CSV Template", download: true },
    { redirect: "/templates/rooms-template.csv", content: "Room CSV Template", download: true },
    { redirect: "/templates/team-template.csv", content: "Team CSV Template", download: true },
  ],
  Legal: [
    { redirect: "/privacy", content: "Privacy Policy" },
    { redirect: "/terms", content: "Terms of Service" },
    { redirect: "mailto:hello.eventcure@gmail.com", content: "Contact Support" },
  ],
};

function FooterLink({ item }) {
  const commonClasses =
    "hover:text-primary-500 dark:hover:text-primary-400 transition-colors";

  // Plain file downloads and mailto: links need a real <a>, not the router's <Link>
  if (item.download || item.redirect.startsWith("mailto:")) {
    return (
      <a
        href={item.redirect}
        download={item.download || undefined}
        className={commonClasses}
      >
        {item.content}
      </a>
    );
  }

  return (
    <Link className={commonClasses} to={item.redirect}>
      {item.content}
    </Link>
  );
}

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
              The live operations workspace for event teams — guests, rooms,
              transport and service requests, all in one place.
            </p>
            <a
              href="mailto:hello.eventcure@gmail.com"
              className="inline-flex items-center gap-1.5 mt-4 text-body text-slate-500 dark:text-slate-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
            >
              <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
                mail
              </span>
              hello.eventcure@gmail.com
            </a>
          </div>

          {Object.entries(FOOTER_LINKS).map(([section, items]) => (
            <div key={section}>
              <h6 className="text-card-h3 text-slate-900 dark:text-white mb-4">
                {section}
              </h6>
              <ul className="space-y-3 text-body text-slate-500 dark:text-slate-400">
                {items.map((item) => (
                  <li key={item.content}>
                    <FooterLink item={item} />
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
              href="https://www.instagram.com/eventcure/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
