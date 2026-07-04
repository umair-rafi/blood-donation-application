"use client";

import { useEffect, useRef, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Mail,
  Phone,
  MapPin,
  Droplet,
  Calendar,
  Scale,
  Users,
  Pencil,
  X,
  Check,
  Camera,
  Loader2,
} from "lucide-react";
import type { Id } from "../../../../convex/_generated/dataModel";
import { ImageKitProvider, IKUpload } from "imagekitio-next";

type BloodType = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
type Gender = "male" | "female" | "other";

interface UserProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: {
    name?: string;
    email?: string;
    image?: string;
  };
  member: {
    _id: Id<"members">;
    role: "donor" | "recipient";
    phone: string;
    bloodType: BloodType;
    age: number;
    weight?: number;
    gender: Gender;
    location: string;
    bio: string;
    latitude?: number;
    longitude?: number;
    locationPermissionGranted: boolean;
    profileCompleted: boolean;
    profileImageUrl?: string;
    createdAt?: number;
  };
}

async function imagekitAuthenticator() {
  const res = await fetch("/api/imagekit-auth");
  if (!res.ok) {
    throw new Error("Failed to get ImageKit auth params");
  }
  return res.json();
}

export const UserProfileDialog = ({
  open,
  onOpenChange,
  user,
  member,
}: UserProfileDialogProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadInput, setUploadInput] = useState<HTMLInputElement | null>(null);
  const [editValues, setEditValues] = useState({
    phone: member.phone,
    bloodType: member.bloodType as BloodType,
    age: member.age,
    weight: member.weight ?? 0,
    gender: member.gender as Gender,
  });

  const updateProfile = useMutation(api.members.updateMemberProfile);
  const updateProfileImage = useMutation(api.members.updateProfileImage);

  const ikUploadRef = useRef<HTMLInputElement>(null);
  const handleUploadInputRef = (node: HTMLInputElement | null) => {
    ikUploadRef.current = node;
    setUploadInput(node);
  };

  const displayName = user.name ?? user.email ?? "User";
  const avatarFallback = displayName.charAt(0).toUpperCase();
  const avatarSrc = member.profileImageUrl || user.image;

  const formatDate = (timestamp?: number) => {
    if (!timestamp) return "N/A";
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleSave = async () => {
    try {
      const weightValue = Number(editValues.weight);
      if (!Number.isFinite(weightValue) || weightValue <= 0) {
        toast.error("Please enter a valid weight");
        return;
      }

      await updateProfile({
        phone: editValues.phone,
        bloodType: editValues.bloodType,
        age: Number(editValues.age),
        weight: weightValue,
        gender: editValues.gender,
      });
      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch (error: unknown) {
      toast.error(
        "Failed to update profile: " +
          (error instanceof Error ? error.message : "Unknown error"),
      );
    }
  };

  const handleCancelEdit = () => {
    setEditValues({
      phone: member.phone,
      bloodType: member.bloodType,
      age: member.age,
      weight: member.weight ?? 0,
      gender: member.gender,
    });
    setIsEditing(false);
  };

  const handleImageUploadSuccess = async (res: { url: string }) => {
    try {
      await updateProfileImage({ profileImageUrl: res.url });
      toast.success("Profile picture updated");
    } catch (error: unknown) {
      toast.error(
        "Failed to save image: " +
          (error instanceof Error ? error.message : "Unknown error"),
      );
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleImageUploadError = (err: { message?: string }) => {
    toast.error("Image upload failed: " + (err.message ?? "Unknown error"));
    setIsUploadingImage(false);
  };

  useEffect(() => {
    if (!uploadInput) {
      return;
    }

    const handleChange = () => {
      const hasFile = !!uploadInput.files && uploadInput.files.length > 0;
      setIsUploadingImage(hasFile);
    };

    uploadInput.addEventListener("change", handleChange);
    return () => {
      uploadInput.removeEventListener("change", handleChange);
    };
  }, [uploadInput]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Profile Details</DialogTitle>
            {!isEditing ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="gap-1 mt-4"
              >
                <Pencil className="size-3.5" />
                Edit
              </Button>
            ) : (
              <div className="flex gap-2 mt-4">
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleSave}
                  className="gap-1 bg-green-600 hover:bg-green-700"
                >
                  <Check className="size-3.5" />
                  Save
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancelEdit}
                  className="gap-1"
                >
                  <X className="size-3.5" />
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* User Info Section */}
          <div className="flex items-center gap-4">
            {/* Avatar with upload overlay */}
            <ImageKitProvider
              publicKey={process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY}
              urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}
              authenticator={imagekitAuthenticator}
            >
              <div className="relative group">
                <Avatar className="size-20">
                  <AvatarImage alt={displayName} src={avatarSrc} />
                  <AvatarFallback className="bg-blue-400 text-white font-bold text-2xl">
                    {avatarFallback}
                  </AvatarFallback>
                </Avatar>
                {/* Upload button overlay */}
                <button
                  type="button"
                  className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  onClick={() => {
                    ikUploadRef.current?.click();
                  }}
                  disabled={isUploadingImage}
                >
                  {isUploadingImage ? (
                    <Loader2 className="size-5 text-white animate-spin" />
                  ) : (
                    <Camera className="size-5 text-white" />
                  )}
                </button>
                <IKUpload
                  ref={handleUploadInputRef}
                  fileName={`profile-${member._id}`}
                  folder="/profiles"
                  className="hidden"
                  onSuccess={handleImageUploadSuccess}
                  onError={handleImageUploadError}
                />
              </div>
            </ImageKitProvider>

            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900">
                {displayName}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  variant={member.role === "donor" ? "default" : "destructive"}
                  className="capitalize"
                >
                  {member.role}
                </Badge>
                {/* Verified badge only for recipients when profile is complete */}
                {member.role === "recipient" && member.profileCompleted && (
                  <Badge
                    variant="outline"
                    className="text-green-600 border-green-600"
                  >
                    Verified
                  </Badge>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Hover over the picture to update it
              </p>
            </div>
          </div>

          <Separator />

          {/* Contact Information */}
          <div>
            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Contact Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Mail className="size-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-sm font-medium">
                    {user.email || "Not provided"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg flex-shrink-0">
                  <Phone className="size-5 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500">Phone</p>
                  {isEditing ? (
                    <Input
                      value={editValues.phone}
                      onChange={(e) =>
                        setEditValues((v) => ({ ...v, phone: e.target.value }))
                      }
                      className="h-7 text-sm mt-0.5"
                    />
                  ) : (
                    <p className="text-sm font-medium">{member.phone}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Personal Information */}
          <div>
            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Personal Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Blood Type */}
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg flex-shrink-0">
                  <Droplet className="size-5 text-red-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500">Blood Type</p>
                  {isEditing ? (
                    <Select
                      value={editValues.bloodType}
                      onValueChange={(val) =>
                        setEditValues((v) => ({
                          ...v,
                          bloodType: val as BloodType,
                        }))
                      }
                    >
                      <SelectTrigger className="h-7 text-sm mt-0.5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {(
                          [
                            "A+",
                            "A-",
                            "B+",
                            "B-",
                            "AB+",
                            "AB-",
                            "O+",
                            "O-",
                          ] as BloodType[]
                        ).map((bt) => (
                          <SelectItem key={bt} value={bt}>
                            {bt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="text-sm font-medium">{member.bloodType}</p>
                  )}
                </div>
              </div>

              {/* Age */}
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg flex-shrink-0">
                  <Calendar className="size-5 text-purple-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500">Age</p>
                  {isEditing ? (
                    <Input
                      type="number"
                      min={1}
                      max={120}
                      value={editValues.age}
                      onChange={(e) =>
                        setEditValues((v) => ({
                          ...v,
                          age: Number(e.target.value),
                        }))
                      }
                      className="h-7 text-sm mt-0.5"
                    />
                  ) : (
                    <p className="text-sm font-medium">{member.age} years</p>
                  )}
                </div>
              </div>

              {/* Weight */}
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 rounded-lg flex-shrink-0">
                  <Scale className="size-5 text-indigo-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500">Weight</p>
                  {isEditing ? (
                    <Input
                      type="number"
                      min={1}
                      step="0.1"
                      value={editValues.weight}
                      onChange={(e) =>
                        setEditValues((v) => ({
                          ...v,
                          weight: Number(e.target.value),
                        }))
                      }
                      className="h-7 text-sm mt-0.5"
                    />
                  ) : (
                    <p className="text-sm font-medium">
                      {member.weight ? `${member.weight} kg` : "Not provided"}
                    </p>
                  )}
                </div>
              </div>

              {/* Gender */}
              <div className="flex items-center gap-3">
                <div className="p-2 bg-pink-100 rounded-lg flex-shrink-0">
                  <Users className="size-5 text-pink-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500">Gender</p>
                  {isEditing ? (
                    <Select
                      value={editValues.gender}
                      onValueChange={(val) =>
                        setEditValues((v) => ({
                          ...v,
                          gender: val as Gender,
                        }))
                      }
                    >
                      <SelectTrigger className="h-7 text-sm mt-0.5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="text-sm font-medium capitalize">
                      {member.gender}
                    </p>
                  )}
                </div>
              </div>

              {/* Location (read-only) */}
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg flex-shrink-0">
                  <MapPin className="size-5 text-orange-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-500">Location</p>
                  <p className="text-sm font-medium">{member.location}</p>
                </div>
              </div>
            </div>
          </div>

          {/* GPS Coordinates */}
          {member.latitude && member.longitude && (
            <>
              <Separator />
              <div>
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  GPS Coordinates
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500">Latitude</p>
                    <p className="text-sm font-mono font-medium">
                      {member.latitude.toFixed(6)}
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500">Longitude</p>
                    <p className="text-sm font-mono font-medium">
                      {member.longitude.toFixed(6)}
                    </p>
                  </div>
                </div>
                {member.locationPermissionGranted && (
                  <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                    <MapPin className="size-3" />
                    Location sharing is enabled
                  </p>
                )}
              </div>
            </>
          )}

          {/* Bio */}
          {member.bio && (
            <>
              <Separator />
              <div>
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  Bio
                </h4>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {member.bio}
                </p>
              </div>
            </>
          )}

          {/* Account Information */}
          <Separator />
          <div>
            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Account Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">Member Since</p>
                <p className="text-sm font-medium">
                  {formatDate(member.createdAt)}
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">Profile Status</p>
                <p className="text-sm font-medium">
                  {member.profileCompleted ? "Complete" : "Incomplete"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
