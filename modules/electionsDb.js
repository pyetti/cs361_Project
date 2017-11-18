var dbConfig = require('../dbcon.js');

module.exports = {
	getElectionInfo: getElectionInfo
}

function getElectionInfo (req, res, errorHandler) {
	var context = {};
	var params = req.query.zipcode;
	dbConfig.pool.query(getElectionInfoSql, params, function (err, rows, fields) {
		if (err) {
			errorHandler(err);
			return;
		} else {
			context.electionInfo = rows;
			dbConfig.pool.query(getPropositionInfor, params, function (err, rows, fields) {
				if (err) {
					errorHandler(err);
					return;
				} else {
					context.propositionInfo = rows;
					res.status(200);
					res.render('elections', context);
				}
			});
		}
	});
}

var getElectionInfoSql = "SELECT e.election_id, e.title, DATE_FORMAT(e.election_date, '%m-%d-%Y') as 'election_date', l.city, l.state, l.zipcode FROM elections e JOIN locations l ON e.location_id = l.location_id WHERE l.zipcode = ? ORDER BY e.election_id;";
var getCandidateInfo = "SELECT e.election_id, c.first_name, c.last_name, p.name as 'Party' FROM candidates c JOIN elections e ON c.election_id = e.election_id JOIN locations l ON e.location_id = l.location_id JOIN politicalParties p ON p.politcal_party_id = c.politcal_party_id WHERE l.zipcode = ? ORDER BY e.election_id;";
var getPropositionInfor = "SELECT p.proposition_id, p.title, p.description, DATE_FORMAT(p.date_of_vote, '%m-%d-%Y') as 'date' FROM propositions p JOIN locations l ON p.location_id = l.location_id WHERE l.zipcode = ? ORDER BY p.proposition_id;";
