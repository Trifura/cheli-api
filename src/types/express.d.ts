declare namespace Express {
	interface Request {
		// add arbitrary keys to the request
		[key: string]: never
	}
	interface Body {
		// add arbitrary keys to the request body
		[key: string]: never
	}
}
