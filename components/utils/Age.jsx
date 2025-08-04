import {
  formatDuration,
  intervalToDuration,
  parse,
  parseISO,
  isValid,
} from "date-fns";

export const age = (item) => {
  let sheepAge;
  const today = new Date();
  if (item.dob) {
    const parsedDob = parse(item.dob, "MM/dd/yyyy", new Date());
    if (isValid(parsedDob) && !item.dod) {
      let units = ["years", "months"];
      if (parsedDob < today) {
        let duration = intervalToDuration({ start: parsedDob, end: today });
        if (
          duration.years === 0 &&
          duration.months === 0 &&
          duration.days === 0
        ) {
          return "0 days";
        }
        if (duration.months === 0 && duration.years === 0) {
          units.push("weeks");
          if (!duration.weeks) {
            duration.weeks = (duration.days / 7) | 0;
            duration.days = duration.days - duration.weeks * 7;
          }
          if (duration.weeks === 0) {
            units.push("days");
          }
        }
        return formatDuration(duration, { format: units, delimiter: ", " });
      } else {
        sheepAge = "Invalid Date";
      }
    } else {
      sheepAge = "NA";
    }
  } else {
    sheepAge = "No birthdate provided";
  }
  return sheepAge;
};
