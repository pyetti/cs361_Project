var path = require('path');
var dbConfig = require('../dbcon.js');
var sessionManager = require( path.resolve( __dirname, "./sessionManager.js" ) );

module.exports = {
	register : registerUser,
	userLogin : userLoginFunction,
	updateUser : updateUserInfo
}

function registerUser (req, res, errorHandler) {
	var params = getParamsFromBody(req.body);

	var registerSql = "INSERT INTO users (`username`, `email`, `password`, `zipcode`, `party`, `reminders`, `newsletter`) VALUES (?, ?, ?, ?, ?, 1, 1)"; //Fix for reminders/newletter

	dbConfig.pool.query(registerSql, params, function(err, rows, fields) {
		if (err) {
			errorHandler(err);
			req.status = 500;
			return;
		}
		else {
		var context = {};
		context.successful = "Success";
		res.redirect("/login");
		}
	});
}

function updateUserInfo(req, res, errorHandler) {
	var params = getParamsFromBody(req.body);

	var updateSql = "UPDATE users SET `username` = ?, `email` = ?, `password` = ?, `zipcode` = ?, `party` = ?, `reminders` = 1, `newsletter` = 0 WHERE `id`= 1"; //FIX FOR ID - ADD TO SESSION?

	dbConfig.pool.query(updateSql, params, function(err, rows, fields) {
		if (err) {
			errorHandler(err);
			req.status = 500;
			return;
		}
		else {
		res.redirect("/profile");
		}
	})

}

function userLoginFunction (req, res, errorHandler) {
	var params = getParamsFromBody(req.body);

	dbConfig.pool.query(userLoginSql, params, function(err, rows, fields) {
		if (err) {
			errorHandler(err);
			req.status = 500;
			return;
		}

		if (rows[0].User) {
		    req.status = 200;
		    sessionManager.setUserSessionName(req);
		    res.redirect('/');
		  } else {
		  	var context = {};
		    context.loginFailed = "User not found or username and password do not match.";
		    req.status = 200;
		    res.render('login', context);
		  }
	});
}

function getParamsFromBody (reqBody) {
	var tempParams = reqBody;
	var params = [];
	for (var param in tempParams) {
        params.push(tempParams[param]);
    }
    return params;
}

var userLoginSql = "SELECT count(username) as 'User' FROM users WHERE username = ? AND password = ?";
