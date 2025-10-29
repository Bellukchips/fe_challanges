import z from "zod";

export const jobValidationSchema = z.object({
    jobName: z.string().min(6).max(100),
    jobType: z.string().max(20),
    jobDescription: z.string(),
    numOfCandidate: z.string(),
    minSalary: z.string(),
    maxSalary: z.string(),
});

