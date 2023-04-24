export interface User {
	id?: number
	uuid: string
	fullName: string
	email: string
	password?: string
	created_at?: Date
	updated_at?: Date
}
