module.exports = {
	setUserSessionName: setUserSessionNameFunction,
	sessionExists: sessionExistsFunction,
	killUserSession: killUserSessionFunction,
	put: put,
	get: get
}

function setUserSessionNameFunction(req) {
	req.session.name = req.body.username;
}

function sessionExistsFunction (req) {
	return req.session.name != null;
}

function killUserSessionFunction (req) {
	req.session.destroy();
}

function put (req, key, value) {
	req.session.key = value;
}

function get (req, key) {
	return req.session.key;
}
