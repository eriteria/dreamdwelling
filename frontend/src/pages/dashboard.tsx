import { useState, useEffect } from "react";
import Head from "next/head";
import Layout from "@/components/Layout";
import { useAppSelector } from "@/app/store";
import { useRouter } from "next/router";

export default function DashboardPage() {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Layout>
      <Head>
        <title>Dashboard - DreamDwelling</title>
        <meta name="description" content="Your real estate dashboard" />
      </Head>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user?.first_name}!
            </h1>
            <p className="text-gray-600 mt-2">Here's an overview of your real estate activity.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900">Active Listings</h3>
              <p className="text-3xl font-bold text-blue-600 mt-2">0</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900">Saved Properties</h3>
              <p className="text-3xl font-bold text-green-600 mt-2">0</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900">Recent Views</h3>
              <p className="text-3xl font-bold text-purple-600 mt-2">0</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900">Messages</h3>
              <p className="text-3xl font-bold text-orange-600 mt-2">0</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
              <div className="text-center py-8 text-gray-500">
                No recent activity to display.
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors">
                  List a New Property
                </button>
                <button className="w-full text-left p-3 bg-green-50 hover:bg-green-100 rounded-md transition-colors">
                  Search Properties
                </button>
                <button className="w-full text-left p-3 bg-purple-50 hover:bg-purple-100 rounded-md transition-colors">
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
