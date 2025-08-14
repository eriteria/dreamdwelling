import { useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Layout from "@/components/Layout";
import PropertyCard from "@/components/PropertyCard";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { fetchFavorites } from "@/features/favorites/favoritesSlice";

export default function FavoritesPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { favorites, loading, error } = useAppSelector(
    (state) => state.favorites
  );
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  // Redirect if not logged in
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  // Fetch favorites when component mounts
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchFavorites());
    }
  }, [dispatch, isAuthenticated]);

  if (!isAuthenticated) {
    return null; // Prevent rendering while redirecting
  }

  return (
    <Layout>
      <Head>
        <title>Saved Properties | DreamDwelling</title>
        <meta
          name="description"
          content="View your saved properties on DreamDwelling."
        />
      </Head>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Saved Properties
        </h1>

        {loading ? (
          <div className="flex justify-center items-center min-h-[300px]">
            <div className="spinner-border text-blue-600" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            <p>Error loading favorites. Please try again later.</p>
          </div>
        ) : favorites.length === 0 ? (
          <div className="bg-white border border-gray-200 p-8 rounded-lg text-center">
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No saved properties yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start saving properties by clicking the heart icon on any property
              you like.
            </p>
            <button
              onClick={() => router.push("/properties")}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Browse Properties
            </button>
          </div>
        ) : (
          <>
            <p className="mb-6 text-gray-600">
              You have {favorites.length} saved{" "}
              {favorites.length === 1 ? "property" : "properties"}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
