"use client";

import { UserButton } from "@/features/members/components/member-button";
export const DonorNavbar = () => {
  return (
    <nav className="bg-[#C0392B] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left Side - Brand */}
          <div className="flex items-center">
            <span className="text-lg font-semibold text-white">
              BloodConnect
            </span>
          </div>

          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-white">Donor Dashboard</h1>
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
