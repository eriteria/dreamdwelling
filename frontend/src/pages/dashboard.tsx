import { useState, useEffect } from "react";
import Head from "next/head";
import Layout from "@/components/Layout";
import { useAppSelector } from "@/app/store";
import { useRouter } from "next/router";

export default function DashboardPage() {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router, isHydrated]);

  // Show loading state during SSR and initial hydration to prevent mismatch
  if (!isHydrated || !isAuthenticated) {
    return (
      <Layout>
        <Head>
          <title>Dashboard - DreamDwelling</title>
          <meta name="description" content="Your real estate dashboard" />
        </Head>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow transition-colors duration-300">
              <div className="px-6 py-8">
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-gray-600 dark:text-gray-400">
                    Loading dashboard...
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>Dashboard - DreamDwelling</title>
        <meta name="description" content="Your real estate dashboard" />
      </Head>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
              Welcome back, {user?.first_name}!
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2 transition-colors duration-300">
              Here's an overview of your real estate activity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow transition-colors duration-300">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white transition-colors duration-300">
                Active Listings
              </h3>
              <p className="text-3xl font-bold text-blue-600 mt-2">0</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow transition-colors duration-300">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white transition-colors duration-300">
                Saved Properties
              </h3>
              <p className="text-3xl font-bold text-green-600 mt-2">0</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow transition-colors duration-300">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white transition-colors duration-300">
                Recent Views
              </h3>
              <p className="text-3xl font-bold text-purple-600 mt-2">0</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow transition-colors duration-300">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white transition-colors duration-300">
                Messages
              </h3>
              <p className="text-3xl font-bold text-orange-600 mt-2">0</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow transition-colors duration-300">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 transition-colors duration-300">
                Recent Activity
              </h3>
              <div className="text-center py-8 text-gray-500 dark:text-gray-400 transition-colors duration-300">
                No recent activity to display.
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow transition-colors duration-300">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 transition-colors duration-300">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button className="w-full text-left p-3 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-md transition-colors duration-300 text-gray-900 dark:text-white">
                  List a New Property
                </button>
                <button className="w-full text-left p-3 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/40 rounded-md transition-colors duration-300 text-gray-900 dark:text-white">
                  Search Properties
                </button>
                <button className="w-full text-left p-3 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/40 rounded-md transition-colors duration-300 text-gray-900 dark:text-white">
                  Update Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
