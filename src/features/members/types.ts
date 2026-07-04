import { z } from "zod";

/**
 * Blood type options for blood donation
 */
export const bloodTypes = [
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
] as const;

/**
 * Gender options
 */
export const genders = ["male", "female", "other"] as const;

/**
 * Role options - donor or recipient
 */
export const roles = ["donor", "recipient"] as const;

/**
 * Zod schema for member profile form validation
 * Input schema - what the form uses
 */
export const memberProfileFormSchema = z
  .object({
    age: z
      .string({ message: "Age is required" })
      .min(1, { message: "Age is required" })
      .refine(
        (value) => {
          const age = Number.parseInt(value, 10);
          return Number.isInteger(age) && age >= 0;
        },
        { message: "Please enter a valid age" },
      ),

    weight: z
      .string({ message: "Weight is required" })
      .min(1, { message: "Weight is required" })
      .refine(
        (value) => {
          const weight = Number.parseFloat(value);
          return Number.isFinite(weight) && weight > 0;
        },
        { message: "Please enter a valid weight" },
      ),

    bloodType: z
      .string({ message: "Blood type is required" })
      .min(1, { message: "Please select your blood type" }),

    gender: z
      .string({ message: "Gender is required" })
      .min(1, { message: "Please select your gender" }),

    role: z.string({ message: "Role is required" }).min(1, {
      message: "Please select whether you are a donor or recipient",
    }),

    location: z
      .string({
        message: "Location is required",
      })
      .min(1, { message: "Location cannot be empty" }),

    locationPermissionGranted: z
      .boolean({
        message: "Location permission is required",
      })
      .refine((val) => val === true, {
        message: "You must grant location permission to continue",
      }),

    phone: z
      .string({
        message: "Phone number is required",
      })
      .min(10, { message: "Phone number must be at least 10 digits" })
      .max(15, { message: "Phone number must be at most 15 digits" }),
  })
  .superRefine((data, ctx) => {
    const age = Number.parseInt(data.age, 10);

    if (data.role === "donor" && age < 18) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Donors must be at least 18 years old",
        path: ["age"],
      });
    }
  });

/**
 * Output schema - what we send to the server after validation
 */
export const memberProfileSchema = memberProfileFormSchema
  .transform((data) => ({
    age: parseInt(data.age, 10),
    weight: Number.parseFloat(data.weight),
    bloodType: data.bloodType as (typeof bloodTypes)[number],
    gender: data.gender as (typeof genders)[number],
    role: data.role as (typeof roles)[number],
    location: data.location,
    locationPermissionGranted: data.locationPermissionGranted,
    phone: data.phone,
  }))
  .refine((data) => !isNaN(data.age) && data.age >= 0, {
    message: "Please enter a valid age",
    path: ["age"],
  })
  .refine((data) => Number.isFinite(data.weight) && data.weight > 0, {
    message: "Please enter a valid weight",
    path: ["weight"],
  })
  .refine((data) => data.role !== "donor" || data.age >= 18, {
    message: "Donors must be at least 18 years old",
    path: ["age"],
  })
  .refine((data) => bloodTypes.includes(data.bloodType), {
    message: "Please select a valid blood type",
    path: ["bloodType"],
  })
  .refine((data) => genders.includes(data.gender), {
    message: "Please select a valid gender",
    path: ["gender"],
  })
  .refine((data) => roles.includes(data.role), {
    message: "Please select a valid role",
    path: ["role"],
  });

/**
 * TypeScript type for form input
 */
export type MemberProfileFormInput = z.infer<typeof memberProfileFormSchema>;

/**
 * TypeScript type for validated output
 */
export type MemberProfileFormData = z.infer<typeof memberProfileSchema>;

/**
 * Type for the role field specifically
 */
export type MemberRole = (typeof roles)[number];

/**
 * Type for the blood type field specifically
 */
export type BloodType = (typeof bloodTypes)[number];

/**
 * Type for the gender field specifically
 */
export type Gender = (typeof genders)[number];
