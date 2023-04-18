function register(req, res) {
	res.json({ route: 'register' })
}

function login(req, res) {
	res.json({ route: 'login' })
}

export default { register, login }
