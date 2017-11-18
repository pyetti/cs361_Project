var db = require('../dbcon.js');

module.exports = {
	register : registerUser // these are the function exposed to other parts of the program. It's like the header in C/C++
}

function registerUser (req, res, errorHandler) {
	var context = {};
	var params = {}; // here you will get whatever params were passed in the body of the form
	for (var param in req.body) {
        params.push(req.body[param]);
    }
	dbConfig.pool.query(insertSQl, params, function(err, rows, fields) {
		if (err) {
			errorHandler(err);
			return;
		}
		context.message = "Success";
		res.redirect("/login");
	});
}

var insertSQl = "INSERT INTO users (username, email, password, zipcode, party) values (?, ?, ?, ?, ?)";