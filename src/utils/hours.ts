function parseTime(timeStr: string): number {
  // Parse "h:mm a" format (e.g., "12:00 pm")
  const [time, period] = timeStr.toLowerCase().split(/\s+/)
  const [hours, minutes] = time.split(":").map(Number)
  let hour24 = hours
  if (period === "م" && hours !== 12) {
    hour24 = hours + 12
  } else if (period === "ص" && hours === 12) {
    hour24 = 0
  }
  return hour24 * 60 + minutes // Convert to minutes since midnight
}

export function getCurrentStatus(hours: BusinessHours): string {
  const now = new Date()
  const currentDay = now.getDay() // 0 = Sunday, 6 = Saturday
  const currentMinutes = now.getHours() * 60 + now.getMinutes()

  // First, check if we're still within previous day's closing time (if it closes past midnight)
  // This handles cases like: Saturday closes at 3:00 am, and it's currently 2:00 am on Sunday
  const previousDay = (currentDay - 1 + 7) % 7
  const previousDaySchedule = hours.schedule.find(
    s => s.dayOfWeek === previousDay
  )

  if (previousDaySchedule) {
    const prevOpenMinutes = parseTime(previousDaySchedule.open)
    const prevCloseMinutes = parseTime(previousDaySchedule.close)

    // If previous day closes past midnight (close < open), check if we're still within that window
    if (prevCloseMinutes < prevOpenMinutes) {
      // Previous day closes the next day (e.g., closes at 3:00 am)
      if (currentMinutes < prevCloseMinutes) {
        // We're still within previous day's closing time
        return `مفتوح حتى ${previousDaySchedule.close}`
      }
    }
  }

  // Find today's schedule
  const todaySchedule = hours.schedule.find(s => s.dayOfWeek === currentDay)

  if (!todaySchedule) {
    // Find next day with schedule
    for (let i = 1; i <= 7; i++) {
      const nextDay = (currentDay + i) % 7
      const nextSchedule = hours.schedule.find(s => s.dayOfWeek === nextDay)
      if (nextSchedule) {
        return `يفتح ${nextSchedule.open}`
      }
    }
    return "مغلق"
  }

  const openMinutes = parseTime(todaySchedule.open)
  const closeMinutes = parseTime(todaySchedule.close)

  // Handle case where close time is next day (e.g., closes at 3:00 am)
  // If close < open, it means closing time is the next day
  const isOpen =
    closeMinutes > openMinutes
      ? currentMinutes >= openMinutes && currentMinutes < closeMinutes
      : currentMinutes >= openMinutes || currentMinutes < closeMinutes

  if (isOpen) {
    return `مفتوح حتى ${todaySchedule.close}`
  }

  // Check if we should show today's open time or next day's
  if (currentMinutes < openMinutes) {
    // Opens later today
    return `يفتح ${todaySchedule.open}`
  } else {
    // Find next day with schedule
    for (let i = 1; i <= 7; i++) {
      const nextDay = (currentDay + i) % 7
      const nextSchedule = hours.schedule.find(s => s.dayOfWeek === nextDay)
      if (nextSchedule) {
        return `يفتح ${nextSchedule.open}`
      }
    }
    return "مغلق"
  }
}

export function formatScheduleHours(schedule: {
  open: string
  close: string
}): string {
  return `${schedule.open} - ${schedule.close}`
}
