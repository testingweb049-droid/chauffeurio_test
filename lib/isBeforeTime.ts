/**
 * Gets the current date in New Jersey (Eastern Time Zone)
 * @returns Date object representing the current date in New Jersey
 */
export function getNewJerseyDate(): Date {
  return new Date(
    new Date().toLocaleString("en-US", {
      timeZone: "America/New_York",
    }),
  )
}




/**
 * Compares if a date is before the current date in New Jersey
 * @param date The date to compare
 * @returns boolean - true if the date is before today in New Jersey time
 */
export function isBeforeNewJerseyToday(date: Date): boolean {
  const newJerseyDate = getNewJerseyDate()

  // Reset the time part to compare dates only
  newJerseyDate.setHours(0, 0, 0, 0)
  const compareDate = new Date(date)
  compareDate.setHours(0, 0, 0, 0)

  return compareDate < newJerseyDate
}



/**
 * Gets the current hour (0-23) in New Jersey (Eastern Time Zone)
 * @returns number - the hour in New Jersey time
 */
export function getNewJerseyHour(): number {
  const date = new Date().toLocaleString("en-US", {
    timeZone: "America/New_York",
  })
  return new Date(date).getHours()
}

