export interface ICustomDate {
	timestamp: number
	human: string
}

export function formatDate(date: Date): ICustomDate {
	const timestamp = new Date(date).getTime()

	return {
		timestamp,
		human: timeSince(timestamp),
	}
}

function timeSince(timestamp: number): string {
	const secondsPast = (Date.now() - timestamp) / 1000

	if (secondsPast < 60) {
		return `${Math.round(secondsPast)} seconds ago`
	}
	if (secondsPast < 3600) {
		return `${Math.round(secondsPast / 60)} minutes ago`
	}
	if (secondsPast <= 86400) {
		return `${Math.round(secondsPast / 3600)} hours ago`
	}
	if (secondsPast <= 2592000) {
		return `${Math.round(secondsPast / 86400)} days ago`
	}
	if (secondsPast <= 31536000) {
		return `${Math.round(secondsPast / 2592000)} months ago`
	}
	return `${Math.round(secondsPast / 31536000)} years ago`
}

export function formatTimeLeft(timestamp): string {
	const secondsPast = timestamp / 1000

	if (secondsPast < 0) {
		return 'Time passed'
	}
	if (secondsPast < 60) {
		return `${Math.round(secondsPast)} seconds left`
	}
	if (secondsPast < 3600) {
		return `${Math.round(secondsPast / 60)} minutes left`
	}
	if (secondsPast <= 86400) {
		return `${Math.round(secondsPast / 3600)} hours left`
	}

	return 'Time passed'
}
