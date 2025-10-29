"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Eye, EyeOff, Mail } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import z from "zod";
import { loginValidationSchema } from "@/lib/validations/login";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useToken from "@/hooks/useToken";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import { DEFAULT_LOGIN_REDIRECT_ADMIN, DEFAULT_LOGIN_REDIRECT_APPLICANT } from "@/constants/routes";
export default function LoginPage() {

    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const form = useForm<z.infer<typeof loginValidationSchema>>({
        resolver: zodResolver(loginValidationSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    });
    const { login, isLoading } = useAuthStore();
    const { user, isAuthenticated } = useToken();


    useEffect(() => {
        checkTypeRole();
    }, [user, isAuthenticated]);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = form;


    const onSubmit = async (values: z.infer<typeof loginValidationSchema>) => {
        try {
            await login(values.email, values.password);
            toast("Login Berhasil", { duration: 2000, position: "top-center" });
            location.reload();
        } catch (error) {
            console.log(error);
        }
    }

    const checkTypeRole = () => {
        if (!isAuthenticated || !user) return;
        if (user?.role === "admin" && isAuthenticated) {
            router.push(DEFAULT_LOGIN_REDIRECT_ADMIN);
        }
        if (user?.role === "jobseeker" && isAuthenticated) {
            router.push(DEFAULT_LOGIN_REDIRECT_APPLICANT);
        }
    }


    return (
        <div className="flex min-h-screen flex-col justify-center px-6 py-12 bg-[#FAFAFA] w-full overflow-y-auto">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <Image
                    className="dark:invert"
                    src="/logo_rakamin.png"
                    alt="logo"
                    width={180}
                    height={38}
                    priority
                />
            </div>
            <div className="mt-10 mx-auto w-full max-w-md">
                <Card className="w-full p-6">
                    <CardHeader>
                        <CardTitle className="text-xl font-medium">Masuk ke Rakamin</CardTitle>
                        <CardDescription>Belum punya akun? <a href="/auth/register" className="text-[#01959F] hover:text-[15px] hover:underline">Daftar menggunakan email</a></CardDescription>
                        <CardContent className="px-0">
                            <form className="mt-5" onSubmit={handleSubmit(onSubmit)}>
                                <FieldGroup>
                                    <Field>
                                        <FieldLabel htmlFor="email-card" className="">
                                            Alamat Email
                                        </FieldLabel>
                                        <Input id="email-card" className="hover:border-[#01959F]" {...register("email")} />
                                        <FieldError>{errors.email?.message}</FieldError>
                                    </Field>
                                </FieldGroup>
                                <FieldGroup className="mt-3">
                                    <Field>
                                        <FieldLabel htmlFor="password-card">Kata Sandi</FieldLabel>

                                        <div className="relative">
                                            <Input
                                                id="password-card"
                                                type={showPassword ? "text" : "password"}
                                                className="hover:border-[#01959F] pr-10"
                                                {...register("password")}
                                            />

                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                                            >
                                                {showPassword ? <EyeOff /> : <Eye />}
                                            </button>
                                        </div>

                                        <FieldError>{errors.password?.message}</FieldError>
                                    </Field>
                                </FieldGroup>

                                <FieldGroup className="mt-8">
                                    <Field>
                                        <div className="flex-col flex justify-end">
                                            <div className="mb-2 text-right">
                                                <a
                                                    href="/auth/reset-password"
                                                    className="text-[#01959F]"
                                                >
                                                    Lupa Kata Sandi ?
                                                </a>
                                            </div>
                                            <div className="w-full">

                                                <Button disabled={isLoading} type="submit" className="bg-[#FBC037] text-black h-[45px] w-full hover:bg-[#e5b034]  hover:cursor-pointer">{isLoading ? "Loading..." : "Masuk"}</Button>
                                            </div>
                                        </div>
                                    </Field>
                                </FieldGroup>
                            </form>
                            <div className="flex items-center my-6">
                                <div className="flex grow border-t border-gray-300"></div>
                                <span className="mx-4 text-gray-400">or</span>
                                <div className="flex grow border-t border-gray-300"></div>
                            </div>
                            <div className="space-y-3">
                                <button className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-3 hover:bg-gray-50 transition">
                                    <Mail className="text-gray-600" size={18} />
                                    <span className="text-sm">Kirim link login melalui email</span>
                                </button>

                                <button className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-3 hover:bg-gray-50 transition">
                                    <FcGoogle size={18} />
                                    <span className="text-sm">Masuk dengan Google</span>
                                </button>
                            </div>
                        </CardContent>
                    </CardHeader>
                </Card>
            </div>
        </div>
    );
}

