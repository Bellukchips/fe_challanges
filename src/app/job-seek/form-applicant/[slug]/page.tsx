"use client"
import { Navbar } from "@/components/navbar";
import { ProtectedRoute } from "@/components/protected-route";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { slugToTitle } from "@/lib/helpers/generateSlug";
import { ArrowLeft, CalendarDays, ChevronDownIcon, Upload, Check, ChevronsUpDown, X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { FieldGroup, Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { DEFAULT_LOGIN_REDIRECT_APPLICANT } from "@/constants/routes";
import {
    RadioGroup,
    RadioGroupItem,
} from "@/components/ui/radio-group"
import PhoneInput from 'react-phone-input-2'
import { useJobStore } from "@/store/useJobStore";
import Loading from "@/components/ui/loading";
import { ApplicationCandidate } from "@/types/application.types";
import { candidateValidationSchema, createApplicationSchema } from "@/lib/validations/candidate";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { formateDateID } from "@/lib/helpers/dateFormat";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { cn } from "@/lib/utils"
import { useJobSeekerStore } from "@/store/useJobSeekerStore";
import { JobSeeker } from "@/types/jobseeker.type";
import { toast } from 'sonner';
import WebcamDialog from "@/components/jobseek/webcam-dialog";
export default function FormApplicant() {
    const { slug } = useParams<{ slug?: string }>();
    const [photo, setPhoto] = useState<string | null>(null);
    const [open, setOpen] = useState(false)
    const { getJobBySlug, isLoading, selectedJob } = useJobStore();
    const router = useRouter();
    const form = selectedJob
        ? createApplicationSchema(selectedJob.profile_requirements)
        : candidateValidationSchema;
    const {
        register,
        handleSubmit,
        control,
        setValue,
        formState: { errors },
    } = useForm<z.infer<typeof form>>({
        resolver: zodResolver(form),
        defaultValues: {
            photo_profile: "/avatar_profile.png",
            full_name: "",
            domicile: "",
            gender: "",
            email: "",
            phone_number: "",
            linkedin_link: "",
            date_of_birth: "",
        }
    });
    const provinces = [
        { value: "jakarta", label: "DKI Jakarta" },
        { value: "banten", label: "Banten" },
        { value: "jabar", label: "Jawa Barat" },
        { value: "jateng", label: "Jawa Tengah" },
        { value: "jatim", label: "Jawa Timur" },
    ];
    const { postCandidate, isLoading: isLoadingCandidate } = useJobSeekerStore();
    const [showModal, setShowModal] = useState(false);
    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        if (slug) {
            getJobBySlug(slug);
        }
    }, [slug, getJobBySlug]);

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
        }
    }, [showModal])

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


    const handleCapture = (imageSrc: string) => {
        setPhoto(imageSrc);
        setValue("photo_profile", imageSrc);
    };
    const openCameraModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };


    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const photoUrl = reader.result as string;
                setPhoto(photoUrl);
                setValue("photo_profile", photoUrl);
            };
            reader.readAsDataURL(file);
        }
    };

    const onSubmit = async (values: z.infer<typeof form>) => {
        try {
            if (!slug) {
                console.error("Slug is required");
                return;
            }

            const candidateData: JobSeeker = {
                id: "",
                full_name: values.full_name as string,
                photo_profile: "/avatar_profile.png", // set dummy foto karena upload foto hanya mock
                gender: values.gender as string,
                domicile: values.domicile as string,
                email: values.email as string,
                phone_number: values.phone_number as string,
                linkedin_link: values.linkedin_link as string,
                date_of_birth: typeof values.date_of_birth === 'string'
                    ? values.date_of_birth
                    : values.date_of_birth instanceof Date
                        ? formateDateID(values.date_of_birth)
                        : '',
            };

            await postCandidate(slug, candidateData);
            toast.success('Apply Job successfully.', { duration: 2000, position: "top-center" });
            router.push(DEFAULT_LOGIN_REDIRECT_APPLICANT)
        } catch (error) {
            console.error("Error submitting application:", error);
        }
    };

    const renderRequirementField = (requirement: ApplicationCandidate, index: number) => {
        const isRequired = requirement.validation.required;
        switch (requirement.key) {
            case "photo_profile":
                return (
                    <div key={index} className="flex flex-col mt-6 sm:mt-8 md:mt-10 items-start justify-start space-y-2">
                        {isRequired && (
                            <span className="text-xs sm:text-sm font-medium text-red-700 w-full">
                                <span className="text-red-500 mr-1">*</span> Required
                            </span>
                        )}

                        <span className="text-xs sm:text-sm font-semibold text-gray-700 mb-1 mb-3 mt-3 sm:mt-5">
                            Photo Profile
                        </span>

                        <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full overflow-hidden bg-linear-to-b from-blue-100 to-gray-100 shadow-sm flex items-center justify-center">
                            {photo ? (
                                <Image src={photo} alt="Profile" fill className="object-cover" />
                            ) : (
                                <Image src="/avatar_profile.png" alt="Profile" fill className="object-cover" />
                            )}
                        </div>

                        <Label
                            htmlFor="photo-upload"
                            onClick={openCameraModal}
                            className="mt-2 inline-flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-white border border-gray-300 text-gray-700 rounded-lg shadow-sm text-xs sm:text-sm font-medium hover:bg-gray-50 cursor-pointer transition"
                        >
                            <Upload className="w-3 h-3 sm:w-4 sm:h-4 text-black" />
                            Take a Picture
                        </Label>

                        {/* <input
                            id="photo-upload"
                            type="file"
                            accept="image/*"
                            capture="user"
                            onChange={handleFileChange}
                            className="hidden"
                        /> */}
                        {errors.photo_profile && (
                            <p className="text-red-500 text-xs sm:text-sm">{errors.photo_profile.message as string}</p>
                        )}
                    </div>
                );

            case "full_name":
                return (
                    <FieldGroup key={index} className="mt-6 sm:mt-8 md:mt-10">
                        <Field>
                            <FieldLabel htmlFor="full_name" className="text-xs sm:text-sm">
                                Full Name{isRequired && <sup className="text-red-500">*</sup>}
                            </FieldLabel>
                            <Input
                                id="full_name"
                                {...register("full_name")}
                                placeholder="Jhon Doe"
                                className="hover:border-[#01959F] text-sm sm:text-base h-10 sm:h-11"
                            />
                            {errors.full_name && (
                                <FieldError className="text-xs sm:text-sm">{errors.full_name.message as string}</FieldError>
                            )}
                        </Field>
                    </FieldGroup>
                );

            case "date_of_birth":
                return (
                    <div key={index} className="mt-4 sm:mt-5">
                        <Label htmlFor="date" className="mb-3 sm:mb-5 text-xs sm:text-sm">
                            Date of birth{isRequired && <sup className="text-red-500">*</sup>}
                        </Label>
                        <Controller
                            name="date_of_birth"
                            control={control}
                            render={({ field }) => (
                                <Popover open={open} onOpenChange={setOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="w-full justify-between font-normal h-10 sm:h-11 text-xs sm:text-sm"
                                        >
                                            <div className="flex flex-row items-center justify-center">
                                                <CalendarDays className="mr-2 sm:mr-5 w-4 h-4 sm:w-5 sm:h-5" />
                                                {field.value instanceof Date
                                                    ? formateDateID(field.value)
                                                    : "Select date of birth"}
                                            </div>
                                            <ChevronDownIcon className="w-4 h-4" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value instanceof Date ? field.value : undefined}
                                            captionLayout="dropdown"
                                            onSelect={(date) => {
                                                field.onChange(date);
                                                setOpen(false);
                                            }}
                                        />
                                    </PopoverContent>
                                </Popover>
                            )}
                        />
                        {errors.date_of_birth?.message && (
                            <p className="text-red-500 text-xs sm:text-sm mt-1">
                                {String(errors.date_of_birth.message)}
                            </p>
                        )}
                    </div>
                );

            case "gender":
                return (
                    <div key={index} className="mt-6 sm:mt-8">
                        <Label className="text-xs sm:text-sm font-semibold mb-2 block">
                            Pronoun (gender){isRequired && <sup className="text-red-500">*</sup>}
                        </Label>
                        <Controller
                            name="gender"
                            control={control}
                            render={({ field }) => (
                                <RadioGroup
                                    value={field.value as string || ""}
                                    onValueChange={field.onChange}
                                    className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-2"
                                >
                                    <div className="flex items-center gap-2 text-xs sm:text-sm">
                                        <RadioGroupItem
                                            value="female"
                                            id="female"
                                            className="data-[state=checked]:border-[#01959F] [&_circle]:fill-[#01959F]"
                                        />
                                        <Label htmlFor="female" className="cursor-pointer">
                                            She/her (Female)
                                        </Label>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs sm:text-sm">
                                        <RadioGroupItem
                                            value="male"
                                            id="male"
                                            className="data-[state=checked]:border-[#01959F] [&_circle]:fill-[#01959F]"
                                        />
                                        <Label htmlFor="male" className="cursor-pointer">
                                            He/him (Male)
                                        </Label>
                                    </div>
                                </RadioGroup>
                            )}
                        />
                        {errors.gender && (
                            <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.gender.message as string}</p>
                        )}
                    </div>
                );

            case "domicile":


                return (
                    <div key={index} className="mt-4 sm:mt-6">
                        <Label className="text-xs sm:text-sm font-semibold mb-2 block">
                            Domicile{isRequired && <sup className="text-red-500">*</sup>}
                        </Label>
                        <Controller
                            name="domicile"
                            control={control}
                            render={({ field }) => (
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            className="w-full justify-between h-10 sm:h-11 text-xs sm:text-sm font-normal"
                                        >
                                            {field.value
                                                ? provinces.find((province) => province.value === field.value)?.label
                                                : "Choose your domicile"}
                                            <ChevronsUpDown className="opacity-50 w-4 h-4" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-full p-0" align="start">
                                        <Command>
                                            <CommandInput placeholder="Search province..." className="h-9 text-xs sm:text-sm" />
                                            <CommandList>
                                                <CommandEmpty className="text-xs sm:text-sm py-6 text-center">No province found.</CommandEmpty>
                                                <CommandGroup>
                                                    {provinces.map((province) => (
                                                        <CommandItem
                                                            key={province.value}
                                                            value={province.value}
                                                            onSelect={(currentValue) => {
                                                                field.onChange(currentValue === field.value ? "" : currentValue);
                                                            }}
                                                            className="text-xs sm:text-sm"
                                                        >
                                                            {province.label}
                                                            <Check
                                                                className={cn(
                                                                    "ml-auto w-4 h-4",
                                                                    field.value === province.value ? "opacity-100" : "opacity-0"
                                                                )}
                                                            />
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            )}
                        />
                        {errors.domicile && (
                            <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.domicile.message as string}</p>
                        )}
                    </div>
                );

            case "phone_number":
                return (
                    <div key={index} className="mt-4 sm:mt-6">
                        <Label className="text-xs sm:text-sm font-semibold mb-2 block">
                            Phone number{isRequired && <sup className="text-red-500">*</sup>}
                        </Label>
                        <Controller
                            name="phone_number"
                            control={control}
                            render={({ field }) => (
                                <PhoneInput
                                    country={"id"}
                                    value={field.value as string || ""}
                                    onChange={field.onChange}
                                    disableSearchIcon
                                    enableSearch={true}
                                    inputStyle={{
                                        width: "100%",
                                        height: "42px",
                                        fontSize: "14px",
                                        padding: "0.5rem 0.5rem 0.5rem 4rem",
                                        borderRadius: "0.5rem",
                                        borderColor: "#E3E3E3FF",
                                    }}
                                    buttonStyle={{
                                        border: "1",
                                        padding: "0.5rem",
                                        borderRadius: "0.5rem 0 0 0.5rem",
                                        background: "#ffffff",
                                    }}
                                    searchStyle={{
                                        width: '100%',
                                        padding: '0.5rem',
                                        border: '1px solid #ccc',
                                        borderRadius: '4px',
                                        fontSize: '14px',
                                    }}
                                    dropdownStyle={{
                                        maxHeight: "200px",
                                        padding: "0 0.5rem 0.5rem 0",
                                        borderRadius: "0.5rem",
                                    }}
                                    containerStyle={{
                                        width: "100%",
                                    }}
                                />
                            )}
                        />
                        {errors.phone_number && (
                            <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.phone_number.message as string}</p>
                        )}
                    </div>
                );

            case "email":
                return (
                    <div key={index} className="mt-4 sm:mt-6">
                        <Label className="text-xs sm:text-sm font-semibold mb-2 block">
                            Email{isRequired && <sup className="text-red-500">*</sup>}
                        </Label>
                        <Input
                            type="email"
                            placeholder="Enter your email address"
                            {...register("email")}
                            className="h-10 sm:h-11 text-xs sm:text-sm"
                        />
                        {errors.email && (
                            <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.email.message as string}</p>
                        )}
                    </div>
                );

            case "linkedin_link":
                return (
                    <div key={index} className="mt-4 sm:mt-6">
                        <Label className="text-xs sm:text-sm font-semibold mb-2 block">
                            Link LinkedIn{isRequired && <sup className="text-red-500">*</sup>}
                        </Label>
                        <Input
                            type="url"
                            placeholder="https://linkedin.com/in/username"
                            {...register("linkedin_link")}
                            className="h-10 sm:h-11 text-xs sm:text-sm"
                        />
                        {errors.linkedin_link && (
                            <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.linkedin_link.message as string}</p>
                        )}
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <ProtectedRoute allowedRoles={['jobseeker']}>
            <div className="min-h-screen flex flex-col bg-gray-50 overflow-y-auto pb-20 sm:pb-32 md:pb-40">
                <Navbar />

                <div className="py-4 sm:py-6 md:py-10 px-3 sm:px-6 md:px-10 lg:px-20 xl:px-40 2xl:px-[400px]">
                    <Card className="bg-white shadow-sm">
                        <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
                            <div className="flex flex-col space-y-4 lg:space-y-0 lg:flex-row lg:justify-between lg:items-center">
                                <div className="flex flex-row items-center gap-3 sm:gap-4">
                                    <a
                                        href={DEFAULT_LOGIN_REDIRECT_APPLICANT}
                                        className="px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-md transition-colors bg-white text-gray-600 border border-gray-300 shadow hover:bg-gray-50"
                                    >
                                        <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                                    </a>
                                    <h3 className="font-bold text-sm sm:text-base md:text-lg line-clamp-2">
                                        Apply {slugToTitle(slug ?? '')} at Rakamin
                                    </h3>
                                </div>
                                <span className="text-xs sm:text-sm text-gray-600 flex items-center gap-1">
                                    <span>ℹ️</span>
                                    <span className="hidden sm:inline">This field required to fill</span>
                                    <span className="sm:hidden">Required fields</span>
                                </span>
                            </div>
                        </CardHeader>
                        <CardContent className="px-4 sm:px-6 py-4 sm:py-6">
                            {isLoading ? (
                                <div className="flex justify-center items-center py-12">
                                    <Loading />
                                </div>
                            ) : (
                                <form className="px-0 sm:px-4 md:px-8 lg:px-12 xl:px-20" onSubmit={handleSubmit(onSubmit)}>
                                    {selectedJob?.profile_requirements.map((requirement, index) =>
                                        renderRequirementField(requirement, index)
                                    )}

                                    <FieldGroup className="mt-6 sm:mt-8 mb-6 sm:mb-10">
                                        <Field>
                                            <Button disabled={isLoadingCandidate} className={`bg-[#01959F] text-white h-10 sm:h-11 md:h-[45px] w-full hover:bg-[#08727a] hover:cursor-pointer text-sm sm:text-base font-medium`}>
                                                {isLoadingCandidate ? "Submitting ..." : 'Submit'}
                                            </Button>
                                        </Field>
                                    </FieldGroup>
                                </form>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            <WebcamDialog dialogRef={dialogRef} onCapture={handleCapture} />
        </ProtectedRoute>
    );
}