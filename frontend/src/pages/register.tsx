import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import Layout from "@/components/Layout";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { register, clearAuth } from "@/features/auth/authSlice";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    re_password: "",
  });
  const [agreeTerms, setAgreeTerms] = useState(false);

  const dispatch = useAppDispatch();
  const router = useRouter();
  const {
    isLoading: loading,
    isAuthenticated,
    error,
  } = useAppSelector((state) => state.auth);

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }

    return () => {
      // Clear any auth errors when component unmounts
      dispatch(clearAuth());
    };
  }, [isAuthenticated, router, dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.re_password) {
      // Handle password mismatch error
      return;
    }

    if (!agreeTerms) {
      // Handle terms not agreed error
      return;
    }

    dispatch(register(formData));
  };

  return (
    <Layout>
      <Head>
        <title>Sign Up | DreamDwelling</title>
        <meta
          name="description"
          content="Create a DreamDwelling account to save properties, schedule viewings, and more."
        />
      </Head>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              Create an Account
            </h1>
            <p className="text-gray-600 mt-2">
              Join DreamDwelling to find your dream home
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
              <p>
                {typeof error === "string"
                  ? error
                  : typeof error === "object" && error.detail
                  ? error.detail
                  : "An error occurred"}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label
                  htmlFor="first_name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  First Name
                </label>
                <input
                  id="first_name"
                  name="first_name"
                  type="text"
                  required
                  value={formData.first_name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="First name"
                />
              </div>
              <div>
                <label
                  htmlFor="last_name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Last Name
                </label>
                <input
                  id="last_name"
                  name="last_name"
                  type="text"
                  required
                  value={formData.last_name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Last name"
                />
              </div>
            </div>

            <div className="mb-6">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Your email address"
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Create a password"
              />
              <p className="mt-1 text-xs text-gray-500">
                Password must be at least 8 characters and contain at least one
                uppercase letter, one lowercase letter, one number, and one
                special character.
              </p>
            </div>

            <div className="mb-6">
              <label
                htmlFor="re_password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Confirm Password
              </label>
              <input
                id="re_password"
                name="re_password"
                type="password"
                required
                value={formData.re_password}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                  formData.password &&
                  formData.re_password &&
                  formData.password !== formData.re_password
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                placeholder="Confirm your password"
              />
              {formData.password &&
                formData.re_password &&
                formData.password !== formData.re_password && (
                  <p className="mt-1 text-xs text-red-600">
                    Passwords do not match
                  </p>
                )}
            </div>

            <div className="flex items-center mb-6">
              <input
                id="agree-terms"
                name="agree-terms"
                type="checkbox"
                checked={agreeTerms}
                onChange={() => setAgreeTerms(!agreeTerms)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                required
              />
              <label
                htmlFor="agree-terms"
                className="ml-2 block text-sm text-gray-700"
              >
                I agree to the{" "}
                <Link
                  href="/terms"
                  className="text-blue-600 hover:text-blue-800"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="text-blue-600 hover:text-blue-800"
                >
                  Privacy Policy
                </Link>
              </label>
            </div>

            <button
              type="submit"
              disabled={
                loading ||
                !agreeTerms ||
                formData.password !== formData.re_password
              }
              className={`w-full py-3 px-4 rounded-md text-white font-medium ${
                loading ||
                !agreeTerms ||
                formData.password !== formData.re_password
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              }`}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
