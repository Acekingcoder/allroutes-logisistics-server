// HELPER FUNCTIONS FILE TO HANDLE BASIC UTILITIES

/** User password validator */
export function passwordCheck(password: string) {
    if (!/[a-z]/.test(password)) {
        return { error: "Password must contain at least one lowercase letter" };
    }
    if (!/[0-9]/.test(password)) {
        return { error: "Password must contain at least one number" };
    }
    // Check for consecutive numbers or letters
    if (/(\d)\1{2,}/.test(password) || /([a-zA-Z])\1{2,}/.test(password)) {
        return { error: "Password must not contain consecutive numbers or letters" };
    }
    // Check for consecutive sequences of numbers
    if (/(012|123|234|345|456|567|678|789|890)/.test(password)) {
        return { error: "Password must not contain consecutive sequences of numbers" };
    }
    // Check for consecutive sequences of characters
    if (/(abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)/.test(password.toLowerCase())) {
        return { error: "Password must not contain consecutive sequences of characters" };
    }
    return { valid: true };
}