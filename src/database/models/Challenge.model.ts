import { formatDate, ICustomDate } from '../../utils/customDate.util'

export interface Challenge {
	id?: number
	uuid: string
	title: string
	description: string
	image?: string
	icon?: string
	color?: string
	sponsor?: string
	date_to_launch?: Date
	created_at?: ICustomDate
	updated_at?: ICustomDate
}

export class Challenge {
	public static cleanMany(challenges): Challenge[] | [] {
		if (!challenges || !challenges.length) {
			return []
		}

		const cleanedChallenges = challenges.map((challenge) => {
			return this.clean(challenge)
		})

		return cleanedChallenges
	}
	public static clean(challenge): Challenge | undefined {
		if (!challenge) {
			return undefined
		}

		return {
			uuid: challenge.uuid || '',
			title: challenge.title || '',
			description: challenge.description || '',
			image: challenge.image || '',
			icon: challenge.icon || '',
			color: challenge.color || '',
			sponsor: challenge.sponsor || '',
			date_to_launch: challenge.date_to_launch,
			created_at: formatDate(challenge.createdAt),
			updated_at: formatDate(challenge.createdAt),
		}
	}
}
