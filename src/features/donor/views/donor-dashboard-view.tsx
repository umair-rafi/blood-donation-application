"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { RecipientMapLocation } from "../components/recipient-map-location";
import { RecipientProfileSection } from "../components/recipient-profile-section";
import { AlertTriangle, UserPlus, Users } from "lucide-react";
import { BloodReportAnalysisDialog } from "../components/blood-report-analysis-dialog";

type Recipient = {
  _id: string;
  userName: string;
  userEmail?: string;
  userImage?: string;
  bloodType?: string;
  age?: number;
  location?: string;
  gender?: string;
  phone?: string;
  bio?: string;
  latitude?: number;
  longitude?: number;
  isEmergencyAlert?: boolean;
  createdAt?: number;
};

export const DonorDashboardView = () => {
  const recipients = useQuery(api.members.getAllRecipients);
  const [selectedRecipient, setSelectedRecipient] = useState<Recipient | null>(
    null,
  );

  const recipientsLoaded = recipients !== undefined;
  const totalRecipients = recipients?.length ?? 0;
  const urgentRecipients =
    recipients?.filter((recipient) => recipient.isEmergencyAlert).length ?? 0;
  const now = Date.now();
  const newRecipientWindowMs = 1000 * 60 * 60 * 24 * 7;
  const newRecipients =
    recipients?.filter(
      (recipient) =>
        recipient.createdAt &&
        now - recipient.createdAt <= newRecipientWindowMs,
    ).length ?? 0;

  const formatCount = (value: number) =>
    recipientsLoaded ? value.toLocaleString("en-US") : "--";

  const handleLocationClick = (recipient: Recipient) => {
    setSelectedRecipient(recipient);
  };

  return (
    <div className="flex flex-col gap-6 min-h-screen w-full p-4">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="relative overflow-hidden rounded-2xl border border-red-100 bg-gradient-to-br from-white via-white to-red-50 p-4 shadow-sm">
          <div className="absolute right-0 top-0 h-16 w-16 rounded-bl-3xl bg-red-100/70" />
          <div className="relative">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-widest text-red-700">
                Recipients
              </p>
              <Users className="size-5 text-red-600" />
            </div>
            <div className="mt-3 text-3xl font-bold text-gray-900">
              {formatCount(totalRecipients)}
            </div>
            <p className="text-xs text-gray-500">Total recipients</p>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-red-200 bg-gradient-to-br from-white via-white to-red-100 p-4 shadow-sm">
          <div className="absolute right-0 top-0 h-16 w-16 rounded-bl-3xl bg-red-200/70" />
          <div className="relative">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-widest text-red-800">
                Urgent
              </p>
              <AlertTriangle className="size-5 text-red-700" />
            </div>
            <div className="mt-3 text-3xl font-bold text-gray-900">
              {formatCount(urgentRecipients)}
            </div>
            <p className="text-xs text-gray-500">Emergency alerts active</p>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-amber-200 bg-gradient-to-br from-white via-white to-amber-50 p-4 shadow-sm">
          <div className="absolute right-0 top-0 h-16 w-16 rounded-bl-3xl bg-amber-200/70" />
          <div className="relative">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-widest text-amber-800">
                New Recipients
              </p>
              <UserPlus className="size-5 text-amber-700" />
            </div>
            <div className="mt-3 text-3xl font-bold text-gray-900">
              {formatCount(newRecipients)}
            </div>
            <p className="text-xs text-gray-500">Last 7 days</p>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-red-100 bg-gradient-to-r from-red-700 via-rose-700 to-red-800 p-6 text-white shadow-lg">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-red-100">
              AI blood report screening
            </p>
            <h2 className="text-2xl font-bold md:text-3xl">
              Upload your blood report and get an instant eligibility check.
            </h2>
            <p className="text-sm leading-6 text-red-100/90 md:text-base">
              The assistant reviews your report for common donation blockers,
              then tells you whether you look eligible to donate now or need
              medical follow-up first.
            </p>
          </div>
          <BloodReportAnalysisDialog />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 w-full">
        <div className="w-full lg:w-1/3">
          <RecipientProfileSection onLocationClick={handleLocationClick} />
        </div>
        <div className="w-full lg:w-2/3">
          <RecipientMapLocation selectedRecipient={selectedRecipient} />
        </div>
      </div>
    </div>
  );
};
