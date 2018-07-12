var GOOGLE_API_KEY = 'AIzaSyBkkxta9iZcCh7OziHwIg-9HEuShzNT8Lc';
var userCount = 0;
var personalUserID;
var first = true;

$(function () {
	$('#location-alert').hide();
	$('#senators-warning, #representatives-warning').hide();
	$('#lawmaker-list').hide();
	$('#loadingDiv').hide();

	// var judiciaryUrl = 'https://congress.api.sunlightfoundation.com/committees?apikey=' + SUNLIGHT_API_KEY + '&fields=member_ids&committee_id=';
	// var senateJudiciaryUrl = judiciaryUrl + 'SSJU';
	// var houseJudiciaryUrl = judiciaryUrl + 'HSJU';
	// 
	// var houseOversightUrl = judiciaryUrl + 'HSGO';
	// 
	// var senateJudiciaryMembers = [];
	// var houseJudiciaryMembers = [];
	// 
	// var houseOversightMembers = [];
	// 
	// $.get(senateJudiciaryUrl, function (data) {
	// 	senateJudiciaryMembers = data.results[0].member_ids;
	// });
	// $.get(houseJudiciaryUrl, function (data) {
	// 	houseJudiciaryMembers = data.results[0].member_ids;
	// });
	// 
	// $.get(houseOversightUrl, function (data) {
	// 	houseOversightMembers = data.results[0].member_ids;
	// });

	$.get(baseUrl + 'files/legislative-directors.csv', function (data) {
		var legislativeEmails = {};
		var mailArray = data.split('\n');
		for (var i = 0; i < mailArray.length; i++) {
			var kv = mailArray[i].split(',');
			legislativeEmails[kv[0]] = kv[1].replace(/\s/g,'');
		}

		if (navigator.geolocation) {
			$('#find-lawmakers-location').prop('disabled', false).click(function () {
				$('#loadingDiv').show();
				navigator.geolocation.getCurrentPosition(function (pos) {
					var latitude = pos.coords.latitude;
					var longitude = pos.coords.longitude;

					var reverseGeocodeUrl = 'https://nominatim.openstreetmap.org/reverse?format=json&lat=' + latitude + '&lon=' + longitude;

					$.get(reverseGeocodeUrl, function (data) {
						fetchResults(data.display_name, 'location');
					});
				}, function () {
					$(this).prop('disabled');
					$('#lawmaker-container').before($('#location-alert').html());
				});
			});
		}

		$('#find-lawmakers-zip').prop('disabled', false).click(function () {
			searchZip();
		});
		$('#find-lawmakers-zip-text').keydown(function (e) {
			if (e.which === 13) {
				searchZip();
			}
		});

		var fetchResults = function (address, type) {
			var url = 'https://www.googleapis.com/civicinfo/v2/representatives?key=' + GOOGLE_API_KEY + '&address=' + encodeURIComponent(address);

			$.get(url, function (data) {
				$('#loadingDiv').hide();
				renderResults(data, type);
			});
		};

		var searchZip = function () {
			$('#loadingDiv').show();
			var zip = encodeURIComponent($('#find-lawmakers-zip-text').val().trim());
			fetchResults(zip, 'zip');
		};

		var renderResults = function (results, type) {
			var repOffices = results.offices.filter(
				office => office.levels
				&& office.levels.includes('country')
				&& office.roles
				&& office.roles.includes('legislatorLowerBody')
			)
			var reps = [];
			if (repOffices.length) {
				reps = repOffices[0].officialIndices.map(index => ({type: 'rep', data: results.officials[index]}));
			}
			
			var senatorOffices = results.offices.filter(
				office => office.levels
				&& office.levels.includes('country')
				&& office.roles
				&& office.roles.includes('legislatorUpperBody')
			);
			var senators = [];
			if (senatorOffices.length) {
				senators = senatorOffices[0].officialIndices.map(index => ({type: 'senator', data: results.officials[index]}));
			}
			
		 	if (reps.length === 0 && senators.length === 0) {
		 		if (type === 'zip') {
		 			$('#lawmaker-container').before($('#no-lawmakers-zip').html());
		 		} else {
		 			$('#lawmaker-container').before($('#no-lawmakers-location').html());
		 		}
		 		return;
		 	}

			$('#lawmaker-list tbody').html('');

			var people = senators.concat(representatives);

			var senatorCount = senators.length;
			var representativeCount = reps.length;

			for (var i = 0; i < reps.length; i++) {
				(function (i) {
					var type = reps[i].type;
					var person = reps[i].data;
					var title = type === 'rep' ? 'Representative' : 'Senator';

					var tr = $('<tr>').append(
						$('<td>').text(title),
						$('<td>').text(person.name),
						$('<td>'),
						$('<td>'),
						$('<td>').text(person.phones && person.phones.length && person.phones[0]),
						$('<td>').append($('<span>').addClass('glyphicon glyphicon-envelope').attr('aria-hidden', 'true').attr('data-toggle', 'modal').attr('data-target', '#emailModal').click(function () {
							emailPopup(title, person.name);
						}))
					);

					// if (judiciary) {
					// 	console.log(12);
					// 	tr.addClass('judiciary');
					// }
					// 
					// if(oversight) {
					// 	console.log(13);
					// 	tr.addClass('oversight');
					// }

					$('#lawmaker-list tbody').append(tr);
				})(i);
			}

			$('#lawmaker-list').show();

			$('#lawmaker-container').prepend($('#email-info').html());

			if (senatorCount > 2) {
				$('#lawmaker-container').prepend($('#senators-warning').html());
			}

			if (representativeCount > 1) {
				$('#lawmaker-container').prepend($('#representatives-warning').html());
			}
		};
	});
});

var emailPopup = function (title, lastname) {
	//if(!oversight) {
		$('#emailModal .modal-body').html('');
		$.get(baseUrl + 'emails/primary.html', function (data) {
			$('#emailModal .modal-body').html(data.replace('..TITLE..', title).replace('..LASTNAME..', lastname));

		});
	/*}
	else {
		$('#emailModal .modal-body').html('');
		$.get(baseUrl + 'emails/secondary.html', function (data) {
			$('#emailModal .modal-body').html(data.replace('..TITLE..', title).replace('..LASTNAME..', lastname));
		});
	}*/
	writeData(title, lastname, oversight);
};

function writeData(title, name, oversight) {
	if(first) {
		personalUserID = userID;
		first = !first;
	}

	var lawmakerData = {
		title : title,
		name : name,
		oversight : oversight
	}

	databaseRef = firebase.database().ref("server/emailsOpened/User - " + personalUserID + " : " + name);
	databaseRef.set(lawmakerData);
}
