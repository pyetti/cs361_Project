var path = require('path');
var dbConfig = require('../dbcon.js');
var sessionManager = require( path.resolve( __dirname, "./sessionManager.js" ) );

module.exports = {
	register : registerUser,
	userLogin : userLoginFunction
}

function registerUser (req, res, errorHandler) {
	var context = {};
	var params = [];
	context = req.body;
	for (var param in context) {
        params.push(context[param]);
    }
	console.log(req.body);

	var insertSQl = 'INSERT INTO useraccount (`username`, `email`,`password`, `password2`, `zipcode`, `party`, `reminder`, `newsletter`) VALUES (?,?,?,?,?,?,1,1)';

	dbConfig.pool.query('INSERT INTO useraccount (`username`, `email`,`password`, `password2`, `zipcode`, `party`, `reminder`, `newsletter`) VALUES (?,?,?,?,?,?,1,1)', params, function(err, rows, fields) {
		if (err) {
			errorHandler(err);
			return;
		}
		context.message = "Success";
		res.redirect("/login");
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

		if (rows[0].User) {
		    req.status = 200;
		    sessionManager.setUserSessionName(req);
		    res.redirect('/');
		  } else {
		  	var context = {};
		    context.loginFailed = "User not found.";
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

var userLoginSql = "SELECT count(username) as 'User' FROM useraccount WHERE username = ? AND password = ?";