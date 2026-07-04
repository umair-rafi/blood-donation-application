"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useCurrentMember } from "../api/use-current-member";
import { RingLoader } from "react-spinners";
import { LogOut, UserCircle, LayoutDashboard } from "lucide-react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useCurrentUser } from "../api/use-current-user";
import { useRouter } from "next/navigation";
import { UserProfileDialog } from "./user-profile-dialog";

export const UserButton = () => {
  const { signOut } = useAuthActions();
  const router = useRouter();
  const { data: member, isLoading: memberLoading } = useCurrentMember();
  const { data: user, isLoading: userLoading } = useCurrentUser();
  const [profileOpen, setProfileOpen] = useState(false);

  // Loading state (must return)
  if (memberLoading || userLoading) {
    return (
      <div className="flex items-center justify-center p-2">
        <RingLoader size={20} color="#9CA3AF" />
      </div>
    );
  }

  // Guard against null/undefined data
  if (!member || !user) {
    return null;
  }

  const displayName = user.name ?? user.email ?? "User";
  const imageUrl = user.image;
  const avatarFallback = displayName.charAt(0).toUpperCase();
  const { role } = member;

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger className="outline-none relative">
          <Avatar className="size-10 hover:opacity-75 transition">
            <AvatarImage alt={displayName} src={imageUrl} />
            <AvatarFallback className="bg-blue-400 text-white font-bold">
              {avatarFallback}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" side="bottom" className="w-60">
          <DropdownMenuItem
            onClick={() => setProfileOpen(true)}
            className="cursor-pointer"
          >
            <UserCircle className="size-4 mr-2" />
            View Profile
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() =>
              router.push(
                role === "donor" ? "/donor/dashboard" : "/recipient/dashboard",
              )
            }
            className="cursor-pointer"
          >
            <LayoutDashboard className="size-4 mr-2" />
            {role === "donor" ? "Find Recipients" : "Find Donors"}
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem disabled>
            <span className="text-xs text-gray-500">
              Role: <span className="capitalize font-medium">{role}</span>
            </span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => signOut()}
            className="cursor-pointer text-red-600"
          >
            <LogOut className="size-4 mr-2" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <UserProfileDialog
        open={profileOpen}
        onOpenChange={setProfileOpen}
        user={user}
        member={member}
      />
    </>
  );
};
