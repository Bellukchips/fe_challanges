"use client";
import Image from "next/image";

interface EmptyJobStateProps {
    img: string,
    title: string,
    subtitle: string
}



export default function EmptyJobState({ img, title, subtitle }: Readonly<EmptyJobStateProps>) {
    return (
        <div className="flex w-full flex-col items-center justify-center px-4 sm:px-6">
            <div className="flex flex-col items-center text-center max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
                <div className="w-full max-w-[280px] sm:max-w-[320px] md:max-w-[350px]">
                    <Image
                        src={img}
                        alt="Aiditel logo"
                        width={350}
                        height={350}
                        priority
                        className="w-full h-auto"
                    />
                </div>

                <h2 className="mt-5 sm:mt-6 text-xl sm:text-2xl md:text-3xl font-medium tracking-tight text-gray-900 leading-tight">
                    {title}
                </h2>

                <p className="mt-2 sm:mt-3 text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed px-2">
                    {subtitle}
                </p>
            </div>
        </div>
    );
}