import { JobSeeker } from "@/types/jobseeker.type";
import z from "zod";
import { candidateValidationSchema } from "../validations/candidate";

interface CandidateResponse {
    message: string,
    data?: JobSeeker[]
}


class CandidateService {
    private candidateMock: JobSeeker[] = [];

    private isLoaded: boolean = false;

    private delay(ms: number = 500): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    private async loadMockCandidate(slug: string): Promise<void> {
        if (this.isLoaded) return;
        try {
            const response = await fetch(`/api/candidate`);
            const data = await response.json();

            if (data?.data && typeof data.data === 'object' && !Array.isArray(data.data)) {
                const candidates = data.data[slug];
                this.candidateMock = Array.isArray(candidates) ? candidates : [];
            } else {
                this.candidateMock = [];
            }

            this.isLoaded = true;
        } catch (error) {
            console.error("Error loading mock candidate:", error);
            this.candidateMock = [];
            this.isLoaded = false;
        }
    }

    async getCandidates(slug: string): Promise<CandidateResponse> {
        await this.loadMockCandidate(slug);
        await this.delay();
        return {
            message: "Success",
            data: this.candidateMock
        };
    }

    async postNewCandidate(form: z.infer<typeof candidateValidationSchema>, slug: string): Promise<CandidateResponse> {
        await this.delay(500);

        const newCandidate: JobSeeker = {
            id: "",
            full_name: form.full_name ?? '',
            photo_profile: form.photo_profile ?? '',
            gender: form.gender ?? '',
            domicile: form.domicile ?? '',
            email: form.email ?? '',
            phone_number: form.phone_number ?? '',
            linkedin_link: form.linkedin_link ?? '',
            date_of_birth: form.date_of_birth ?? ''
        };

        try {
            const response = await fetch('/api/candidate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    newCandidate,
                    slug
                })
            });

            const result = await response.json();

            if (response.ok) {
                this.candidateMock.unshift(newCandidate);

                this.isLoaded = false;

                return {
                    message: result.message || "Success post new candidate",
                    data: [newCandidate]
                }
            }

            return {
                message: result.message || "Error post new candidate",
                data: []
            }
        } catch (error) {
            console.error("Error post new candidate:", error);
            return {
                message: "Error post new candidate",
                data: []
            }
        }
    }
}

export const candidateApi = new CandidateService();