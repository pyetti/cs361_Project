var path = require('path');
var dbConfig = require('../dbcon.js');
var sessionManager = require( path.resolve( __dirname, "./sessionManager.js" ));
var userObject = require( path.resolve( __dirname, "./User.js" ));

module.exports = {
	register : registerUser,
	userLogin : userLoginFunction,
	getUserProfile : getUserProfileFunction,
	updateUser : updateUserInfo
}

function registerUser (req, res, errorHandler) {
	var params = getParamsFromBody(req.body);

	var registerSql = "INSERT INTO useraccount (`username`, `email`, `password`, `zipcode`, `party`, `reminder`, `newsletter`) VALUES (?, ?, ?, ?, ?, 1, 1)"; //Fix for reminders/newletter

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

	var updateSql = "UPDATE useraccount SET `username` = ?, `email` = ?, `password` = ?, `zipcode` = ?, `party` = ?, `reminders` = 1, `newsletter` = 0 WHERE `id`= 1"; //FIX FOR ID - ADD TO SESSION?

	dbConfig.pool.query(updateSql, params, function(err, rows, fields) {
		if (err) {
			errorHandler(err);
			req.status = 500;
			return;
		}
		else {
		res.redirect("/profile");
		}
	});
}

function userLoginFunction (req, res, errorHandler) {
	var params = getParamsFromBody(req.body);

	dbConfig.pool.query(userLoginSql, params, function(err, rows, fields) {
		if (err) {
			errorHandler(err);
			req.status = 500;
			return;
		}

		if (rows[0] && rows[0].username) {
		    req.status = 200;
		    sessionManager.setUserSessionName(req);
		    var user = new userObject.User(rows[0].username, rows[0].email, '',
		    	rows[0].zipcode, rows[0].party, rows[0].reminder, rows[0].newsletter);
		    sessionManager.put(req, "user", user);
		    res.redirect('/');
		  } else {
		  	var context = {};
		    context.loginFailed = "User not found or username and password do not match.";
		    req.status = 200;
		    res.render('login', context);
		  }
	});
}

function getUserProfileFunction (req, res, errorHandler) {
	var params = {};
	params.push(req.session.name);
	dbConfig.pool.query(getUserProfileSQL, params, function(err, rows, fields) {
		if (err) {
			errorHandler(err);
			req.status = 500;
			return;
		}
		var context = {};
		if (rows[0].username) {

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

var userLoginSql = "SELECT `username`, `email`, `zipcode`, `party`, `reminder`, `newsletter` FROM useraccount WHERE username = ? AND password = ?";
var getUserProfileSQL = "SELECT `username`, `email`, `password`, `zipcode`, `party`, `reminder`, `newsletter` FROM useraccount WHERE useraccount = ?;";











