"use client";

import type { User } from "../page";
import LogoutButton from "./LogoutButton";
import { useMobileMenu } from "./hooks/useMobileMenu";
import { useState, useEffect } from "react";

export default function Navigate({ user, newticket }: { user: User; newticket: boolean }) {
  const role = user.role;
  const { isOpen, toggle, close } = useMobileMenu();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="fixed bg-white left-0 right-0 top-0 z-50 border-b border-slate-200 shadow-sm">
      <div className="px-4 py-4 sm:px-6 lg:px-12">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="text-xl sm:text-2xl font-bold text-[#007030] hover:text-[#104735] transition-colors">
            <span className="hidden sm:inline">University of Oregon</span>
            <span className="sm:hidden">UO</span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            {role === "admin" || role === "advisor" ? (
              <p className="text-sm text-slate-700">Co-pilot</p>
            ) : null}
            {!newticket ? (
              <a
                href="/editTicket"
                className="bg-[#007030] text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-[#104735] transition-colors"
              >
                New ticket
              </a>
            ) : null}
            <LogoutButton />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggle}
              className="p-2 rounded-md hover:bg-slate-100 transition-colors"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6 text-[#007030]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden border-t border-slate-200 mt-4 pt-4 space-y-3">
            {role === "admin" || role === "advisor" ? (
              <p className="text-sm text-slate-700 px-2">Co-pilot</p>
            ) : null}
            {!newticket ? (
              <a
                href="/editTicket"
                onClick={close}
                className="block bg-[#007030] text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-[#104735] transition-colors"
              >
                New ticket
              </a>
            ) : null}
            <div className="border-t border-slate-200 pt-3">
              <LogoutButton />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
