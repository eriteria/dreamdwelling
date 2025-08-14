import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import Layout from "@/components/Layout";
import SearchFilter from "@/components/SearchFilter";

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push({
      pathname: "/properties",
      query: { q: searchQuery },
    });
  };

  return (
    <Layout>
      <Head>
        <title>DreamDwelling - Find Your Perfect Home</title>
        <meta
          name="description"
          content="DreamDwelling - The ultimate real estate platform to find your dream home for sale or rent."
        />
      </Head>

      {/* Hero Section - Apple-inspired minimalist design */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-6xl md:text-7xl font-light text-gray-900 mb-8 tracking-tight">
              Find Your
              <span className="block font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Dream Home
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto font-light leading-relaxed">
              Discover exceptional properties with our intelligent search
              platform.
              <br className="hidden md:block" />
              Beautiful homes are waiting for you.
            </p>

            <div className="max-w-3xl mx-auto mb-16">
              <SearchFilter />
            </div>

            {/* Scroll indicator */}
            <div className="animate-bounce mt-20">
              <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
                <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-light text-gray-900 mb-2">
                10k+
              </div>
              <div className="text-gray-600 font-medium">Properties Listed</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-light text-gray-900 mb-2">
                5k+
              </div>
              <div className="text-gray-600 font-medium">Happy Families</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-light text-gray-900 mb-2">
                200+
              </div>
              <div className="text-gray-600 font-medium">Cities Covered</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-light text-gray-900 mb-2">
                24/7
              </div>
              <div className="text-gray-600 font-medium">Expert Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties - Clean card design */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-6">
              Featured Properties
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Handpicked properties that showcase the best of what we offer
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Property Card 1 */}
            <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="h-64 bg-gradient-to-br from-blue-100 to-purple-100 relative overflow-hidden">
                <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="text-2xl font-light mb-2">Modern Villa</div>
                    <div className="text-sm opacity-80">
                      4 bed • 3 bath • $750,000
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  Luxury Downtown Villa
                </h3>
                <p className="text-gray-600 mb-4">
                  Stunning contemporary home with panoramic city views
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-light text-gray-900">
                    $750,000
                  </span>
                  <button className="text-blue-600 font-medium hover:text-blue-700">
                    View Details
                  </button>
                </div>
              </div>
            </div>

            {/* Property Card 2 */}
            <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="h-64 bg-gradient-to-br from-green-100 to-teal-100 relative overflow-hidden">
                <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="text-2xl font-light mb-2">
                      Garden Estate
                    </div>
                    <div className="text-sm opacity-80">
                      5 bed • 4 bath • $950,000
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  Suburban Garden Estate
                </h3>
                <p className="text-gray-600 mb-4">
                  Spacious family home with landscaped gardens
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-light text-gray-900">
                    $950,000
                  </span>
                  <button className="text-blue-600 font-medium hover:text-blue-700">
                    View Details
                  </button>
                </div>
              </div>
            </div>

            {/* Property Card 3 */}
            <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="h-64 bg-gradient-to-br from-orange-100 to-red-100 relative overflow-hidden">
                <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="text-2xl font-light mb-2">Beach House</div>
                    <div className="text-sm opacity-80">
                      3 bed • 2 bath • $680,000
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  Coastal Beach House
                </h3>
                <p className="text-gray-600 mb-4">
                  Charming oceanfront property with private beach access
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-light text-gray-900">
                    $680,000
                  </span>
                  <button className="text-blue-600 font-medium hover:text-blue-700">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Link
              href="/properties"
              className="inline-flex items-center px-8 py-4 bg-gray-900 text-white font-medium rounded-full hover:bg-gray-800 transition-colors"
            >
              Explore All Properties
              <svg
                className="ml-2 w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works - Apple-style process */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-6">
              Simple. Powerful. Effective.
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Finding your dream home has never been easier
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <div className="text-center group">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-8 group-hover:bg-blue-200 transition-colors">
                <svg
                  className="w-10 h-10 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-light text-gray-900 mb-4">Search</h3>
              <p className="text-gray-600 leading-relaxed">
                Use our intelligent search to discover properties that match
                your exact criteria and preferences.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-8 group-hover:bg-purple-200 transition-colors">
                <svg
                  className="w-10 h-10 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-light text-gray-900 mb-4">
                Explore
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Take virtual tours, view detailed photos, and explore
                neighborhoods to find your perfect match.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 group-hover:bg-green-200 transition-colors">
                <svg
                  className="w-10 h-10 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-light text-gray-900 mb-4">
                Connect
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Connect with trusted agents and schedule viewings with just a
                few taps. We handle the rest.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action - Minimalist design */}
      <section className="py-24 bg-gray-900 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-light mb-6">
            Your dream home awaits
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto font-light">
            Join thousands who've found their perfect property through
            DreamDwelling
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/properties"
              className="inline-flex items-center px-8 py-4 bg-white text-gray-900 font-medium rounded-full hover:bg-gray-100 transition-colors"
            >
              Browse Properties
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center px-8 py-4 bg-transparent text-white font-medium rounded-full border-2 border-white hover:bg-white hover:text-gray-900 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
