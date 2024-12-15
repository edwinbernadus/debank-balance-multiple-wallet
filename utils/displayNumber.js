export function displayNumber(input) {
    // convert from 8632 to 8,632
    return input.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}