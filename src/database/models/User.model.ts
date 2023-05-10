import { formatDate, ICustomDate } from '../../utils/customDate.util'
import { UserChallenge } from './UserChallenge.model'

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
	followingCount: number
	followedByCount: number
	challenges: UserChallenge[]
	challengesCount: number
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
	public static clean(user): UserResponse | undefined {
		if (!user) {
			return undefined
		}

		const initials = this.getInitials(user.fullName)
		const challenges = UserChallenge.cleanMany(user.UserChallenges)

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
			followingCount: user.following?.length,
			followedByCount: user.followedBy?.length,
			challenges,
			challengesCount: user.challenges?.length,
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
}
