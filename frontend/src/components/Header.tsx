import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { logout } from "@/features/auth/authSlice";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logout());
    router.push("/");
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">
                DreamDwelling
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-8">
            <Link
              href="/"
              className={`nav-link ${
                router.pathname === "/" ? "text-blue-600" : "text-gray-600"
              }`}
            >
              Home
            </Link>
            <Link
              href="/properties"
              className={`nav-link ${
                router.pathname === "/properties"
                  ? "text-blue-600"
                  : "text-gray-600"
              }`}
            >
              Properties
            </Link>
            <Link
              href="/map"
              className={`nav-link ${
                router.pathname === "/map" ? "text-blue-600" : "text-gray-600"
              }`}
            >
              Map View
            </Link>
            <Link
              href="/neighborhoods"
              className={`nav-link ${
                router.pathname === "/neighborhoods"
                  ? "text-blue-600"
                  : "text-gray-600"
              }`}
            >
              Neighborhoods
            </Link>
          </nav>

          {/* User Nav */}
          <div className="hidden md:flex items-center">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link
                  href="/favorites"
                  className="text-gray-600 hover:text-blue-600"
                >
                  Saved Properties
                </Link>
                <div className="relative group">
                  <button className="flex items-center text-gray-600 hover:text-blue-600">
                    <span>Hello, {user?.first_name || "User"}</span>
                    <svg
                      className="ml-1 h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      ></path>
                    </svg>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md py-2 z-10 hidden group-hover:block">
                    <Link
                      href="/dashboard"
                      className="block px-4 py-2 text-gray-800 hover:bg-blue-50"
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-gray-800 hover:bg-blue-50"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left block px-4 py-2 text-gray-800 hover:bg-blue-50"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex space-x-4">
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-md text-gray-600 hover:text-gray-900"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-500 hover:text-gray-600 focus:outline-none"
            >
              {isMenuOpen ? (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  ></path>
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
            >
              Home
            </Link>
            <Link
              href="/properties"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
            >
              Properties
            </Link>
            <Link
              href="/map"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
            >
              Map View
            </Link>
            <Link
              href="/neighborhoods"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
            >
              Neighborhoods
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            {isAuthenticated ? (
              <div className="px-2 space-y-1">
                <div className="px-3 py-2 text-base font-medium text-gray-600">
                  Hello, {user?.first_name || "User"}
                </div>
                <Link
                  href="/favorites"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                >
                  Saved Properties
                </Link>
                <Link
                  href="/dashboard"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                >
                  Dashboard
                </Link>
                <Link
                  href="/profile"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="px-2 space-y-1">
                <Link
                  href="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  className="block px-3 py-2 rounded-md text-base font-medium text-blue-600 hover:bg-gray-100"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
