import { Loader } from "lucide-react";

export default function Loading() {
    return (
        <div className="inline-flex select-none items-center justify-center gap-2">
            <Loader className="h-4 w-4 animate-spin" />
            <span>Loading...</span>
        </div>
    );
}
