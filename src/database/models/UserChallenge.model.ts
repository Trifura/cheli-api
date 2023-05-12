import {
	formatDate,
	ICustomDate,
	formatTimeLeft,
} from '../../utils/customDate.util'
import { Challenge } from './Challenge.model'
import { User, UserResponse } from './User.model'

export interface IUserChallenge {
	uuid: any
	finished: boolean
	created_at: ICustomDate
	updated_at: ICustomDate
	time_left: string

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

		const oneDay = 24 * 60 * 60 * 1000
		const createdAt = new Date(userChallenge.createdAt).getTime()
		const currentTime = new Date().getTime()

		const timePassed = currentTime - createdAt
		const timeLeft = formatTimeLeft(oneDay - timePassed)

		return {
			uuid: userChallenge.uuid,
			finished: userChallenge.finished,
			created_at: formatDate(userChallenge.createdAt),
			updated_at: formatDate(userChallenge.updatedAt),
			time_left: timeLeft,
			challenge,
			user,
		}
	}
}
