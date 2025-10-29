import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";
export default function RegisterPage() {
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
                        <CardTitle className="text-xl font-medium">Bergabung dengan Rakamin</CardTitle>
                        <CardDescription>Sudah punya akun? <a href="/auth/login" className="text-[#01959F] hover:text-[15px] hover:underline">Masuk</a></CardDescription>
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
                                        <Button className="bg-[#FBC037] text-black h-[45px] w-full hover:bg-[#e5b034]  hover:cursor-pointer">Daftar dengan email</Button>
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