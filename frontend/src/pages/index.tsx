import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import Layout from "@/components/Layout";
import SearchFilter from "@/components/SearchFilter";
import PropertyCard from "@/components/PropertyCard";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { fetchFeaturedProperties } from "@/features/properties/propertiesSlice";

export default function HomePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const { featuredProperties, isLoading } = useAppSelector(
    (state) => state.properties
  );

  // Fetch featured properties when component mounts
  useEffect(() => {
    dispatch(fetchFeaturedProperties());
  }, [dispatch]);

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
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-6xl md:text-7xl font-light text-gray-900 dark:text-white mb-8 tracking-tight transition-colors duration-300">
              Find Your
              <span className="block font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Dream Home
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto font-light leading-relaxed transition-colors duration-300">
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
              <div className="w-6 h-10 border-2 border-gray-400 dark:border-gray-500 rounded-full flex justify-center transition-colors duration-300">
                <div className="w-1 h-3 bg-gray-400 dark:bg-gray-500 rounded-full mt-2 animate-pulse transition-colors duration-300"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-light text-gray-900 dark:text-white mb-2 transition-colors duration-300">
                10k+
              </div>
              <div className="text-gray-600 dark:text-gray-400 font-medium transition-colors duration-300">
                Properties Listed
              </div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-light text-gray-900 dark:text-white mb-2 transition-colors duration-300">
                5k+
              </div>
              <div className="text-gray-600 dark:text-gray-400 font-medium transition-colors duration-300">
                Happy Families
              </div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-light text-gray-900 dark:text-white mb-2 transition-colors duration-300">
                200+
              </div>
              <div className="text-gray-600 dark:text-gray-400 font-medium transition-colors duration-300">
                Cities Covered
              </div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-light text-gray-900 dark:text-white mb-2 transition-colors duration-300">
                24/7
              </div>
              <div className="text-gray-600 dark:text-gray-400 font-medium transition-colors duration-300">
                Expert Support
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties - Clean card design */}
      <section className="py-24 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light text-gray-900 dark:text-white mb-6 transition-colors duration-300">
              Featured Properties
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto transition-colors duration-300">
              Handpicked properties that showcase the best of what we offer
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {isLoading ? (
              // Loading skeleton
              Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-700 rounded-2xl overflow-hidden shadow-sm"
                >
                  <div className="h-64 bg-gray-200 dark:bg-gray-600 animate-pulse"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded mb-2 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded mb-4 animate-pulse"></div>
                    <div className="flex items-center justify-between">
                      <div className="h-8 bg-gray-200 dark:bg-gray-600 rounded w-24 animate-pulse"></div>
                      <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded w-20 animate-pulse"></div>
                    </div>
                  </div>
                </div>
              ))
            ) : featuredProperties.length > 0 ? (
              // Real featured properties
              featuredProperties
                .slice(0, 3)
                .map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))
            ) : (
              // No properties fallback
              <div className="col-span-3 text-center py-12">
                <p className="text-gray-600 dark:text-gray-400 transition-colors duration-200">
                  No featured properties available at the moment.
                </p>
              </div>
            )}
          </div>

          <div className="text-center">
            <Link
              href="/properties"
              className="inline-flex items-center px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium rounded-full hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors duration-300"
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
      <section className="py-24 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light text-gray-900 dark:text-white mb-6 transition-colors duration-300">
              Simple. Powerful. Effective.
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto transition-colors duration-300">
              Finding your dream home has never been easier
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <div className="text-center group">
              <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-8 group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-colors duration-300">
                <svg
                  className="w-10 h-10 text-blue-600 dark:text-blue-400"
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
              <h3 className="text-2xl font-light text-gray-900 dark:text-white mb-4 transition-colors duration-300">
                Search
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed transition-colors duration-300">
                Use our intelligent search to discover properties that match
                your exact criteria and preferences.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-8 group-hover:bg-purple-200 dark:group-hover:bg-purple-800 transition-colors duration-300">
                <svg
                  className="w-10 h-10 text-purple-600 dark:text-purple-400"
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
              <h3 className="text-2xl font-light text-gray-900 dark:text-white mb-4 transition-colors duration-300">
                Explore
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed transition-colors duration-300">
                Take virtual tours, view detailed photos, and explore
                neighborhoods to find your perfect match.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-8 group-hover:bg-green-200 dark:group-hover:bg-green-800 transition-colors duration-300">
                <svg
                  className="w-10 h-10 text-green-600 dark:text-green-400"
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
              <h3 className="text-2xl font-light text-gray-900 dark:text-white mb-4 transition-colors duration-300">
                Connect
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed transition-colors duration-300">
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
            Join thousands who&apos;ve found their perfect property through
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
