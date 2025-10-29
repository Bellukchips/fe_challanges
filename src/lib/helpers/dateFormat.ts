export function formateDateID(date: string | Date) {
    const d = new Date(date);
    return d.toLocaleString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",

    });
}
