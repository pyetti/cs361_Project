var path = require('path');
var dbConfig = require('../dbcon.js');
var sessionManager = require( path.resolve( __dirname, "./sessionManager.js" ) );

module.exports = {
	getElectionInfo: getElectionInfoFunction,
	getElectionDetails: getElectionDetailsFunction,
	getPropositionDetails: getPropositionDetailsFunction
}

function getElectionInfoFunction (req, res, errorHandler) {
	var params = req.query.zipcode;
	dbConfig.pool.query(getElectionInfoSql, params, function (err, rows, fields) {
		if (err) {
			errorHandler(err);
			return;
		} else {
			var context = {};
			context.electionInfo = rows;
			dbConfig.pool.query(getPropositionInfoSql, params, function (err, rows, fields) {
				if (err) {
					res.status(500);
					errorHandler(err);
					return;
				} else {
					if (sessionManager.sessionExists(req)) {
					  context.sessionExists = true;
					}
					context.propositionInfo = rows;
					context.pageTitle = "Search Results";
					res.status(200);
					res.render('elections', context);
				}
			});
		}
	});
}

function getElectionDetailsFunction (req, res, errorHandler) {
	var params = req.query.electionId;
	dbConfig.pool.query(getElectionDetailSql, params, function (err, rows, fields) {
		if (err) {
			errorHandler(err);
			return;
		} else {
			var context = {};
			context.electionDetail = rows;
			dbConfig.pool.query(getCandidatesByElectionSql, params, function (err, rows, fields) {
				if (err) {
					res.status(500);
					errorHandler(err);
					return;
				} else {
					if (sessionManager.sessionExists(req)) {
					  context.sessionExists = true;
					}
					context.candidates = rows;
					context.pageTitle = "Search Results";
					res.status(200);
					res.render('electionDetail', context);
				}
			});
		}
	});
}

function getPropositionDetailsFunction (req, res, errorHandler) {
	var params = req.query.propositionId;
	dbConfig.pool.query(getPropositionDetailsSql, params, function (err, rows, fields) {
		if (err) {
			res.status(500);
			errorHandler(err);
			return;
		} else {
			var context = {};
			if (sessionManager.sessionExists(req)) {
			  context.sessionExists = true;
			}
			context.propositionDetails = rows;
			context.candidates = rows;
			context.pageTitle = "Search Results";
			res.status(200);
			res.render('propositionDetails', context);
		}
	});
}

var getElectionInfoSql = "SELECT e.election_id, e.title, DATE_FORMAT(e.election_date, '%m/%d/%Y') as 'election_date', l.city, l.state, l.zipcode FROM elections e JOIN locations l ON e.location_id = l.location_id WHERE l.zipcode = ? ORDER BY e.election_date ASC;";
var getPropositionInfoSql = "SELECT p.proposition_id, p.title, p.description, DATE_FORMAT(p.date_of_vote, '%m/%d/%Y') as 'date' FROM propositions p JOIN locations l ON p.location_id = l.location_id WHERE l.zipcode = ? ORDER BY p.date_of_vote ASC;";

var getElectionDetailSql = "SELECT e.election_id, e.title, DATE_FORMAT(e.election_date, '%m/%d/%Y') as 'election_date', l.city, l.state, l.zipcode FROM elections e JOIN locations l ON e.location_id = l.location_id WHERE e.election_id = ? ORDER BY e.election_id;";
var getCandidatesByElectionSql = "SELECT e.election_id, c.first_name, c.last_name, p.name as 'party' FROM candidates c JOIN elections e ON c.election_id = e.election_id JOIN locations l ON e.location_id = l.location_id JOIN politicalParties p ON p.political_party_id = c.politcal_party_id WHERE e.election_id = ? ORDER BY c.last_name ASC;";
var getPropositionDetailsSql = "SELECT p.proposition_id, p.title, p.description, DATE_FORMAT(p.date_of_vote, '%m/%d/%Y') as 'date', l.zipcode FROM propositions p JOIN locations l ON p.location_id = l.location_id WHERE p.proposition_id = ?;";
