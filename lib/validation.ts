export function validatePassword(pw: string) {
  const missing: string[] = [];
  if (pw.length < 10) missing.push("at least 10 characters");
  if (!/[a-z]/.test(pw) || !/[A-Z]/.test(pw)) missing.push("both upper and lower case letters");
  if (!/\d/.test(pw)) missing.push("at least one number");
  return missing;
}
