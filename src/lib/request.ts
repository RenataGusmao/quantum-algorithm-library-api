export function isObjectId(value: string) {
  return /^[a-f\d]{24}$/i.test(value);
}

export function toStringArray(value: unknown) {
  return Array.isArray(value) ? value.filter((item) => typeof item === "string") : [];
}
