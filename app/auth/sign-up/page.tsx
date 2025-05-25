"use client";

import Link from "next/link";
import { useState } from "react";

export default function Page() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError("All fields are required");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/sign-up", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setUsername("");
        setPassword("");
        setError("");
        // Redirect to sign in
        window.location.href = "/auth/sign-in";
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error("Sign-up error:", error);
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f6fa]">
      <div className="w-full bg-white max-w-md rounded-xl shadow-lg p-8">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-[#1e1e2f]">
            Sign Up to Viprotra
          </h1>
          <p className="mt-2 text-gray-500 text-sm">
            Already have an account?{" "}
            <Link
              href="/auth/sign-in"
              className="text-blue-600 hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5" suppressHydrationWarning>
          <div>
            <label
              htmlFor="username"
              className="block text-sm text-gray-700 font-medium mb-1"
            >
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e1e2f]"
              disabled={isLoading}
              suppressHydrationWarning
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm text-gray-700 font-medium mb-1"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e1e2f]"
              disabled={isLoading}
              suppressHydrationWarning
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#1e1e2f] py-2 px-4 font-semibold text-white rounded-lg hover:bg-[#23234a] transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
            suppressHydrationWarning
          >
            {isLoading ? "Signing up..." : "Sign up"}
          </button>
          {error && (
            <div className="flex items-center justify-center">
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
