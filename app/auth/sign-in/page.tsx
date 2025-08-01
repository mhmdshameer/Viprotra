"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { UploadDropzone } from "@uploadthing/react";
import { OurFileRouter } from "../../api/uploadthing/core";

export default function Page() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    setIsMounted(true);
    if (session) {
      router.push("/");
    }
  }, [session, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError("All fields are required");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Wrong credentials");
      } else {
        router.push("/");
      }
    } catch (error) {
      console.error("Sign-in error:", error);
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (url: string) => {
    // Do something with the uploaded image URL, e.g., save to state
    console.log("Uploaded image URL:", url);
  };

  if (!isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f6fa]">
        <div className="w-full bg-white max-w-md rounded-xl shadow-lg p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-8"></div>
            <div className="space-y-4">
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f6fa]">
      <div className="w-full bg-white max-w-md rounded-xl shadow-lg p-8">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-[#1e1e2f]">
            Sign In to Viprotra
          </h1>
          <p className="mt-2 text-gray-500 text-sm">
            Don&apos;t you have an account?{" "}
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
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e1e2f]"
              disabled={isLoading}
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
            />
          </div>
          <UploadDropzone<OurFileRouter, "imageUploader">
            endpoint="imageUploader"
            onClientUploadComplete={(res) => {
              if (res?.[0]) {
                handleImageUpload(res[0].url);
              }
            }}
            onUploadError={(error) => {
              console.error("Upload error:", error);
            }}
          />
          <button
            type="submit"
            className="w-full bg-[#1e1e2f] py-2 px-4 font-semibold text-white rounded-lg hover:bg-[#23234a] transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign in"}
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
