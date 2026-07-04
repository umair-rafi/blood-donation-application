"use client";

import React, { useState, useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { RingLoader } from "react-spinners";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Calendar,
  Clock,
  Droplet,
  Mail,
  MapPin,
  Phone,
  Scale,
  Users,
  Search,
  X,
} from "lucide-react";

type Donor = {
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
  weight?: number;
  latitude?: number;
  longitude?: number;
  createdAt?: number;
  bloodReportStatus?: "eligible" | "not_eligible" | "needs_review";
  bloodReportReviewedAt?: number;
};

export const DonorProfileSection = () => {
  const donors = useQuery(api.members.getAllDonors);
  const [open, setOpen] = useState<boolean>(false);
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredDonors = useMemo(() => {
    if (!donors || !searchQuery.trim()) {
      return donors || [];
    }

    const query = searchQuery.toLowerCase().trim();
    return donors.filter((donor) => {
      const name = donor.userName?.toLowerCase() || "";
      const email = donor.userEmail?.toLowerCase() || "";
      const bloodType = donor.bloodType?.toLowerCase() || "";
      const location = donor.location?.toLowerCase() || "";

      return (
        name.includes(query) ||
        email.includes(query) ||
        bloodType.includes(query) ||
        location.includes(query)
      );
    });
  }, [donors, searchQuery]);

  const formatDate = (timestamp?: number) => {
    if (!timestamp) return "N/A";
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getBloodReportBadge = (status?: Donor["bloodReportStatus"]) => {
    if (!status) {
      return {
        label: "Not screened",
        className: "border-slate-200 bg-slate-100 text-slate-700",
      };
    }

    if (status === "eligible") {
      return {
        label: "Eligible",
        className: "border-emerald-200 bg-emerald-50 text-emerald-700",
      };
    }

    if (status === "not_eligible") {
      return {
        label: "Not eligible",
        className: "border-rose-200 bg-rose-50 text-rose-700",
      };
    }

    return {
      label: "Needs review",
      className: "border-amber-200 bg-amber-50 text-amber-700",
    };
  };

  if (donors === undefined) {
    return (
      <div className="flex items-center justify-center p-8">
        <RingLoader size={40} color="#EF4444" />
      </div>
    );
  }

  if (!donors || donors.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-500">No donors available at the moment</p>
      </div>
    );
  }

  const hasSearchResults = filteredDonors.length > 0;

  return (
    <div className="p-2 space-y-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Available Donors</h2>
          <span className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
            {filteredDonors.length} result
            {filteredDonors.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, blood type, location, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-3 p-0.5 text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* Scrollable container for cards */}
      {hasSearchResults ? (
        <ScrollArea className="h-[600px] max-h-[70vh] rounded-lg border border-gray-200 bg-gray-50 p-3">
          <div className="flex flex-col gap-y-3">
            {filteredDonors.map((donor) => (
              <div
                key={donor._id}
                className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-200"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    {donor.userImage ? (
                      <Image
                        src={donor.userImage}
                        alt={donor.userName}
                        width={48}
                        height={48}
                        className="rounded-full object-cover w-12 h-12"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 font-bold text-lg">
                          {donor.userName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {donor.userName}
                    </h3>
                    <p className="text-sm text-gray-500">{donor.userEmail}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                        {donor.bloodType}
                      </span>
                      <Badge
                        variant="outline"
                        className={
                          getBloodReportBadge(donor.bloodReportStatus).className
                        }
                      >
                        {getBloodReportBadge(donor.bloodReportStatus).label}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {donor.age} years
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>{donor.location}</span>
                    <span className="capitalize">{donor.gender}</span>
                  </div>

                  <div className="mt-3 flex items-center justify-end">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedDonor(donor);
                        setOpen(true);
                      }}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      ) : (
        <div className="flex flex-col items-center justify-center p-12 rounded-lg border border-dashed border-gray-300 bg-gray-50">
          <Search className="h-12 w-12 text-gray-300 mb-3" />
          <p className="text-gray-500 text-center">
            {searchQuery ? "No donors match your search" : "No donors found"}
          </p>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear search
            </button>
          )}
        </div>
      )}

      <Dialog
        open={open}
        onOpenChange={(val) => {
          setOpen(val);
          if (!val) setSelectedDonor(null);
        }}
      >
        <DialogContent className="max-w-3xl p-0 overflow-hidden">
          {selectedDonor && (
            <>
              <div className="bg-gradient-to-r from-blue-600 via-sky-600 to-indigo-600 p-6 text-white">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      {selectedDonor.userImage ? (
                        <Image
                          src={selectedDonor.userImage}
                          alt={selectedDonor.userName}
                          width={72}
                          height={72}
                          className="rounded-full object-cover size-16 ring-4 ring-white/30"
                        />
                      ) : (
                        <div className="size-16 rounded-full bg-white/20 flex items-center justify-center ring-4 ring-white/30">
                          <span className="text-white font-bold text-2xl">
                            {selectedDonor.userName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                    <div>
                      <DialogHeader className="text-left">
                        <DialogTitle className="text-2xl font-semibold text-white">
                          {selectedDonor.userName}
                        </DialogTitle>
                        <DialogDescription className="text-blue-100">
                          Detailed donor profile and contact details.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Badge
                          variant="outline"
                          className="border-white/40 text-white"
                        >
                          Blood {selectedDonor.bloodType ?? "N/A"}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={`${getBloodReportBadge(selectedDonor.bloodReportStatus).className} bg-white/10 border-white/30 text-white`}
                        >
                          {
                            getBloodReportBadge(selectedDonor.bloodReportStatus)
                              .label
                          }
                        </Badge>
                        <Badge
                          variant="outline"
                          className="border-white/40 text-white"
                        >
                          Age {selectedDonor.age ?? "N/A"}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="border-white/40 text-white"
                        >
                          Weight {selectedDonor.weight ?? "N/A"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-blue-100">
                    {selectedDonor.latitude && selectedDonor.longitude && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2 py-1">
                        <MapPin className="size-3" /> Live location
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2 py-1">
                      <Clock className="size-3" />
                      Member since {formatDate(selectedDonor.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                      Contact
                    </p>
                    <div className="mt-3 space-y-3">
                      <div>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Mail className="size-4" /> Email
                        </div>
                        <p className="mt-1 text-sm font-medium text-slate-800">
                          {selectedDonor.userEmail ?? "Not provided"}
                        </p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Phone className="size-4" /> Phone
                        </div>
                        <p className="mt-1 text-sm font-medium text-slate-800">
                          {selectedDonor.phone ?? "Not provided"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                      Personal
                    </p>
                    <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Calendar className="size-4" /> Age
                        </div>
                        <p className="mt-1 font-medium text-slate-800">
                          {selectedDonor.age
                            ? `${selectedDonor.age} yrs`
                            : "N/A"}
                        </p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Users className="size-4" /> Gender
                        </div>
                        <p className="mt-1 font-medium text-slate-800 capitalize">
                          {selectedDonor.gender ?? "N/A"}
                        </p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Droplet className="size-4" /> Blood
                        </div>
                        <p className="mt-1 font-medium text-slate-800">
                          {selectedDonor.bloodType ?? "N/A"}
                        </p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Scale className="size-4" /> Weight
                        </div>
                        <p className="mt-1 font-medium text-slate-800">
                          {selectedDonor.weight
                            ? `${selectedDonor.weight} kg`
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                      Location
                    </p>
                    <div className="mt-3 space-y-3">
                      <div>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <MapPin className="size-4" /> Address
                        </div>
                        <p className="mt-1 text-sm font-medium text-slate-800">
                          {selectedDonor.location ?? "Not provided"}
                        </p>
                      </div>
                      {selectedDonor.latitude && selectedDonor.longitude && (
                        <div className="text-xs text-slate-500">
                          Coordinates: {selectedDonor.latitude.toFixed(4)},{" "}
                          {selectedDonor.longitude.toFixed(4)}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                      Account
                    </p>
                    <div className="mt-3 space-y-3">
                      <div>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Clock className="size-4" /> Member since
                        </div>
                        <p className="mt-1 text-sm font-medium text-slate-800">
                          {formatDate(selectedDonor.createdAt)}
                        </p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Droplet className="size-4" /> Report status
                        </div>
                        <Badge
                          variant="outline"
                          className={
                            getBloodReportBadge(selectedDonor.bloodReportStatus)
                              .className + " mt-1"
                          }
                        >
                          {
                            getBloodReportBadge(selectedDonor.bloodReportStatus)
                              .label
                          }
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                    Bio
                  </p>
                  <p className="mt-3 text-sm text-slate-700 leading-relaxed">
                    {selectedDonor.bio?.trim() || "No bio provided."}
                  </p>
                </div>
              </div>
            </>
          )}

          <DialogFooter className="bg-white px-6 pb-6">
            <div className="flex justify-end w-full">
              <Button variant="ghost" onClick={() => setOpen(false)}>
                Close
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
