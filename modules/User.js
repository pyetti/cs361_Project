
module.exports = {
	User: User
}

function User (username, email, password, zipcode, party, reminder, newsletter) {
	this.username = username;
	this.email = email;
	this.password = password;
	this.zipcode = zipcode;
	this.party = party;
	this.reminder = reminder;
	this.newsletter = newsletter;
}