var path = require('path');
var dbConfig = require('../dbcon.js');
var sessionManager = require( path.resolve( __dirname, "./sessionManager.js" ));
var partyDb = require( path.resolve( __dirname, "./politicalPartyDb.js" ));

module.exports = {
	register : registerUser,
	userLogin : userLoginFunction,
	getUserProfile : getUserProfileFunction,
	updateUserInfo : updateUserInfo
}

function registerUser (req, res, errorHandler) {
	var params = [];
	params.push(req.body.username);
	params.push(req.body.email);
	params.push(req.body.password);
	params.push(req.body.zipcode);
	params.push(req.body.political_party_id);
	params.push(req.body.reminder === 'on' ? 1 : 0);
	params.push(req.body.newsletter === 'on' ? 1 : 0);

	var registerSql = "INSERT INTO useraccount (`username`, `email`, `password`, `zipcode`, `political_party_id`, `reminder`, `newsletter`) VALUES (?, ?, ?, ?, ?, ?, ?)";

	dbConfig.pool.query(registerSql, params, function(err, rows, fields) {
		if (err) {
			errorHandler(err);
			req.status = 500;
			return;
		}
		res.redirect("/login");
	});
}

function updateUserInfo(req, res, errorHandler, successCallback) {
	var params = [];
	params.push(req.body.email);
	params.push(req.body.password);
	params.push(req.body.zipcode);
	params.push(req.body.political_party_id);
	params.push(req.body.reminder === 'on' ? 1 : 0);
	params.push(req.body.newsletter === 'on' ? 1 : 0);
	params.push(req.body.username);

	var updateSql = "UPDATE useraccount SET `email` = ?, `password` = ?, `zipcode` = ?, `political_party_id` = ?, `reminder` = ?, `newsletter` = ? WHERE `username`= ?;";

	dbConfig.pool.query(updateSql, params, function(err, rows, fields) {
		if (err) {
			errorHandler(err);
			req.status = 500;
			return;
		}

		successCallback(req, res, rows);
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
		    var user = {
		    	"username": rows[0].username,
		    	"email": rows[0].email,
		    	"password": '',
		    	"zipcode": rows[0].zipcode,
		    	"party": rows[0].party,
		    	"political_party_id": rows[0].political_party_id,
		    	"reminder": rows[0].reminder,
		    	"newsletter": rows[0].newsletter
		    };
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

function getUserProfileFunction (req, res, errorHandler, successCallback) {
	var params = [];
	params.push(req.session.name);
	dbConfig.pool.query(getUserProfileSQL, params, function(err, rows, fields) {
		if (err) {
			req.status = 500;
			errorHandler(err);
			return;
		}
		successCallback(req, res, rows);
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

var userLoginSql = "SELECT `username`, `email`, `zipcode`, u.political_party_id, p.name AS party, `reminder`, `newsletter` FROM useraccount u JOIN politicalParties p ON u.political_party_id = p.political_party_id WHERE username = ? AND password = ?";
var getUserProfileSQL = "SELECT `username`, `email`, `zipcode`, u.political_party_id, p.name AS party, `reminder`, `newsletter` FROM useraccount u JOIN politicalParties p ON u.political_party_id = p.political_party_id WHERE username = ?";











