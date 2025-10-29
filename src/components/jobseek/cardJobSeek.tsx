import { MapPin, Banknote } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

interface CardJobSeekProps {
    title: string;
    salary: string;
    index: number;
    isSelected: boolean;
    onClick: () => void;
}

export default function CardJobSeek({
    title,
    salary,
    index,
    isSelected,
    onClick
}: Readonly<CardJobSeekProps>) {
    return (
        <Card
            className={`border-2 cursor-pointer transition-all ${
                isSelected
                    ? "border-[#01959F] bg-[#01959f17] shadow-md"
                    : "border-gray-200 hover:border-[#01959F] hover:bg-[#01959f0a]"
            } ${index > 0 ? "mt-3" : ""}`}
            onClick={onClick}
        >
            <CardContent className="pt-6">
                <div className="flex flex-col items-start justify-start">
                    <div className="flex flex-row justify-start items-start">
                        <Image
                            src="/small_logo.png"
                            alt="Aiditel logo"
                            width={50}
                            height={50}
                            priority
                        />
                        <div className="flex flex-col ml-3">
                            <h3 className="font-bold">{title}</h3>
                            <span className="text-gray-400 text-sm mt-1">Rakamin</span>
                        </div>
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <div className="flex flex-row justify-start items-center">
                        <MapPin className="text-gray-400 size-5" />
                        <span className="text-gray-400 text-[15px] ml-3">Jakarta Selatan</span>
                    </div>
                    <div className="flex flex-row justify-start items-center mt-3">
                        <Banknote className="text-gray-400 size-5" />
                        <span className="text-gray-400 text-[15px] ml-3">{salary}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}