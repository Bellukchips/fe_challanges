export function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
}

export function slugToTitle(slug: string): string {
    return slug
        .split('_')[0]
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}


export function generateRoute(path: string, params: Record<string, string>) {
    let result = path;
    for (const key in params) {
        result = result.replace(`:${key}`, params[key]);
    }
    return result;
}
