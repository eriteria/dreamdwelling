import { useState, useEffect } from "react";
import Head from "next/head";
import Layout from "@/components/Layout";
import { useAppSelector } from "@/app/store";
import { useRouter } from "next/router";

export default function ProfilePage() {
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
          <title>Profile - DreamDwelling</title>
          <meta name="description" content="View and edit your profile" />
        </Head>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors duration-300">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow transition-colors duration-300">
              <div className="px-6 py-8">
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-gray-600 dark:text-gray-400">
                    Loading profile...
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
        <title>Profile - DreamDwelling</title>
        <meta name="description" content="View and edit your profile" />
      </Head>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors duration-300">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow transition-colors duration-300">
            <div className="px-6 py-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 transition-colors duration-300">
                Profile
              </h1>

              <div className="space-y-6">
                <div className="flex items-center space-x-6">
                  <div className="w-24 h-24 bg-blue-600 dark:bg-blue-500 text-white rounded-full flex items-center justify-center text-2xl font-medium ring-4 ring-blue-100 dark:ring-blue-900/50 transition-all duration-300">
                    {user?.first_name?.charAt(0)}
                    {user?.last_name?.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
                      {user?.first_name} {user?.last_name}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">
                      {user?.email}
                    </p>
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-6 transition-colors duration-300">
                  <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors duration-300">
                        First Name
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 transition-colors duration-300">
                        {user?.first_name || "Not specified"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors duration-300">
                        Last Name
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 transition-colors duration-300">
                        {user?.last_name || "Not specified"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors duration-300">
                        Email
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 transition-colors duration-300">
                        {user?.email}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors duration-300">
                        Phone
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 transition-colors duration-300">
                        {user?.phone_number || "Not specified"}
                      </dd>
                    </div>
                    <div className="sm:col-span-2">
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors duration-300">
                        Bio
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 transition-colors duration-300">
                        {user?.bio || "No bio provided"}
                      </dd>
                    </div>
                  </dl>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-6 transition-colors duration-300">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-300">
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
