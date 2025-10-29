export interface ProfileRequirementFormatted {
    key: string;
    validation: {
        required: boolean;
    };
}

export function formatProfileRequirements(input: Record<string, "mandatory" | "optional" | "off">): ProfileRequirementFormatted[] {
    return Object.entries(input)
        .filter(([_, value]) => value !== "off") 
        .map(([key, value]) => ({
            key: key.replace(/-/g, "_"),
            validation: {
                required: value === "mandatory"
            }
        }));
}
