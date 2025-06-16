"use client";

import { useState } from 'react';
import ImageUpload from "../components/ImageUpload";
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userData, setUserData] = useState({
    name: '',
    description: '',
    story: '',
    imageUrl: ''
  });
  const [isProfileCreated, setIsProfileCreated] = useState(false);

  // Redirect if not authenticated
  if (status === 'unauthenticated') {
    router.push('/auth/sign-in');
    return null;
  }

  // Show loading state while checking auth
  if (status === 'loading') {
    return (
      <main className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </main>
    );
  }

  const handleImageUpload = (url: string) => {
    console.log('Image upload callback received URL:', url);
    setUserData(prev => ({ ...prev, imageUrl: url }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userData.imageUrl) {
      alert('Please upload your photo first');
      return;
    }

    if (!userData.name) {
      alert('Please enter your name');
      return;
    }

    try {
      setIsSubmitting(true);
      // TODO: Save user data to your database
      console.log('Saving user data:', userData);
      setIsProfileCreated(true);
    } catch (error) {
      console.error('Error saving user data:', error);
      alert('Error saving your data. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isProfileCreated) {
    return (
      <main className="min-h-screen bg-gray-100 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex flex-col items-center">
              <div className="relative w-32 h-32 mb-4">
                <Image
                  src={userData.imageUrl}
                  alt={userData.name}
                  fill
                  className="object-cover rounded-full"
                />
              </div>
              <h2 className="text-2xl font-bold mb-2">{userData.name}</h2>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm mb-4">You</span>
              {userData.description && (
                <p className="text-gray-600 text-center mb-4">{userData.description}</p>
              )}
              {userData.story && (
                <div className="mt-4">
                  <h3 className="font-semibold mb-2">Your Story</h3>
                  <p className="text-gray-600">{userData.story}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-center mb-8">Start Your Family Tree</h1>
        <p className="text-center text-gray-600 mb-8">
          Upload your image and fill your details to begin your family tree journey
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Photo
            </label>
            <ImageUpload
              onUploadComplete={handleImageUpload}
              currentImage={userData.imageUrl}
            />
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Your Name
            </label>
            <input
              type="text"
              id="name"
              value={userData.name}
              onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter your full name"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Short Description
            </label>
            <textarea
              id="description"
              value={userData.description}
              onChange={(e) => setUserData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="A brief description about yourself..."
            />
          </div>

          <div>
            <label htmlFor="story" className="block text-sm font-medium text-gray-700">
              Your Story
            </label>
            <textarea
              id="story"
              value={userData.story}
              onChange={(e) => setUserData(prev => ({ ...prev, story: e.target.value }))}
              rows={5}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Share your story with your family..."
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Creating Profile...' : 'Create Profile'}
          </button>
        </form>
      </div>
    </main>
  );
}
