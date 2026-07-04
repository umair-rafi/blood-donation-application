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
  AlertTriangle,
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

interface RecipientProfileSectionProps {
  onLocationClick?: (recipient: Recipient) => void;
}

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
  weight?: number;
  createdAt?: number;
};

export const RecipientProfileSection = ({
  onLocationClick,
}: RecipientProfileSectionProps) => {
  const recipients = useQuery(api.members.getAllRecipients);
  const [open, setOpen] = useState<boolean>(false);
  const [selectedRecipient, setSelectedRecipient] = useState<Recipient | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredRecipients = useMemo(() => {
    if (!recipients || !searchQuery.trim()) {
      return recipients || [];
    }

    const query = searchQuery.toLowerCase().trim();
    return recipients.filter((recipient) => {
      const name = recipient.userName?.toLowerCase() || "";
      const email = recipient.userEmail?.toLowerCase() || "";
      const bloodType = recipient.bloodType?.toLowerCase() || "";
      const location = recipient.location?.toLowerCase() || "";

      return (
        name.includes(query) ||
        email.includes(query) ||
        bloodType.includes(query) ||
        location.includes(query)
      );
    });
  }, [recipients, searchQuery]);

  const formatDate = (timestamp?: number) => {
    if (!timestamp) return "N/A";
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Loading state
  if (recipients === undefined) {
    return (
      <div className="flex items-center justify-center p-8">
        <RingLoader size={40} color="#EF4444" />
      </div>
    );
  }

  // No recipients found
  if (!recipients || recipients.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-500">No recipients found</p>
      </div>
    );
  }

  const hasSearchResults = filteredRecipients.length > 0;

  return (
    <div className="p-2 space-y-4 ">
      {/* Glow animation keyframes, scoped to this component */}
      <style jsx global>{`
        @keyframes emergency-glow {
          0%,
          100% {
            box-shadow:
              0 0 0 1px rgba(239, 68, 68, 0.4),
              0 0 12px 2px rgba(239, 68, 68, 0.35),
              0 0 0 rgba(239, 68, 68, 0);
          }
          50% {
            box-shadow:
              0 0 0 1px rgba(239, 68, 68, 0.6),
              0 0 28px 8px rgba(239, 68, 68, 0.55),
              0 0 40px 12px rgba(239, 68, 68, 0.15);
          }
        }
        .emergency-card-glow {
          animation: emergency-glow 1.8s ease-in-out infinite;
        }
      `}</style>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            Recipients Looking for Blood
          </h2>
          <span className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
            {filteredRecipients.length} result
            {filteredRecipients.length !== 1 ? "s" : ""}
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
            className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
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
            {filteredRecipients.map((recipient) => (
              <div
                key={recipient._id}
                className={`bg-white border rounded-lg p-4 shadow-sm transition-all duration-200 relative ${
                  recipient.isEmergencyAlert
                    ? "border-red-400 bg-red-50/40 emergency-card-glow"
                    : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                }`}
              >
                {/* Emergency ribbon */}

                <div className="flex items-center space-x-3">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    {recipient.userImage ? (
                      <Image
                        src={recipient.userImage}
                        alt={recipient.userName}
                        width={48}
                        height={48}
                        className={`rounded-full ${
                          recipient.isEmergencyAlert
                            ? "ring-2 ring-red-400 ring-offset-2"
                            : ""
                        }`}
                      />
                    ) : (
                      <div
                        className={`w-12 h-12 rounded-full bg-red-100 flex items-center justify-center ${
                          recipient.isEmergencyAlert
                            ? "ring-2 ring-red-400 ring-offset-2"
                            : ""
                        }`}
                      >
                        <span className="text-red-600 font-bold text-lg">
                          {recipient.userName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {recipient.userName}
                      </h3>
                      {recipient.latitude && recipient.longitude && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700">
                          <MapPin className="size-3 mr-0.5" />
                          Live
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">
                      {recipient.userEmail}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                        {recipient.bloodType}
                      </span>
                      <span className="text-xs text-gray-500">
                        {recipient.age} years
                      </span>
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>{recipient.location}</span>
                    <span className="capitalize">{recipient.gender}</span>
                  </div>

                  {/* Action buttons */}
                  <div className="mt-3 flex items-center justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedRecipient(recipient);
                        setOpen(true);
                      }}
                    >
                      View Details
                    </Button>

                    <Button
                      variant="default"
                      className="bg-red-500 hover:bg-red-600"
                      onClick={() => {
                        if (onLocationClick) {
                          onLocationClick(recipient);
                        }
                      }}
                      disabled={!recipient.latitude || !recipient.longitude}
                    >
                      <MapPin className="size-4 mr-1" />
                      View Location
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
            {searchQuery
              ? "No recipients match your search"
              : "No recipients found"}
          </p>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="mt-3 text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Clear search
            </button>
          )}
        </div>
      )}

      {/* Details Dialog */}
      <Dialog
        open={open}
        onOpenChange={(val) => {
          setOpen(val);
          if (!val) setSelectedRecipient(null);
        }}
      >
        <DialogContent className="max-w-3xl p-0 overflow-hidden">
          {selectedRecipient && (
            <>
              <div className="bg-gradient-to-r from-red-600 via-rose-600 to-orange-500 p-6 text-white">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      {selectedRecipient.userImage ? (
                        <Image
                          src={selectedRecipient.userImage}
                          alt={selectedRecipient.userName}
                          width={72}
                          height={72}
                          className="rounded-full object-cover size-16 ring-4 ring-white/30"
                        />
                      ) : (
                        <div className="size-16 rounded-full bg-white/20 flex items-center justify-center ring-4 ring-white/30">
                          <span className="text-white font-bold text-2xl">
                            {selectedRecipient.userName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                    <div>
                      <DialogHeader className="text-left">
                        <DialogTitle className="text-2xl font-semibold text-white">
                          {selectedRecipient.userName}
                        </DialogTitle>
                        <DialogDescription className="text-red-100">
                          Recipient profile and request details.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Badge
                          variant="outline"
                          className="border-white/40 text-white"
                        >
                          Blood {selectedRecipient.bloodType ?? "N/A"}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="border-white/40 text-white"
                        >
                          Age {selectedRecipient.age ?? "N/A"}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="border-white/40 text-white"
                        >
                          Weight {selectedRecipient.weight ?? "N/A"}
                        </Badge>
                        {selectedRecipient.isEmergencyAlert && (
                          <Badge className="bg-white/20 text-white border-white/30">
                            <AlertTriangle className="size-3" /> Emergency
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-red-100">
                    {selectedRecipient.latitude &&
                      selectedRecipient.longitude && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2 py-1">
                          <MapPin className="size-3" /> Live location
                        </span>
                      )}
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2 py-1">
                      <Clock className="size-3" />
                      Member since {formatDate(selectedRecipient.createdAt)}
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
                          {selectedRecipient.userEmail ?? "Not provided"}
                        </p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Phone className="size-4" /> Phone
                        </div>
                        <p className="mt-1 text-sm font-medium text-slate-800">
                          {selectedRecipient.phone ?? "Not provided"}
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
                          {selectedRecipient.age
                            ? `${selectedRecipient.age} yrs`
                            : "N/A"}
                        </p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Users className="size-4" /> Gender
                        </div>
                        <p className="mt-1 font-medium text-slate-800 capitalize">
                          {selectedRecipient.gender ?? "N/A"}
                        </p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Droplet className="size-4" /> Blood
                        </div>
                        <p className="mt-1 font-medium text-slate-800">
                          {selectedRecipient.bloodType ?? "N/A"}
                        </p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Scale className="size-4" /> Weight
                        </div>
                        <p className="mt-1 font-medium text-slate-800">
                          {selectedRecipient.weight
                            ? `${selectedRecipient.weight} kg`
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
                          {selectedRecipient.location ?? "Not provided"}
                        </p>
                      </div>
                      {selectedRecipient.latitude &&
                        selectedRecipient.longitude && (
                          <div className="text-xs text-slate-500">
                            Coordinates: {selectedRecipient.latitude.toFixed(4)}
                            , {selectedRecipient.longitude.toFixed(4)}
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
                          {formatDate(selectedRecipient.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                    Bio
                  </p>
                  <p className="mt-3 text-sm text-slate-700 leading-relaxed">
                    {selectedRecipient.bio?.trim() || "No bio provided."}
                  </p>
                </div>
              </div>
            </>
          )}

          <DialogFooter className="bg-white px-6 pb-6">
            <div className="flex justify-end w-full">
              <Button
                variant="ghost"
                onClick={() => {
                  setOpen(false);
                }}
              >
                Close
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
