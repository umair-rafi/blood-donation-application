import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

/**
 * Create a new member profile
 * This mutation creates a complete member profile for the authenticated user
 */
export const createMemberProfile = mutation({
  args: {
    age: v.number(),
    weight: v.number(),
    bloodType: v.union(
      v.literal("A+"),
      v.literal("A-"),
      v.literal("B+"),
      v.literal("B-"),
      v.literal("AB+"),
      v.literal("AB-"),
      v.literal("O+"),
      v.literal("O-"),
    ),
    gender: v.union(v.literal("male"), v.literal("female"), v.literal("other")),
    role: v.union(v.literal("donor"), v.literal("recipient")),
    location: v.string(),
    locationPermissionGranted: v.boolean(),
    phone: v.string(),
    bio: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Validate user is authenticated
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User must be authenticated to create a profile");
    }

    // Check if profile already exists for this user
    const existingProfile = await ctx.db
      .query("members")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .first();

    if (existingProfile) {
      throw new Error("Profile already exists for this user");
    }

    // Create the member profile
    const memberId = await ctx.db.insert("members", {
      userId,
      age: args.age,
      weight: args.weight,
      bloodType: args.bloodType,
      gender: args.gender,
      role: args.role,
      location: args.location,
      locationPermissionGranted: args.locationPermissionGranted,
      phone: args.phone,
      bio: args.bio || "",
      isEmergencyAlert: false,
      profileCompleted: true,
      createdAt: Date.now(),
    });

    // Return the created member document
    const member = await ctx.db.get(memberId);
    return member;
  },
});

/**
 * Get the current authenticated user's member profile
 */
export const getCurrentMemberProfile = query({
  args: {},
  handler: async (ctx) => {
    // Get authenticated user
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }

    // Query member profile by userId
    const member = await ctx.db
      .query("members")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .first();

    return member;
  },
});

/**
 * Check if the current user has completed their profile
 * Returns boolean indicating profile completion status
 */
export const checkProfileCompletion = query({
  args: {},
  handler: async (ctx) => {
    // Get authenticated user
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return false;
    }

    // Query member profile
    const member = await ctx.db
      .query("members")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .first();

    // Return profile completion status
    return member?.profileCompleted ?? false;
  },
});

/**
 * Get all members with recipient role
 * Returns all recipients with their user information
 */
export const getAllRecipients = query({
  args: {},
  handler: async (ctx) => {
    // Query all members with recipient role
    const recipients = await ctx.db
      .query("members")
      .withIndex("by_user_role", (q) => q.eq("role", "recipient"))
      .collect();

    // Get user information for each recipient
    const recipientsWithUserInfo = await Promise.all(
      recipients.map(async (recipient) => {
        const user = await ctx.db.get(recipient.userId);
        return {
          ...recipient,
          userName: user?.name || user?.email || "Unknown",
          userEmail: user?.email,
          userImage: recipient.profileImageUrl || user?.image,
        };
      }),
    );

    return recipientsWithUserInfo;
  },
});

/**
 * Get all members with donor role
 * Returns all donors with their user information
 */
export const getAllDonors = query({
  args: {},
  handler: async (ctx) => {
    const donors = await ctx.db
      .query("members")
      .withIndex("by_user_role", (q) => q.eq("role", "donor"))
      .collect();

    const donorsWithUserInfo = await Promise.all(
      donors.map(async (donor) => {
        const user = await ctx.db.get(donor.userId);
        return {
          ...donor,
          userName: user?.name || user?.email || "Unknown",
          userEmail: user?.email,
          userImage: donor.profileImageUrl || user?.image,
        };
      }),
    );

    return donorsWithUserInfo;
  },
});

/**
 * Update editable fields of the current user's member profile
 */
export const updateMemberProfile = mutation({
  args: {
    phone: v.string(),
    bloodType: v.union(
      v.literal("A+"),
      v.literal("A-"),
      v.literal("B+"),
      v.literal("B-"),
      v.literal("AB+"),
      v.literal("AB-"),
      v.literal("O+"),
      v.literal("O-"),
    ),
    age: v.number(),
    weight: v.number(),
    gender: v.union(v.literal("male"), v.literal("female"), v.literal("other")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User must be authenticated");
    }

    const member = await ctx.db
      .query("members")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .first();

    if (!member) {
      throw new Error("Member profile not found");
    }

    await ctx.db.patch(member._id, {
      phone: args.phone,
      bloodType: args.bloodType,
      age: args.age,
      weight: args.weight,
      gender: args.gender,
    });

    return { success: true };
  },
});

/**
 * Store the latest blood report screening result on the current donor profile
 */
export const updateBloodReportStatus = mutation({
  args: {
    bloodReportStatus: v.union(
      v.literal("eligible"),
      v.literal("not_eligible"),
      v.literal("needs_review"),
    ),
    bloodReportReviewedAt: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User must be authenticated");
    }

    const member = await ctx.db
      .query("members")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .first();

    if (!member) {
      throw new Error("Member profile not found");
    }

    if (member.role !== "donor") {
      throw new Error("Only donors can update blood report status");
    }

    await ctx.db.patch(member._id, {
      bloodReportStatus: args.bloodReportStatus,
      bloodReportReviewedAt: args.bloodReportReviewedAt,
    });

    return { success: true };
  },
});

/**
 * Update the emergency alert status for the current recipient
 */
export const setEmergencyAlert = mutation({
  args: {
    isEmergencyAlert: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User must be authenticated");
    }

    const member = await ctx.db
      .query("members")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .first();

    if (!member) {
      throw new Error("Member profile not found");
    }    

    if (member.role !== "recipient") {
      throw new Error("Only recipients can update emergency alerts");
    }

    await ctx.db.patch(member._id, {
      isEmergencyAlert: args.isEmergencyAlert,
    });

    return { success: true };
  },
});

/**
 * Update the profile image URL for the current user's member profile
 */
export const updateProfileImage = mutation({
  args: {
    profileImageUrl: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User must be authenticated");
    }

    const member = await ctx.db
      .query("members")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .first();

    if (!member) {
      throw new Error("Member profile not found");
    }

    await ctx.db.patch(member._id, {
      profileImageUrl: args.profileImageUrl,
    });

    return { success: true };
  },
});

/**
 * Clear the geolocation coordinates of the current user's member profile
 */
export const clearMemberLocation = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User must be authenticated");
    }

    const member = await ctx.db
      .query("members")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .first();

    if (!member) {
      throw new Error("Member profile not found");
    }

    await ctx.db.patch(member._id, {
      latitude: undefined,
      longitude: undefined,
      locationPermissionGranted: false,
    });

    return { success: true };
  },
});

/**
 * Update the geolocation coordinates of the current user's member profile
 */
export const updateMemberLocation = mutation({
  args: {
    latitude: v.number(),
    longitude: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User must be authenticated to update location");
    }

    const member = await ctx.db
      .query("members")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .first();

    if (!member) {
      throw new Error("Member profile not found");
    }

    await ctx.db.patch(member._id, {
      latitude: args.latitude,
      longitude: args.longitude,
      locationPermissionGranted: true,
    });

    return { success: true };
  },
});
