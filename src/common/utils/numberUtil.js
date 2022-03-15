export function round(value = 0, decimals = 0) {
    return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
}

export function isNumeric(num) {
    return !isNaN(num);
}