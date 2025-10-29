

export type JobStatus = 'active' | 'inactive' | 'draft';

export type SalaryRange = {
    min: number;
    max: number;
    currency: string;
    display_text: string;
};

export type ListCard = {
    badge: string,
    started_on_text: string,
    cta: string
}

export type Job = {
    id: string;
    slug: string;
    title: string;
    status: JobStatus;
    salary_range: SalaryRange;
    description: string;
    list_card: ListCard;
    profile_requirements: {
        key: string;
        validation: {
            required: boolean;
        };
    }[];
};

export type FormJob = {
    jobName: string;
    jobType: string;
    jobDescription: string;
    numOfCandidate: string;
    minSalary: string;
    maxSalary: string;
};


export type ProfileInfo = Record<string, "mandatory" | "optional" | "off">;
