import z from "zod";
import { ApplicationCandidate } from "@/types/application.types";

export const candidateValidationSchema = z.object({
    full_name: z.string().min(6).max(100).optional(),
    photo_profile: z.string().optional(),
    domicile: z.string().optional(),
    gender: z.string().optional(),
    email: z.string().optional(),
    phone_number: z.string().optional(),
    linkedin_link: z.string().optional(),
    date_of_birth: z.string().optional(),
});

export const createApplicationSchema = (requirements: ApplicationCandidate[]) => {
    const schemaShape: Record<string, z.ZodTypeAny> = {};
    requirements.forEach((req) => {
        const isRequired = req.validation.required;
        switch (req.key) {
            case "photo_profile":
                schemaShape[req.key] = isRequired
                    ? z.string().min(1, "Photo profile is required")
                    : z.string().optional();
                break;
            case "full_name":
                schemaShape[req.key] = isRequired
                    ? z.string().min(1, "Full name is required").min(3, "Full name must be at least 3 characters")
                    : z.string().optional();
                break;
            case "date_of_birth":
                schemaShape[req.key] = isRequired
                    ? z.date({ message: "Date of birth is required" })
                    : z.date().optional();
                break;
            case "gender":
                schemaShape[req.key] = isRequired
                    ? z.enum(["male", "female"], { message: "Gender is required" })
                    : z.enum(["male", "female"]).optional();
                break;
            case "domicile":
                schemaShape[req.key] = isRequired
                    ? z.string().min(1, "Domicile is required")
                    : z.string().optional();
                break;
            case "phone_number":
                schemaShape[req.key] = isRequired
                    ? z.string().min(10, "Phone number must be at least 10 digits")
                    : z.string().optional();
                break;
            case "email":
                schemaShape[req.key] = isRequired
                    ? z.string().min(1, "Email is required").refine(
                        (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
                        { message: "Invalid email address" }
                    )
                    : z.string().refine(
                        (val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
                        { message: "Invalid email address" }
                    ).optional();
                break;
            case "linkedin_link":
                schemaShape[req.key] = isRequired
                    ? z.string().min(1, "LinkedIn URL is required").refine(
                        (val) => {
                            try {
                                new URL(val);
                                return val.includes("linkedin.com");
                            } catch {
                                return false;
                            }
                        },
                        { message: "Must be a valid LinkedIn URL" }
                    )
                    : z.string().refine(
                        (val) => {
                            if (!val) return true;
                            try {
                                new URL(val);
                                return true;
                            } catch {
                                return false;
                            }
                        },
                        { message: "Invalid URL" }
                    ).optional();
                break;
        }
    });
    return z.object(schemaShape);
};