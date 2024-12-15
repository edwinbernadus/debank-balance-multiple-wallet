export function convertData(input) {
    // $8,632\n-0.90%
    // convert to 8632
    let result = input.replace("$", "").replace(",", "").split("\n")[0]
    return parseInt(result)
}