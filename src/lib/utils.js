/**
 * Robustly parses image data from the database.
 * Handles:
 * - Valid JSON arrays: '["/img1.jpg", "/img2.jpg"]'
 * - Malformed bracketed strings: '[/img1.jpg, /img2.jpg]'
 * - Single unquoted strings: '/img1.jpg'
 * - Already parsed arrays
 * - Null/Undefined/Empty values
 */
export const getImagesArray = (images) => {
    if (!images) return [];
    if (Array.isArray(images)) return images;
    if (typeof images !== 'string') return [];

    const trimmed = images.trim();
    if (!trimmed) return [];

    try {
        // Try standard JSON parse first
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) return parsed;
        if (typeof parsed === 'string') return [parsed];
        return [];
    } catch (e) {
        // Fallback for malformed strings like "[/products/paving.jpg]" or "[img1, img2]"
        if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
            const inner = trimmed.slice(1, -1).trim();
            if (!inner) return [];
            return inner.split(',').map(img => img.trim().replace(/^["']|["']$/g, ''));
        }
        // If it's just a plain string that's not JSON, return it as a single-item array
        return [trimmed];
    }
};
