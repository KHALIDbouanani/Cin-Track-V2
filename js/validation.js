export function isRequired(value) {
    return String(value).trim() !== "";
}

export function isValidYear(year) {
    const y = Number(year);
    const current = new Date().getFullYear();
    return y >= 1900 && y <= current;
}

export function isValidImageUrl(url) {
    return url.startsWith("http://") || url.startsWith("https://");
}

export function parseCommaList(text) {
    return text.split(",").map(s => s.trim()).filter(s => s !== "");
}