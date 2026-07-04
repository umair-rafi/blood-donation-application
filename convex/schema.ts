import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const schema = defineSchema({
  ...authTables,
  members: defineTable({
    userId: v.id("users"),
    phone: v.string(),
    role: v.union(v.literal("donor"), v.literal("recipient")),
    bio: v.string(),
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
    weight: v.optional(v.number()),
    gender: v.union(v.literal("male"), v.literal("female"), v.literal("other")),
    location: v.string(),
    locationPermissionGranted: v.boolean(),
    isEmergencyAlert: v.optional(v.boolean()),
    bloodReportStatus: v.optional(
      v.union(
        v.literal("eligible"),
        v.literal("not_eligible"),
        v.literal("needs_review"),
      ),
    ),
    bloodReportReviewedAt: v.optional(v.number()),
    latitude: v.optional(v.number()),
    longitude: v.optional(v.number()),
    profileCompleted: v.boolean(),
    profileImageUrl: v.optional(v.string()),
    createdAt: v.optional(v.number()),
  })
    .index("by_user_role", ["role"])
    .index("by_user_id", ["userId"])
    .index("by_profile_completed", ["profileCompleted"]),
});

export default schema;
