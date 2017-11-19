var dbConfig = require('../dbcon.js');

module.exports = {
	register : registerUser // these are the function exposed to other parts of the program. It's like the header in C/C++
}

function registerUser (req, res, errorHandler) {
	var context = {};
	var params = []; // here you will get whatever params were passed in the body of the form
	context = req.body;
	for (var param in context) {
        params.push(context[param]);
    }
	console.log(req.body);
	//var param = [req.body.username, req.body.]
	
	var insertSQl = "INSERT INTO useraccount (username, email, password, password2, zipcode, party) values (?, ?, ?, ?, ?, ?)";
	
	dbConfig.pool.query(insertSQl, params, function(err, rows, fields) {
		if (err) {
			errorHandler(err);
			return;
		}
		context.message = "Success";
		res.redirect("/login");
	});
}

