import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
import Layout from "@/components/Layout";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { fetchPropertyById } from "@/features/properties/propertiesSlice";
import {
  addFavorite,
  removeFavorite,
} from "@/features/favorites/favoritesSlice";

export default function PropertyDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const dispatch = useAppDispatch();

  const { property, isLoading, error } = useAppSelector(
    (state) => state.properties
  );
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { favorites } = useAppSelector((state) => state.favorites);

  const [selectedImage, setSelectedImage] = useState(0);

  // Check if property is in favorites
  const isFavorite = favorites.some((fav) => fav.id === property?.id);

  useEffect(() => {
    if (id && typeof id === "string") {
      const propertyId = Number(id);
      console.log("Property ID from URL:", id, "Parsed as number:", propertyId);
      if (!isNaN(propertyId)) {
        dispatch(fetchPropertyById(propertyId));
      } else {
        console.error("Invalid property ID:", id);
      }
    }
  }, [dispatch, id]);

  // Debug logging
  useEffect(() => {
    console.log("Property state:", { property, isLoading, error });
  }, [property, isLoading, error]);

  const handleFavoriteToggle = () => {
    console.log("handleFavoriteToggle called for property:", property?.id);
    console.log("isAuthenticated:", isAuthenticated);
    console.log("isFavorite:", isFavorite);

    if (!isAuthenticated) {
      console.log("User not authenticated, redirecting to login");
      router.push("/login");
      return;
    }

    if (property) {
      if (isFavorite) {
        console.log("Removing favorite for property:", property.id);
        dispatch(removeFavorite(property.id));
      } else {
        console.log("Adding favorite for property:", property.id);
        dispatch(addFavorite(property.id));
      }
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Date not available";

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Date not available";

    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 flex justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400 transition-colors duration-300">Loading property details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-md transition-colors duration-300">
            <p>Error loading property details: {error}</p>
            <button
              onClick={() => router.back()}
              className="mt-2 text-blue-600 dark:text-blue-400 underline transition-colors duration-300"
            >
              Go back
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  if (!property) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 flex justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400 transition-colors duration-300">Loading...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>{property?.title || "Property"} | DreamDwelling</title>
        <meta
          name="description"
          content={property?.description?.slice(0, 160) || "Property details"}
        />
      </Head>

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <div className="flex text-sm text-gray-500 dark:text-gray-400 mb-4 transition-colors duration-300">
          <span
            onClick={() => router.push("/")}
            className="cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300"
          >
            Home
          </span>
          <span className="mx-2">/</span>
          <span
            onClick={() => router.push("/properties")}
            className="cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300"
          >
            Properties
          </span>
          <span className="mx-2">/</span>
          <span className="text-gray-700 dark:text-gray-300 transition-colors duration-300">{property?.title || "Property"}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Property Images */}
            <div className="mb-6">
              {property?.images && property.images.length > 0 ? (
                <>
                  {/* Main image */}
                  <div className="relative h-96 mb-4 rounded-lg overflow-hidden">
                    <Image
                      src={property.images[selectedImage]?.image || ""}
                      alt={`${property?.title || "Property"} - Image ${
                        selectedImage + 1
                      }`}
                      fill
                      className="object-cover"
                      unoptimized={true}
                      priority={selectedImage === 0}
                    />
                  </div>

                  {/* Thumbnail gallery */}
                  {property.images.length > 1 && (
                    <div className="grid grid-cols-5 gap-2">
                      {property.images.map((image, index) => (
                        <div
                          key={index}
                          onClick={() => setSelectedImage(index)}
                          className={`relative h-20 rounded-md overflow-hidden cursor-pointer ${
                            selectedImage === index
                              ? "ring-2 ring-blue-500"
                              : ""
                          }`}
                        >
                          <Image
                            src={image.image}
                            alt={`${
                              property?.title || "Property"
                            } - Thumbnail ${index + 1}`}
                            fill
                            className="object-cover"
                            unoptimized={true}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="h-96 bg-gray-200 flex items-center justify-center rounded-lg">
                  <span className="text-gray-400">No images available</span>
                </div>
              )}
            </div>

            {/* Property Details */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {property?.title || "Loading..."}
              </h1>
              <p className="text-gray-600 mb-4">
                {property?.address_line1 || "Address loading..."}
              </p>

              <div className="flex items-center mb-6">
                <span className="text-3xl font-bold text-blue-600">
                  {property?.price
                    ? formatPrice(property.price)
                    : "Price not available"}
                </span>
                {property?.listing_type === "rent" && (
                  <span className="text-gray-500 ml-1">/month</span>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">Bedrooms</p>
                  <p className="text-xl font-semibold">
                    {property?.bedrooms || 0}
                  </p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">Bathrooms</p>
                  <p className="text-xl font-semibold">
                    {property?.bathrooms || 0}
                  </p>
                </div>
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors duration-300">
                  <p className="text-gray-500 dark:text-gray-400 transition-colors duration-300">Area</p>
                  <p className="text-xl font-semibold text-gray-900 dark:text-white transition-colors duration-300">
                    {property?.square_feet || 0} sqft
                  </p>
                </div>
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors duration-300">
                  <p className="text-gray-500 dark:text-gray-400 transition-colors duration-300">Year Built</p>
                  <p className="text-xl font-semibold text-gray-900 dark:text-white transition-colors duration-300">
                    {property?.year_built || "N/A"}
                  </p>
                </div>
              </div>

              <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white transition-colors duration-300">Description</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-6 whitespace-pre-line transition-colors duration-300">
                {property?.description || "Description loading..."}
              </p>

              <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white transition-colors duration-300">Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
                {/* For now, let's show some default features until we fix the feature data structure */}
                {[
                  "Air Conditioning",
                  "Heating",
                  "Pet Friendly",
                  "Furnished",
                ].map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-green-500 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-gray-900 dark:text-white transition-colors duration-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Map */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">Location</h2>
              <div className="h-96 bg-gray-200 rounded-lg">
                {/* Map integration would go here */}
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">
                    Map integration will be implemented here
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Contact Agent */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-xl font-semibold mb-4">Contact Agent</h3>

              {property.listed_by && (
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-gray-200 mr-3">
                    {/* Agent image would go here */}
                  </div>
                  <div>
                    <p className="font-semibold">
                      {property.listed_by.first_name}{" "}
                      {property.listed_by.last_name}
                    </p>
                    <p className="text-sm text-gray-500">Real Estate Agent</p>
                  </div>
                </div>
              )}

              <form className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Your email"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Your phone number"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="I'm interested in this property..."
                    defaultValue={`Hi, I'm interested in ${property.title}.`}
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">Actions</h3>

              <div className="space-y-3">
                <button
                  onClick={handleFavoriteToggle}
                  className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  {isFavorite ? (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-red-500 mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>Remove from Favorites</span>
                    </>
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-400 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                      <span>Add to Favorites</span>
                    </>
                  )}
                </button>

                <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span>Schedule a Tour</span>
                </button>

                <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                    />
                  </svg>
                  <span>Share Property</span>
                </button>
              </div>
            </div>

            {/* Property Details Table */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Property Details</h3>

              <table className="w-full text-sm">
                <tbody>
                  <tr className="border-b">
                    <td className="py-2 text-gray-600">Property ID</td>
                    <td className="py-2 text-right">{property.id}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 text-gray-600">Property Type</td>
                    <td className="py-2 text-right">
                      {property.property_type_name || "N/A"}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 text-gray-600">Listing Type</td>
                    <td className="py-2 text-right capitalize">
                      {property.listing_type || "N/A"}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 text-gray-600">Year Built</td>
                    <td className="py-2 text-right">
                      {property.year_built || "N/A"}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 text-gray-600">Square Feet</td>
                    <td className="py-2 text-right">
                      {property.square_feet || "N/A"}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 text-gray-600">Lot Size</td>
                    <td className="py-2 text-right">
                      {property.lot_size || "N/A"}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 text-gray-600">Parking</td>
                    <td className="py-2 text-right">
                      {property?.parking_spaces || 0} spaces
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 text-gray-600">Listed On</td>
                    <td className="py-2 text-right">
                      {property?.created_at
                        ? formatDate(property.created_at)
                        : "Date not available"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
