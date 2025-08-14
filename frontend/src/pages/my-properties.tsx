import { useState, useEffect } from "react";
import Head from "next/head";
import Layout from "@/components/Layout";
import { useAppSelector } from "@/app/store";
import { useRouter } from "next/router";

export default function MyPropertiesPage() {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null; // or a loading spinner
  }

  return (
    <Layout>
      <Head>
        <title>My Properties - DreamDwelling</title>
        <meta name="description" content="Manage your property listings" />
      </Head>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-8">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-gray-900">
                  My Properties
                </h1>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                  Add New Property
                </button>
              </div>

              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg
                    className="mx-auto h-12 w-12"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2m-6 4h4"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No properties yet
                </h3>
                <p className="text-gray-500 mb-6">
                  Start building your property portfolio by adding your first
                  listing.
                </p>
                <button className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors">
                  List Your First Property
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
