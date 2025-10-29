import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
export default function ResetPassword() {

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
                        <a href="/auth/login" className="flex flex-row items-center mb-3 hover:cursor-pointer w-fit">
                            <ArrowLeft className="mr-2 text-[#01959F] size-5" />
                            <span className="text-sm font-medium text-[#01959F]">Kembali</span>
                        </a>
                        <CardTitle className="text-xl font-medium">

                            Selamat datang di Rakamin
                        </CardTitle>
                        <CardDescription>Masukin alamat email yang telah terdaftar untuk menerima email reset kata sandi.</CardDescription>
                        <CardContent className="px-0">
                            <form className="mt-5">
                                <FieldGroup>
                                    <Field>
                                        <FieldLabel htmlFor="email-card" className="">
                                            Alamat Email
                                        </FieldLabel>
                                        <Input id="email-card" className="hover:border-[#01959F]" />
                                        <FieldError>Alamat email tidak boleh kosong</FieldError>
                                    </Field>
                                </FieldGroup>
                                <FieldGroup className="mt-8">
                                    <Field>
                                        <Button className="bg-[#FBC037] text-black h-[45px] w-full hover:bg-[#e5b034] hover:cursor-pointer">Kirim email</Button>
                                    </Field>
                                </FieldGroup>
                            </form>
                        </CardContent>
                    </CardHeader>
                </Card>
            </div>
        </div>
    );
}