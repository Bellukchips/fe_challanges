import { ProfileRequirementFormatted } from "@/lib/helpers/formatProfileRequirement";
import { jobApi } from "@/lib/services/jobApi";
import { FormJob, Job } from "@/types/job.types";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface JobStore {
    job: Job[],
    isLoading: boolean,
    message: string,
    selectedJob: Job | null;
    error: string | null,
    loadJob: () => Promise<void>
    postJob: (form: FormJob, requirements: ProfileRequirementFormatted[]) => Promise<void>;
    getJobBySlug: (slug: string) => Promise<void>;
}


export const useJobStore = create<JobStore>()(
    devtools(
        (set) => ({
            job: [],
            isLoading: false,
            selectedJob: null,
            error: null,
            loadJob: async () => {
                set({ isLoading: true });
                try {
                    const response = await jobApi.getJobs();
                    set({ job: response.data, isLoading: false });
                } catch (error) {
                    console.error('Error loading jobs:', error);
                    set({ error: 'Error loading jobs', isLoading: false });

                }
            },
            getJobBySlug: async (slug: string) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await jobApi.getJobBySlug(slug);
                    if (response.data) {
                        set({ selectedJob: response.data, isLoading: false });
                    } else {
                        set({ error: response.message, isLoading: false });
                    }
                } catch (error) {
                    console.error('Error loading job by slug:', error);
                    set({ error: 'Error loading job', isLoading: false });
                }
            },
            postJob: async (form, requirements) => {
                set({ isLoading: true });
                try {
                    const response = await jobApi.postNewJob(form, requirements);
                    set({ message: response.message, isLoading: false });
                } catch {
                    set({ error: 'Error posting job', isLoading: false });
                }
            }
        }), {
        name: 'job-store'
    }
    )
);