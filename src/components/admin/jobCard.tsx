import React from "react";

interface JobCardProps {
    status: string;
    startedOn: string;
    title: string;
    salaryRange: string;
    buttonTitle: string
    onManageClick?: () => Promise<void>;
    index:number
}

export const JobCard: React.FC<JobCardProps> = ({
    status,
    startedOn,
    title,
    salaryRange,
    buttonTitle,
    index,
    onManageClick,
}) => {
    const badgeColor =
        status === "active"
            ? "bg-[#E0F7F9] text-[#01959F]"
            : status === "draft"
                ? "bg-[#FFF8E6] text-[#FFB400]"
                : `bg-red-200 text-red-500`;

    return (
        <div className={`flex justify-between items-end-safe bg-white border border-gray-100 shadow-sm rounded-2xl p-4 hover:shadow-md transition-all ${index > 0 ? "mt-3" : ""}`}>
            <div className="flex items-start gap-4">
                <div className="border-l-2 border-dotted border-[#01959F] h-full ml-2"></div>

                <div>
                    <div className="flex items-center gap-3">
                        <span
                            className={`text-xs font-medium px-2 py-1 rounded-md ${badgeColor}`}
                        >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </span>
                        <p className="text-xs text-gray-500">started on {startedOn}</p>
                    </div>

                    <h3 className="text-base font-semibold text-gray-800 mt-2">
                        {title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">{salaryRange}</p>
                </div>
            </div>

            <button
                onClick={onManageClick}
                className="bg-[#01959F] hover:bg-[#017B84] text-white text-xs font-medium px-3 py-2 rounded-md transition-colors cursor-pointer"
            >
                {buttonTitle}
            </button>
        </div>
    );
};
