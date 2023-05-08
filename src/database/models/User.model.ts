import { formatDate, ICustomDate } from '../../utils/customDate.util'
import { Challenge } from './Challenge.interface'

export interface IUser {
	id: number
	uuid: string
	fullName: string
	email: string
	password: string
	created_at: Date
	updated_at: Date
}

export interface UserResponse {
	uuid: string
	initials: string
	username: string
	fullName: string
	email: string
	created_at: ICustomDate
	updated_at: ICustomDate

	// Relations
	followedBy: any[] // TODO: define these types
	following: any[]
	challenges: Challenge[]
}

export const UserRelations = {
	following: {
		include: { following: true },
	},
	followedBy: {
		include: { follower: true },
	},
	UserChallenges: { include: { challenge: true } },
}

export class User {
	public static cleanMany(users): UserResponse[] | [] {
		if (!users || !users.length) {
			return []
		}

		const cleanedUsers = users.map((user) => {
			return this.clean(user)
		})

		return cleanedUsers
	}
	public static clean(user): UserResponse | null {
		if (!user) {
			return null
		}
		const initials = this.getInitials(user.fullName)
		const challenges = this.cleanChallenges(user)

		return {
			uuid: user.uuid,
			initials,
			username: user.username,
			fullName: user.fullName,
			email: user.email,
			created_at: formatDate(user.createdAt),
			updated_at: formatDate(user.updatedAt),
			followedBy: user.followedBy,
			following: user.following,
			challenges,
		}
	}

	private static getInitials(fullName: string): string {
		const nameParts = fullName.trim().split(/\s+/)

		if (nameParts.length <= 0 || !nameParts[0]) {
			return ''
		}

		if (nameParts.length === 1) {
			// If there's only one word, return the first 2 characters.
			return nameParts[0]?.substring(0, 2).toUpperCase()
		}

		// If there are multiple words, return the first character of the first word
		// and the first character of the last word.
		const firstInitial = nameParts[0].charAt(0)
		const lastInitial = nameParts[nameParts.length - 1]?.charAt(0)

		return (firstInitial + lastInitial).toUpperCase()
	}

	private static cleanChallenges(user) {
		return user.UserChallenges.map((userChallenge) => {
			return {
				...userChallenge.challenge,
				finished: userChallenge.finished,
				uuid: userChallenge.uuid,
				id: undefined,
				createdAt: userChallenge.createdAt,
				updatedAt: undefined,
			}
		})
	}
}
