var db = require('./dbcon.js');

module.exports = {
	register : registerUser // these are the function exposed to other parts of the program. It's like the header in C/C++
}

function registerUser (req, res, errorHandler) {
	var context = {};
	var params = getParameters(req.body); // here you will get whatever params were passed in the body of the form
	dbConfig.pool.query(insertSQl, params, function(err, rows, fields) {
		if (err) {
			errorHandler(err);
			return;
		}
		context.message = "Success";
		res.send(context);
	});
}

var insertSQl = "YOUR SQL TO ENTER A NEW USER INTO THE DATABASE";