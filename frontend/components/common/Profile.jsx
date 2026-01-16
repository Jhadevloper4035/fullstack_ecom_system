"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";

// Helper component for status badges
const StatusBadge = ({ isVerified, text }) => {
  const bgColor = isVerified ? "bg-green-100" : "bg-red-100";
  const textColor = isVerified ? "text-green-800" : "text-red-800";
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
      {text}
    </span>
  );
};

export default function Profile() {
  const router = useRouter();
  const { user, fetchProfile, logout } = useAuth();
  const [loading, setLoading] = useState(!user);
  const [error, setError] = useState(null);
  // State to manage visibility of a potential change password modal/form
  const [showChangePasswordForm, setShowChangePasswordForm] = useState(false);

  useEffect(() => {
    // Only attempt to fetch profile if user object is not yet loaded
    if (!user) {
      (async () => {
        setLoading(true);
        try {
          // Assuming fetchProfile handles the API call and returns the user or null/false
          const fetchedUser = await fetchProfile();
          if (!fetchedUser) {
            // If fetchProfile indicates failure, redirect to login
            router.push("/login");
          }
        } catch (err) {
          console.error("Profile load error:", err);
          setError("Unable to load profile. Please try logging in again.");
        } finally {
          setLoading(false);
        }
      })();
    }
    // Dependency array ensures this runs when user, fetchProfile, or router change
  }, [user, fetchProfile, router]);

  // --- Function to handle the password change button click ---
  const handleChangePasswordClick = () => {
    // We are still redirecting to the change-password page as per the previous working version.
    router.push("/change-password");
    console.log("Redirecting to /change-password page.");
  };
  // -----------------------------------------------------------------

  if (loading) return (
    <div className="container py-12 max-w-4xl mx-auto px-4">
      <div className="animate-pulse space-y-6 p-6 bg-white rounded-xl shadow-lg">
        <div className="h-24 bg-gray-200 rounded-lg w-full"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-40 bg-gray-100 rounded-lg"></div>
          <div className="h-40 bg-gray-100 rounded-lg"></div>
        </div>
        <div className="h-10 bg-gray-200 rounded w-1/3 ml-auto"></div>
      </div>
    </div>
  );

  if (error) return (
    <div className="container py-12 max-w-4xl mx-auto px-4">
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow-sm">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-red-700">{error}</p>
          </div>
        </div>
      </div>
    </div>
  );

  if (!user) return null;

  // Function to format date
  const formatJoinDate = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Helper component for detail items with better spacing/separation
  const DetailItem = ({ label, value, isLast = false, children }) => (
    <div className={`py-3 ${isLast ? '' : 'border-b border-gray-200'}`}>
      <p className="text-sm text-gray-500">{label}</p>
      {value && <p className="font-semibold text-gray-900">{value}</p>}
      {children}
    </div>
  );

  return (
    <section className="py-12 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-800 px-6 py-8 text-white">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex items-center space-x-4">
                  {/* Avatar/Initial */}
                  <div className="h-20 w-20 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-2xl font-bold border-2 border-white">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  {/* Name and Email */}
                  <div>
                    <h1 className="text-2xl font-bold">{user.name || 'User'}</h1>
                    <p className="text-blue-100">{user.email}</p>
                    <div className="mt-1 flex items-center space-x-2">
                        {/* Display User Role */}
                        <span className="text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white bg-opacity-10 text-white">
                          {user.role || 'user'}
                        </span>
                        {/* Display Verification Status in Header */}
                        <StatusBadge isVerified={user.isVerified} text={user.isVerified ? 'Email Verified' : 'Email Unverified'} />
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => router.push("/profile/edit")}
                  className="mt-4 md:mt-0 px-4 py-2 bg-white text-blue-700 rounded-lg font-medium hover:bg-blue-50 transition-all shadow-md"
                >
                  Edit Profile
                </button>
              </div>
            </div>

            {/* Profile Details */}
            <div className="p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8"> {/* Increased gap here */}
                
                {/* Personal Information Card */}
                <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                  <h3 className="text-lg font-extrabold text-gray-800 mb-4 border-b pb-2">Personal Details</h3>
                  <div className="divide-y divide-gray-200"> {/* Use divide utility for clean separation */}
                    <DetailItem label="Full Name" value={user.name} />
                    <DetailItem label="Email Address" value={user.email} />
                    <DetailItem label="Phone Number" value={user.number} isLast={true} />
                  </div>
                </div>

                {/* Account Status Card (Uncommented and improved) */}
                <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                  <h3 className="text-lg font-extrabold text-gray-800 mb-4 border-b pb-2">Account Status</h3>
                  <div className="divide-y divide-gray-200"> {/* Use divide utility for clean separation */}
                    <DetailItem label="Account Role" value={user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'User'} />
                    
                    <DetailItem label="Email Verification">
                      <StatusBadge isVerified={user.isVerified} text={user.isVerified ? 'Verified' : 'Unverified'} />
                    </DetailItem>
                    
                    <DetailItem label="Member Since" value={formatJoinDate(user.createdAt)} isLast={true} />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
                <button
                  onClick={() => router.push("/change-password")}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors shadow-sm"
                >
                  Change Password
                </button>
                <button
                  onClick={async () => {
                    await logout();
                    router.push("/login");
                  }}
                  className="px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors shadow-md"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
