document.addEventListener('DOMContentLoaded', function(event) {
	electionSearch();
});

function electionSearch () {
	document.getElementById('submit-election-search').addEventListener('click', function(event) {
		event.preventDefault();
		document.getElementById('zipcode-entered').textContent = "";
		document.getElementById('electionInfo').textContent = "";

		var zipcode = document.getElementById('zipcode').value;

		if (!zipcode || zipcode.length != 5 || isNaN(zipcode)) {
			displayError("Invalid Zip Code");
			return;
		}

		var request = new XMLHttpRequest();
		request.open("GET", "/getElectionInfo?zipcode=" + zipcode);

		request.addEventListener('load', function(event) {
			var response = JSON.parse(request.responseText);

			if (request.status >= 200 && request.status < 400) {
				document.getElementById('zipcode-entered').innerText = response.zipcode;
				document.getElementById('electionInfo').innerText = response.electionInfo;
			} else {
				console.log("Server Error");
			}
		});
		request.send(null);
	});
}

function displayError (message) {
	document.getElementById('error').textContent = message;
}
