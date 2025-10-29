"use client";

import CardJobSeek from "@/components/jobseek/cardJobSeek";
import { Navbar } from "@/components/navbar";
import { ProtectedRoute } from "@/components/protected-route";
import { useJobStore } from "@/store/useJobStore";
import { Job } from "@/types/job.types";
import { useEffect, useState } from "react";
import LoadingPage from "../loading";
import EmptyJobState from "@/components/state/empty-job-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { htmlToFormattedText } from "@/lib/helpers/htmlFormatter";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { FORM_APPLICANT } from "@/constants/routes";
import { generateRoute } from "@/lib/helpers/generateSlug";
import { useRouter } from "next/navigation";

export default function JobSeekPage() {
    const { loadJob, job, isLoading } = useJobStore();
    const [jobs, setJobs] = useState<Job[]>([]);
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [showDetail, setShowDetail] = useState(false);
    const router = useRouter();
    useEffect(() => {
        loadJob();
    }, [loadJob]);

    useEffect(() => {
        setJobs(job);
        if (job.length > 0 && !selectedJob) {
            setSelectedJob(job[0]);
        }
    }, [job, selectedJob]);

    const handleSelectJob = (jobData: Job) => {
        setSelectedJob(jobData);
        setShowDetail(true);
    };

    const handleBackToList = () => {
        setShowDetail(false);
    };

    const handleApplyJob = async (slug: string) => {
        const path = generateRoute(FORM_APPLICANT, { slug });
        router.push(path);
    }
    let content;
    if (isLoading) {
        content = <LoadingPage />;
    } else if (jobs.length === 0) {
        content = (
            <div className="flex flex-col items-center justify-center mt-30">
                <EmptyJobState
                    img="/artwork.png"
                    title="No job openings available"
                    subtitle="Create a job opening now and start the candidate process"
                />
            </div>
        );
    } else {
        content = jobs.map((jobData, index) => (
            <CardJobSeek
                title={jobData.title}
                salary={jobData.salary_range.display_text}
                key={jobData.id}
                index={index}
                isSelected={selectedJob?.id === jobData.id}
                onClick={() => handleSelectJob(jobData)}
            />
        ));
    }

    return (
        <ProtectedRoute allowedRoles={["jobseeker"]}>
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <div className="py-6 md:py-10 px-4 sm:px-6 md:px-10 lg:px-20 xl:px-80">
                    <div className="flex flex-col lg:flex-row gap-4 md:gap-6 h-[calc(100vh-140px)]">
                        <div className={`w-full lg:w-1/3 overflow-y-auto h-full pb-4 ${showDetail ? 'hidden lg:block' : 'block'}`}>
                            {content}
                        </div>

                        <div className={`flex-1 overflow-y-auto h-full ${showDetail ? 'block' : 'hidden lg:block'}`}>
                            {selectedJob ? (
                                <Card className="border-2">
                                    <div className="lg:hidden p-4 border-b">
                                        <button
                                            onClick={handleBackToList}
                                            className="flex items-center gap-2 text-[#01959F] hover:text-[#017a82] transition-colors"
                                        >
                                            <ArrowLeft className="size-5" />
                                            <span className="font-medium">Back to Jobs</span>
                                        </button>
                                    </div>

                                    <CardHeader>
                                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                                            <div className="flex flex-row items-start w-full sm:w-auto">
                                                <Image
                                                    src="/small_logo.png"
                                                    alt="Aiditel logo"
                                                    width={50}
                                                    height={50}
                                                    priority
                                                    className="shrink-0"
                                                />
                                                <div className="flex flex-col ml-3 flex-1">
                                                    <span className="bg-[#43936C] w-fit rounded text-white text-xs sm:text-sm px-2 py-1">
                                                        Full-Time
                                                    </span>
                                                    <CardTitle className="text-xl sm:text-2xl font-bold mt-2">
                                                        {selectedJob.title}
                                                    </CardTitle>
                                                    <p className="text-gray-500 text-base sm:text-lg">Rakamin</p>
                                                </div>
                                            </div>

                                            <button onClick={() => handleApplyJob(selectedJob.slug)} className="cursor-pointer w-full sm:w-auto bg-[#FBC037] hover:bg-[#e5b032] text-black font-semibold px-6 py-2 rounded-lg transition-colors whitespace-nowrap">
                                                Apply
                                            </button>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4 md:space-y-6">
                                        <Separator className="my-4" />
                                        <div>
                                            <h3 className="text-base sm:text-lg font-semibold mb-3">
                                                Job Description
                                            </h3>
                                            <p className="text-sm sm:text-base text-gray-700 whitespace-pre-line">
                                                {htmlToFormattedText(selectedJob.description)}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ) : (
                                <Card className="border-2">
                                    <CardContent className="flex items-center justify-center min-h-[300px] sm:min-h-[400px]">
                                        <p className="text-gray-400 text-base sm:text-lg text-center px-4">
                                            Select a job to view details
                                        </p>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}