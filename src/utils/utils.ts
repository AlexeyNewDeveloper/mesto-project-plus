export const getPureMessageFromError = (string: string = ""): string => {
  if (string.includes("$")) {
    return string.split("$")[1];
  }
  return "";
};
