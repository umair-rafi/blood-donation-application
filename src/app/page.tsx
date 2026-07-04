"use client";
import { MemberProfileForm } from "@/features/members/components/member-profile-form";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const currentProfile = useQuery(api.members.getCurrentMemberProfile);

  // Redirect if profile is already completed
  useEffect(() => {
    if (currentProfile && currentProfile.profileCompleted) {
      // Redirect based on their role
      if (currentProfile.role === "donor") {
        router.replace("/donor");
      } else {
        router.replace("/recipient");
      }
    }
  }, [currentProfile, router]);

  // Show loading state while checking profile
  if (currentProfile === undefined) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // If profile is completed, show nothing (redirect will happen)
  if (currentProfile && currentProfile.profileCompleted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
            Complete Your Profile
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            This form is mandatory to fill. Please provide your actual
            information to continue.
          </p>
        </div>

        {/* Form Section */}
        <MemberProfileForm />
      </div>
    </div>
  );
}
