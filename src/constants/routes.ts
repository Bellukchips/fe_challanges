export const publicRoutes: string[] = ["/"];

export const authRoutes: string[] = [
    "/auth/login",
    "/auth/register",
    "/auth/reset-password",
];

export const authLoginPage: string = "/auth/login";

export const DEFAULT_LOGIN_REDIRECT_APPLICANT:string = "/job-seek"
export const DEFAULT_LOGIN_REDIRECT_ADMIN:string = "/admin/jobs"

export const CANDIDATE_LIST: string = "/admin/candidates/:slug";
export const JOB_LIST: string = "/admin/jobs";
export const FORM_APPLICANT = "/job-seek/form-applicant/:slug";