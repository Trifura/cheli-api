import { formatDate, ICustomDate } from '../../utils/customDate.util'
import { Challenge } from './Challenge.model'
import { User, UserResponse } from './User.model'

export interface IUserChallenge {
	uuid: any
	finished: boolean
	created_at: ICustomDate
	updated_at: ICustomDate

	// Relations
	user: UserResponse | undefined
	challenge: Challenge | undefined
}

export const UserChallengeRelations = {
	user: true,
	challenge: true,
}

export class UserChallenge {
	public static cleanMany(userChallenges): UserResponse[] | [] {
		if (!userChallenges || !userChallenges.length) {
			return []
		}

		const cleanedUserChallenges = userChallenges.map((userChallenge) => {
			return this.clean(userChallenge)
		})

		return cleanedUserChallenges
	}
	public static clean(userChallenge): IUserChallenge | undefined {
		if (!userChallenge) {
			return undefined
		}

		const challenge = userChallenge.challenge
			? Challenge.clean(userChallenge.challenge)
			: undefined

		const user = userChallenge.user
			? User.clean(userChallenge.user)
			: undefined

		return {
			uuid: userChallenge.uuid,
			finished: userChallenge.finished,
			created_at: formatDate(userChallenge.createdAt),
			updated_at: formatDate(userChallenge.updatedAt),
			challenge,
			user,
		}
	}
}
