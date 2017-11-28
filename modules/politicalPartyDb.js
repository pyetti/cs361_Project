var path = require('path');
var dbConfig = require('../dbcon.js');

module.exports = {
	getAllParties : getAllPartiesFunction
}

function getAllPartiesFunction(req, res, errorHandler, successCallback) {
	params = {};
	dbConfig.pool.query(getAllPartiesSql, params, function (err, rows, fields) {
		if (err) {
			errorHandler(err);
			return;
		}
		successCallback(req, res, rows);
	});
}

var getAllPartiesSql = "SELECT political_party_id, name FROM politicalParties;";
