"use client";

import { UserButton } from "@/features/members/components/member-button";

export const RecipientNavbar = () => {
  return (
    <nav className="bg-red-50 border-b border-red-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left Side - Logo/Title */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-red-700">
              Recipient Dashboard
            </h1>
          </div>

          {/* Right Side - User Button */}
          <div className="flex items-center">
            <UserButton />
          </div>
        </div>
      </div>
    </nav>
  );
};
