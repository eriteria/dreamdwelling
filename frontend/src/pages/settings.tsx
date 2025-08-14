import { useState, useEffect } from "react";
import Head from "next/head";
import Layout from "@/components/Layout";
import { useAppSelector } from "@/app/store";
import { useRouter } from "next/router";

export default function SettingsPage() {
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
        <title>Settings - DreamDwelling</title>
        <meta name="description" content="Account settings and preferences" />
      </Head>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>
              
              <div className="space-y-8">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Settings</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Email Notifications</h3>
                        <p className="text-sm text-gray-500">Receive email updates about your properties</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={user?.email_notifications || false}
                          readOnly
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Security</h2>
                  <div className="space-y-4">
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      Change Password
                    </button>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Preferences</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Preferred Contact Method
                      </label>
                      <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                        <option>Email</option>
                        <option>Phone</option>
                        <option>Both</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors mr-4">
                    Save Changes
                  </button>
                  <button className="text-gray-600 hover:text-gray-700">
                    Cancel
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
