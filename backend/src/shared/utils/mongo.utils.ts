export const EqualsCaseInsensitive = (value: string) => new RegExp(["^", value, "$"].join(""), "i")
