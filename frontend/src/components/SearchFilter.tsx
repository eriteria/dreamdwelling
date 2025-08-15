import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAppDispatch, useAppSelector } from "@/app/store";
import {
  setFilters,
  clearFilters,
  searchLocations,
  clearSearchLocations,
  SearchFilters,
} from "@/features/search/searchSlice";

export default function SearchFilter() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const {
    filters,
    searchLocations: locations,
    isSearching,
  } = useAppSelector((state) => state.search);

  const [localFilters, setLocalFilters] = useState<SearchFilters>(filters);
  const [location, setLocation] = useState("");
  const [showLocations, setShowLocations] = useState(false);

  // Update local state when filters change
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  // Handle location search
  useEffect(() => {
    if (location.length > 2) {
      dispatch(searchLocations(location));
    } else {
      dispatch(clearSearchLocations());
    }
  }, [location, dispatch]);

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(e.target.value);
    setShowLocations(true);
  };

  const handleLocationSelect = (loc: {
    city: string;
    state: string;
    zip_code: string;
  }) => {
    setLocalFilters({
      ...localFilters,
      city: loc.city,
      state: loc.state,
      zip_code: loc.zip_code,
    });
    setLocation(`${loc.city}, ${loc.state} ${loc.zip_code}`);
    setShowLocations(false);
    dispatch(clearSearchLocations());
  };

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;

    setLocalFilters({
      ...localFilters,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : type === "number"
          ? Number(value)
          : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setFilters(localFilters));
    router.push("/properties");
  };

  const handleClear = () => {
    dispatch(clearFilters());
    setLocalFilters({});
    setLocation("");
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg dark:shadow-gray-900/50 rounded-lg p-6 transition-colors duration-200">
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-200"
          >
            Location
          </label>
          <div className="relative">
            <input
              id="location"
              type="text"
              value={location}
              onChange={handleLocationChange}
              onFocus={() => setShowLocations(true)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 transition-colors duration-200"
              placeholder="City, State, or Zip Code"
            />
            {showLocations && locations.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 shadow-lg dark:shadow-gray-900/50 rounded-md overflow-y-auto max-h-60 border dark:border-gray-600">
                {locations.map((loc, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 hover:bg-blue-50 dark:hover:bg-gray-600 cursor-pointer text-gray-900 dark:text-gray-100 transition-colors duration-200"
                    onClick={() => handleLocationSelect(loc)}
                  >
                    {loc.display}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label
              htmlFor="min_price"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-200"
            >
              Min Price
            </label>
            <input
              id="min_price"
              name="min_price"
              type="number"
              value={localFilters.min_price || ""}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 transition-colors duration-200"
              placeholder="Min $"
            />
          </div>
          <div>
            <label
              htmlFor="max_price"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-200"
            >
              Max Price
            </label>
            <input
              id="max_price"
              name="max_price"
              type="number"
              value={localFilters.max_price || ""}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 transition-colors duration-200"
              placeholder="Max $"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label
              htmlFor="min_bedrooms"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-200"
            >
              Bedrooms (min)
            </label>
            <select
              id="min_bedrooms"
              name="min_bedrooms"
              value={localFilters.min_bedrooms || ""}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 transition-colors duration-200"
            >
              <option value="">Any</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
              <option value="5">5+</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="min_bathrooms"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-200"
            >
              Bathrooms (min)
            </label>
            <select
              id="min_bathrooms"
              name="min_bathrooms"
              value={localFilters.min_bathrooms || ""}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 transition-colors duration-200"
            >
              <option value="">Any</option>
              <option value="1">1+</option>
              <option value="1.5">1.5+</option>
              <option value="2">2+</option>
              <option value="2.5">2.5+</option>
              <option value="3">3+</option>
              <option value="3.5">3.5+</option>
              <option value="4">4+</option>
            </select>
          </div>
        </div>

        <div className="mb-6">
          <label
            htmlFor="property_type"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-200"
          >
            Property Type
          </label>
          <select
            id="property_type"
            name="property_type"
            value={localFilters.property_type || ""}
            onChange={handleFilterChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 transition-colors duration-200"
          >
            <option value="">Any</option>
            <option value="11">Single Family Home</option>
            <option value="12">Condominium</option>
            <option value="13">Townhouse</option>
            <option value="14">Multi-Family</option>
            <option value="15">Apartment</option>
            <option value="16">Mobile Home</option>
            <option value="17">Land</option>
            <option value="18">Commercial</option>
            <option value="19">Luxury Home</option>
            <option value="20">Penthouse</option>
          </select>
        </div>

        <div className="mb-6">
          <label
            htmlFor="listing_type"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-200"
          >
            Listing Type
          </label>
          <select
            id="listing_type"
            name="listing_type"
            value={localFilters.listing_type || ""}
            onChange={handleFilterChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 transition-colors duration-200"
          >
            <option value="">Any</option>
            <option value="sale">For Sale</option>
            <option value="rent">For Rent</option>
          </select>
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            className="flex-1 px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors duration-200"
          >
            Search
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="px-6 py-3 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors duration-200"
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  );
}
