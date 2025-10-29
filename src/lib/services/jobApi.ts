import { ListCard, SalaryRange } from "@/types/job.types"
import z from 'zod';
import { jobValidationSchema } from "../validations/job";
import { generateSlug } from "../helpers/generateSlug";
import { Job } from '../../types/job.types';
import { moneyFormat } from "../helpers/moneyFormat";
import { ProfileRequirementFormatted } from "../helpers/formatProfileRequirement";
import { formateDateID } from "../helpers/dateFormat";

interface JobResponse {
    message: string,
    data?: Job[];

}
interface SingleJobResponse {
    message: string,
    data?: Job;
}


class JobService {
    private jobMock: Job[] = [];
    private isLoaded: boolean = false;

    private delay(ms: number = 500): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    private async loadMockJob(): Promise<void> {
        if (this.isLoaded) return;
        try {
            const response = await fetch('/api/job');
            const data = await response.json();
            this.jobMock = data.data;
            this.isLoaded = true;
        } catch (error) {
            console.error('Error loading mock jobs:', error);
            this.isLoaded = false;
        }
    }

    async getJobs(): Promise<JobResponse> {
        await this.loadMockJob();
        await this.delay();

        return {
            data: this.jobMock,
            message: "Success"
        };
    }

    async getJobBySlug(slug: string): Promise<SingleJobResponse> {
        await this.loadMockJob();
        await this.delay();

        const job = this.jobMock.find(j => j.slug === slug);

        if (!job) {
            return {
                message: "Job not found"
            };
        }

        return {
            data: job,
            message: "Success"
        };
    }



    async postNewJob(data: z.infer<typeof jobValidationSchema>, profileRequirements: ProfileRequirementFormatted[]): Promise<JobResponse> {
        await this.delay(500);
        const slug = generateSlug(data.jobName);
        const initStatus = "active";
        const salaryRange: SalaryRange = {
            min: Number(data.minSalary),
            max: Number(data.maxSalary),
            currency: "IDR",
            display_text: `${moneyFormat(Number(data.minSalary))} - ${moneyFormat(Number(data.maxSalary))}`
        };
        const listCard: ListCard = {
            badge: initStatus,
            started_on_text: `started on ${formateDateID(new Date())}`,

            cta: "Manage Job"
        };


        const newJob: Job = {
            id: "job_" + Date.now(),
            slug: slug,
            title: data.jobName,
            status: initStatus,
            description: data.jobDescription,
            salary_range: salaryRange,
            list_card: listCard,
            profile_requirements: profileRequirements
        };

        try {
            const res = await fetch("/api/job", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newJob),
            });

            await res.json();

            if (res.ok) {
                this.jobMock.unshift(newJob);
            }

            return {
                message: 'Job posted successfully'
            };
        } catch (err) {
            console.error("POST error:", err);
            return {
                message: "Error posting job"
            };
        }
    }

}

export const jobApi = new JobService();

