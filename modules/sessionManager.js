module.exports = {
	setUserSessionName: setUserSessionNameFunction,
	sessionExists: sessionExistsFunction,
	killUserSession: killUserSessionFunction
}

function setUserSessionNameFunction(req) {
	req.session.name = req.body.username;
}

function sessionExistsFunction (req) {
	return req.session.name != null;
}

function killUserSessionFunction (req) {
	req.session.name = null;
}