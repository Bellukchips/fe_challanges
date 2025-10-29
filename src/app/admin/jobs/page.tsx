"use client";

import { Navbar } from "@/components/navbar";
import { ProtectedRoute } from "@/components/protected-route";
import EmptyJobState from "@/components/state/empty-job-state";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { jobValidationSchema } from "@/lib/validations/job";
import { FieldGroup, Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import RichTextEditor from "@/components/rich-text-editor";
import { useJobStore } from "@/store/useJobStore";
import { toast } from "sonner";
import { formatProfileRequirements } from "@/lib/helpers/formatProfileRequirement";
import { Job } from "@/types/job.types";
import { JobCard } from "@/components/admin/jobCard";
import { useRouter } from "next/navigation";
import { CANDIDATE_LIST } from "@/constants/routes";
import { generateRoute } from "@/lib/helpers/generateSlug";
import LoadingPage from "@/app/loading";

export default function JobsList() {

    const [showModal, setShowModal] = useState(false);
    const dialogRef = useRef<HTMLDialogElement>(null);
    const job = useJobStore((state) => state.job);
    const router = useRouter();
    const loadJob = useJobStore((state) => state.loadJob);
    const [jobs, setJobs] = useState<Job[]>([]);
    const isLoading = useJobStore((state) => state.isLoading);
    const postJob = useJobStore((state) => state.postJob);
    const form = useForm<z.infer<typeof jobValidationSchema>>({
        resolver: zodResolver(jobValidationSchema),
        defaultValues: {
            jobName: "",
            jobType: "",
            jobDescription: "",
            numOfCandidate: "",
            minSalary: "",
            maxSalary: ""
        }
    });
    const [searchTerm, setSearchTerm] = useState<string>("");
    type RequirementValue = "mandatory" | "optional" | "off";

    const [profileRequirements, setProfileRequirements] = useState<Record<string, RequirementValue>>({
        'photo-profile': 'mandatory',
        'full-name': 'mandatory',
        'gender': 'mandatory',
        'domicile': 'mandatory',
        'email': 'mandatory',
        'phone-number': 'mandatory',
        'linkedin-link': 'mandatory',
        'date-of-birth': 'mandatory'
    });

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        if (showModal) {
            dialog.showModal();
            document.body.style.overflow = 'hidden';
        } else {
            dialog.close();
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [showModal]);


    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        const handleBackdropClick = (event: MouseEvent) => {
            const rect = dialog.getBoundingClientRect();
            const isInDialog = (
                rect.top <= event.clientY &&
                event.clientY <= rect.top + rect.height &&
                rect.left <= event.clientX &&
                event.clientX <= rect.left + rect.width
            );

            if (!isInDialog) {
                closeModal();
            }
        };

        dialog.addEventListener('click', handleBackdropClick);

        return () => {
            dialog.removeEventListener('click', handleBackdropClick);
        };
    }, []);

    useEffect(() => {
        loadJob();
    }, [loadJob]);

    useEffect(() => {
        setJobs(job);
    }, [job]);

    const handleRequirementChange = (fieldId: string, value: RequirementValue) => {
        setProfileRequirements(prev => ({
            ...prev,
            [fieldId]: value
        }));
    };


    const openCreateModal = () => {
        setShowModal(true);
        form.reset();
    };

    const closeModal = () => {
        setShowModal(false);
        form.reset();
    };


    const {
        register,
        handleSubmit,
        formState: { errors },
    } = form;


    const onSubmit = async (data: z.infer<typeof jobValidationSchema>) => {
        try {
            const formattedProfileRequirements = formatProfileRequirements(profileRequirements);

            await postJob(data, formattedProfileRequirements);

            toast.success('Job created successfully.', { duration: 2000, position: "top-center" });
            setProfileRequirements({
                'photo-profile': 'mandatory',
                'full-name': 'mandatory',
                'gender': 'mandatory',
                'domicile': 'mandatory',
                'email': 'mandatory',
                'phone-number': 'mandatory',
                'linkedin-link': 'mandatory',
                'date-of-birth': 'mandatory'
            });
            closeModal();
        } catch (error) {
            console.log(error);
        }
    };

    const handleManageJob = async (slug: string) => {
        const path = generateRoute(CANDIDATE_LIST, { slug });
        router.push(path);
    }
    const filteredData = jobs.filter((item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
    let content;

    if (isLoading) {
        content = <LoadingPage />;
    } else if (jobs.length === 0) {
        content = (
            <div className="flex flex-col items-center justify-center mt-30">
                <EmptyJobState img="/artwork.png" title="No job openings available" subtitle="Create a job opening now and start the candidate process" />
                <button
                    onClick={openCreateModal}
                    className="mt-5 sm:mt-6 bg-[#FBC037] text-black text-sm sm:text-base font-medium py-2.5 sm:py-3 px-6 sm:px-8 rounded-lg hover:bg-[#e5b034] transition-colors shadow-sm"
                >
                    Create a new job
                </button>
            </div>
        );
    } else {
        content = filteredData.map((jobData,index) => (
            <JobCard
                index={index}
                key={jobData.id}
                status={jobData.status}
                startedOn={jobData.list_card.started_on_text}
                title={jobData.title}
                onManageClick={() => handleManageJob(jobData.slug)}
                salaryRange={jobData.salary_range.display_text}
                buttonTitle={jobData.list_card.cta}
            />
        ));
    }


    return (
        <ProtectedRoute allowedRoles={['admin']}>
            <div className="min-h-screen flex flex-col overflow-y-auto">
                <Navbar />

                <div className="flex-1 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 py-6 sm:py-8 lg:py-10">
                    <div className="flex flex-col lg:flex-row gap-4 sm:gap-5 lg:gap-6 mb-8 sm:mb-10 lg:mb-12">
                        <div className="flex-1 min-w-0">
                            <div className="relative w-full">
                                <Input
                                    placeholder="Search by job details"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="hover:border-[#01959F] pr-10 h-11 sm:h-12 focus:border-[#01959F] w-full text-sm sm:text-base"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                                    aria-label="Search"
                                >
                                    <Search className="text-[#01959F] w-5 h-5" />
                                </button>
                            </div>

                            <div className="mt-6">
                                {content}
                            </div>
                        </div>

                        <div className="w-full lg:w-[330px] xl:w-[350px] shrink-0">
                            <div className="relative h-[180px] sm:h-[200px] overflow-hidden rounded-lg sm:rounded-xl shadow-lg">
                                <div className="absolute inset-0 bg-[url('/bg-card.jpg')] bg-cover bg-center" />
                                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/60 to-transparent" />
                                <div className="relative z-10 flex flex-col justify-end h-full p-4 sm:p-5">
                                    <h2 className="text-white text-base sm:text-lg font-semibold leading-tight">
                                        Recruit the best candidates
                                    </h2>
                                    <p className="text-xs sm:text-sm text-gray-200 leading-snug mt-1 sm:mt-2">
                                        Create jobs, invite and hire with ease.
                                    </p>
                                    <button
                                        onClick={openCreateModal}
                                        className="mt-3 sm:mt-4 bg-[#01959F] text-white text-xs sm:text-sm font-medium py-2 px-4 rounded-lg hover:bg-[#017b83] transition-colors w-full sm:w-auto"
                                    >
                                        Create a new job
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <dialog
                ref={dialogRef}
                onCancel={closeModal}
                className="backdrop:bg-black/50 bg-transparent p-0 max-w-2xl w-full max-h-[90vh] rounded-lg m-auto overflow-visible"
            >
                <div className="bg-white rounded-lg shadow-xl w-full p-6 max-h-[90vh] overflow-y-auto">
                    <div className="flex flex-row justify-between items-start mb-6">
                        <h2 className="text-xl font-bold">
                            Job Opening
                        </h2>
                        <button
                            type="button"
                            onClick={closeModal}
                            aria-label="Close modal"
                            className="cursor-pointer hover:bg-gray-100 rounded p-1 transition-colors focus:outline-none focus:ring-2 focus:ring-[#01959F]"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <FieldGroup>
                                <Field>
                                    <FieldLabel htmlFor="job-title-card" className="text-sm">
                                        Job Title<sup className="text-red-500">*</sup>
                                    </FieldLabel>
                                    <Input id="job-title-card" placeholder="Ex: Front End Engineer" className="hover:border-[#01959F]" {...register('jobName')} />
                                    <FieldError>{errors.jobName?.message}</FieldError>
                                </Field>
                            </FieldGroup>
                        </div>

                        <div>
                            <label htmlFor="job-type-card" className="block text-sm font-medium mb-2">
                                Job Type<sup className="text-red-500">*</sup>
                            </label>
                            <select
                                id="job-type-card"
                                {...register('jobType')}
                                className="w-full h-10 px-3 rounded-md border border-gray-300 hover:border-[#01959F] focus:border-[#01959F] focus:outline-none focus:ring-2 focus:ring-[#01959F]/20"
                                defaultValue=""
                            >
                                <option value="" disabled>Select job type</option>
                                <option value="Full-time">Full-time</option>
                                <option value="Contract">Contract</option>
                                <option value="Part-time">Part-time</option>
                                <option value="Internship">Internship</option>
                                <option value="Freelance">Freelance</option>
                            </select>
                            <FieldError>{errors.jobType?.message}</FieldError>
                        </div>
                        <div>
                            <FieldGroup>
                                <Field>
                                    <FieldLabel htmlFor="desc-card" className="text-sm">
                                        Description<sup className="text-red-500">*</sup>
                                    </FieldLabel>

                                    <Controller
                                        control={form.control}
                                        name="jobDescription"
                                        render={({ field }) => (
                                            <RichTextEditor
                                                value={field.value}
                                                onChange={field.onChange}
                                            />
                                        )}
                                    />

                                    {errors.jobDescription && (
                                        <FieldError>{errors.jobDescription.message}</FieldError>
                                    )}
                                </Field>
                            </FieldGroup>
                        </div>

                        <div>
                            <FieldGroup>
                                <Field>
                                    <FieldLabel htmlFor="num-candidate-card" className="text-sm">
                                        Number of Candidate Needed<sup className="text-red-500">*</sup>
                                    </FieldLabel>
                                    <Input id="num-candidate-card" placeholder="Ex: 1" className="hover:border-[#01959F]" {...register('numOfCandidate')} />
                                    <FieldError>{errors.numOfCandidate?.message}</FieldError>
                                </Field>
                            </FieldGroup>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FieldGroup>
                                <Field>
                                    <FieldLabel htmlFor="min-salary">Minimum Estimated Salary</FieldLabel>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-3 flex items-center text-gray-500 font-bold pointer-events-none">
                                            RP
                                        </span>
                                        <Input
                                            id="min-salary"
                                            type="number"
                                            {...register('minSalary')}
                                            placeholder="7.000.000"
                                            className="hover:border-[#01959F] focus:border-[#01959F] pl-12"
                                        />
                                    </div>
                                    <FieldError>{errors.minSalary?.message}</FieldError>
                                </Field>
                            </FieldGroup>

                            <FieldGroup>
                                <Field>
                                    <FieldLabel htmlFor="max-salary">Maximum Estimated Salary</FieldLabel>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-3 flex items-center text-gray-500 font-bold pointer-events-none">
                                            RP
                                        </span>
                                        <Input
                                            id="max-salary"
                                            type="number"
                                            {...register('maxSalary')}
                                            placeholder="8.000.000"
                                            className="hover:border-[#01959F] focus:border-[#01959F] pl-12"
                                        />
                                    </div>
                                    <FieldError>{errors.maxSalary?.message}</FieldError>
                                </Field>
                            </FieldGroup>
                        </div>
                        <div>
                            <Card>
                                <CardHeader>
                                    <h4 className="font-medium text-base">Minimum Profile Information Required</h4>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {[
                                        { id: 'full-name', label: 'Full name' },
                                        { id: 'photo-profile', label: 'Photo Profile' },
                                        { id: 'gender', label: 'Gender' },
                                        { id: 'domicile', label: 'Domicile' },
                                        { id: 'email', label: 'Email' },
                                        { id: 'phone-number', label: 'Phone number' },
                                        { id: 'linkedin-link', label: 'Linkedin link' },
                                        { id: 'date-of-birth', label: 'Date of birth' }
                                    ].map((field) => (
                                        <div key={field.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                                            <label htmlFor={field.id} className="text-sm text-gray-700">
                                                {field.label}
                                            </label>
                                            <div className="flex gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => handleRequirementChange(field.id, 'mandatory')}
                                                    className={`px-4 py-1.5 text-xs font-medium rounded-full transition-colors ${profileRequirements[field.id] === 'mandatory'
                                                        ? ' border border-[#01959F] text-[#01959F]'
                                                        : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
                                                        }`}
                                                >
                                                    Mandatory
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRequirementChange(field.id, 'optional')}
                                                    className={`px-4 py-1.5 text-xs font-medium rounded-full transition-colors ${profileRequirements[field.id] === 'optional'
                                                        ? ' border border-[#01959F] text-[#01959F]'
                                                        : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
                                                        }`}
                                                >
                                                    Optional
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRequirementChange(field.id, 'off')}
                                                    className={`px-4 py-1.5 text-xs font-medium rounded-full transition-colors ${profileRequirements[field.id] === 'off'
                                                        ? ' border border-[#01959F] text-[#01959F]'
                                                        : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
                                                        }`}
                                                >
                                                    Off
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </div>

                        <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                            <button
                                type="button"
                                onClick={closeModal}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                disabled={isLoading}
                                type="submit"
                                className="px-4 py-2 text-sm font-medium text-white bg-[#01959F] rounded-lg hover:bg-[#017b83] transition-colors"
                            >
                                {isLoading ? 'Creating...' : 'Publish Job'}
                            </button>
                        </div>
                    </form>
                </div>
            </dialog>
        </ProtectedRoute>
    );
}