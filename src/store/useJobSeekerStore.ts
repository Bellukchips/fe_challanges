import { candidateApi } from "@/lib/services/candidateApi"
import { JobSeeker } from "@/types/jobseeker.type"
import { create } from "zustand"
import { devtools } from "zustand/middleware"

interface JobSeekerStore {
    jobSeeker: JobSeeker[]
    isLoading: boolean
    message: string
    error: string | null
    loadJobSeeker: (slug: string) => Promise<void>
    postCandidate: (slug: string, form: JobSeeker) => Promise<void>
}


export const useJobSeekerStore = create<JobSeekerStore>()(
    devtools(
        (set) => ({
            jobSeeker: [],
            isLoading: false,
            message: '',
            error: null,
            loadJobSeeker: async (slug: string) => {
                set({ isLoading: true });
                try {
                    const response = await candidateApi.getCandidates(slug);
                    set({ jobSeeker: response.data, isLoading: false, message: response.message, error: null });
                } catch (error) {
                    set({ jobSeeker: [], isLoading: false, message: '', error: (error as Error).message });
                }
            },
            postCandidate: async (slug: string, form: JobSeeker) => {
                set({ isLoading: true });
                try {
                    const response = await candidateApi.postNewCandidate(form, slug);

                    set({ jobSeeker: response.data, isLoading: false, message: response.message, error: null });
                } catch (error) {
                    set({ jobSeeker: [], isLoading: false, message: '', error: (error as Error).message });
                }
            }
        })
    )
)