type DaySchedule = {
	day: string // Arabic day name for display
	dayOfWeek: number // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
	open: string // "h:mm a" format (e.g., "12:00 pm")
	close: string // "h:mm a" format (e.g., "11:00 pm")
}

type BusinessHours = {
	schedule: DaySchedule[]
}

type BusinessInfo = {
	phone?: string
	instagram?: string
	twitter?: string
	whatsapp?: string
	googleMaps?: string
	hungerStation?: string
	hours: BusinessHours
}
