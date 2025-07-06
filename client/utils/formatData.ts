import { format, isValid, parseISO } from "date-fns";

export const formatData = (
  dateString: string,
  formatStr: string = "MMM d, yyyy h:mm a"
) => {
  try {
    const date = parseISO(dateString);
    if (isValid(date)) {
      return format(date, formatStr);
    }
    return "Invalid Date";
  } catch (error) {
    console.error("Error parsing date:", error);
    return "Invalid Date";
  }
};
