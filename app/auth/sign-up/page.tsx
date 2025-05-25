"use client";

import Link from "next/link";
import { useState } from "react";

export default function Page() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f6fa]">
      <div className="w-full bg-white max-w-md rounded-xl shadow-lg p-8">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-[#1e1e2f]">
            Sign Up to Viprotra
          </h1>
          <p className="mt-2 text-gray-500 text-sm">
            Do you have an account?{" "}
            <Link
              href="/auth/sign-in"
              className="text-blue-600 hover:underline"
            >
              Sign In
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
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e1e2f]"
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
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e1e2f]"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#1e1e2f] py-2 px-4 font-semibold text-white rounded-lg hover:bg-[#23234a] transition"
          >
            Sign up
          </button>
          <div className="flex items-center justify-center">
            <p className="text-red-500 text-sm">Error message</p>
          </div>
        </form>
      </div>
    </div>
  );
}
