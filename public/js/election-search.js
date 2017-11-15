document.addEventListener('DOMContentLoaded', function(event) {
	electionSearch();
});

function electionSearch () {
	document.getElementById('submit-election-search').addEventListener('click', function(event) {
		event.preventDefault();
		document.getElementById('electionInfo').innerText = "";
		document.getElementById('invalid-zipCode-message').innerText = "";

		var zipcode = document.getElementById('zipcode').value;

		if (!zipcode || zipcode.length != 5 || isNaN(zipcode)) {
			displayError('invalid-zipCode-message', "Invalid Zip Code");
			return;
		}

		var request = new XMLHttpRequest();
		request.open("GET", "/getElectionInfo?zipcode=" + zipcode);

		request.addEventListener('load', function(event) {
			var response = JSON.parse(request.responseText);

			if (request.status >= 200 && request.status < 400) {
				document.getElementById('electionInfo').innerText = response.electionInfo;
			} else {
				displayError('invalid-zipCode-message', response.invalidZipCode);
			}
		});
		request.send(null);
	});
}
