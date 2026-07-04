"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { RecipientView } from "@/features/recipient/views/recipient-view";

export default function RecipientPage() {
  const router = useRouter();
  const currentProfile = useQuery(api.members.getCurrentMemberProfile);

  // Redirect if not a recipient or profile not completed
  useEffect(() => {
    if (currentProfile === null) {
      // No profile, redirect to home
      router.replace("/");
    } else if (currentProfile && currentProfile.role !== "recipient") {
      // Wrong role, redirect to their correct dashboard
      router.replace("/donor");
    }
  }, [currentProfile, router]);

  // Show loading state
  if (currentProfile === undefined) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // If no profile or wrong role, show nothing (redirect will happen)
  if (!currentProfile || currentProfile.role !== "recipient") {
    return null;
  }

  return (
    <div className="container mx-auto p-6">
      <RecipientView />
    </div>
  );
}
