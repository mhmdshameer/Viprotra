"use client";

import Link from "next/link";
import { useState } from "react";

export default function Page() {
  const [FormData, setFormData] = useState({
    username: "",
    password: "",
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f6fa]">
      <div className="w-full bg-white max-w-md rounded-xl shadow-lg p-8">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-[#1e1e2f]">
            Sign In to Viprotra
          </h1>
          <p className="mt-2 text-gray-500 text-sm">
            Don't you have an account?{" "}
            <Link
              href="/auth/sign-up"
              className="text-blue-600 hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
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
              value={FormData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e1e2f]"
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
              value={FormData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e1e2f]"
              suppressHydrationWarning
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#1e1e2f] py-2 px-4 font-semibold text-white rounded-lg hover:bg-[#23234a] transition"
            suppressHydrationWarning
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
