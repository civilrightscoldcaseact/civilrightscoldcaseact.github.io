var GOOGLE_API_KEY = 'AIzaSyBkkxta9iZcCh7OziHwIg-9HEuShzNT8Lc';
var userCount = 0;
var personalUserID;
var first = true;

var houseAppropriationsPhones = ["(202) 225-2901","(202) 225-4876","(202) 225-2542","(202) 225-4301","(202) 225-2661","(202) 225-3201","(202) 225-6161","(202) 225-1766","(202) 225-1986","(202) 225-3661","(202) 225-2501","(202) 225-5961","(202) 225-9890","(202) 225-7931","(202) 225-4211","(202) 225-3631","(202) 225-5211","(202) 225-2726","(202) 225-5531","(202) 225-4061","(202) 225-5905","(202) 225-2461","(202) 225-4601","(202) 225-6116","(202) 225-5311","(202) 225-3061","(202) 225-2836","(202) 225-3561","(202) 225-5802","(202) 225-6631","(202) 225-5772","(202) 225-4806","(202) 225-6155","(202) 225-5801","(202) 225-2601","(202) 225-4361","(202) 225-6506","(202) 225-1784","(202) 225-4146","(202) 225-5261","(202) 225-5731","(202) 225-6165","(202) 225-5546","(202) 225-3271","(202) 225-5071","(202) 225-4511","(202) 225-1640","(202) 225-3864","(202) 225-9730","(202) 225-3536","(202) 225-5816","(202) 225-5916","(202) 225-2906"];
var senateAppropriationsPhones = ['(202) 224-5744', '(202) 224-2541', '(202) 224-4944', '(202) 224-2523', '(202) 224-5721', '(202) 224-6521', '(202) 224-2551', '(202) 224-4843', '(202) 224-6472', '(202) 224-4623', '(202) 224-5054', '(202) 224-2651', '(202) 224-3041', '(202) 224-5754', '(202) 224-4242', '(202) 224-2621', '(202) 224-3841', '(202) 224-2152', '(202) 224-4642', '(202) 224-2644', '(202) 224-6621', '(202) 224-2841', '(202) 224-3753', '(202) 224-5042', '(202) 224-3934', '(202) 224-5653', '(202) 224-4041', '(202) 224-3954', '(202) 224-4654'];

$(function () {
	$('#location-alert').hide();
	$('#senators-warning, #representatives-warning').hide();
	$('#lawmaker-list').hide();
	$('#loadingDiv').hide();
	$('#address-error').hide();

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
			}).fail(function (error) {
				console.error(12, error);
				$('#lawmaker-container').before($('#address-error').html());
			});
		};

		var searchZip = function () {
			$('#loadingDiv').show();
			var zip = $('#find-lawmakers-zip-text').val().trim();
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
				var officeName = repOffices[0].name;
				var district = officeName.substring(officeName.lastIndexOf(' ') + 1);
				reps = repOffices[0].officialIndices.map(index => ({type: 'rep', data: results.officials[index], district: district}));
			}
			
			var senatorOffices = results.offices.filter(
				office => office.levels
				&& office.levels.includes('country')
				&& office.roles
				&& office.roles.includes('legislatorUpperBody')
			);
			var senators = [];
			if (senatorOffices.length) {
				senators = senatorOffices[0].officialIndices.map(index => ({type: 'senator', data: results.officials[index], district: null}));
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

			var people = reps;

			var senatorCount = senators.length;
			var representativeCount = reps.length;

			for (var i = 0; i < people.length; i++) {
				(function (i) {
					var type = people[i].type;
					var person = people[i].data;
					var title = type === 'rep' ? 'Representative' : 'Senator';

					var tr = $('<tr>').append(
						$('<td>').text(title),
						$('<td>').text(person.name),
						$('<td>').text(people[i].district || ''),
						$('<td>'),
						$('<td>').text(person.phones && person.phones.length && person.phones[0]),
						$('<td>').append($('<span>').addClass('glyphicon glyphicon-envelope').attr('aria-hidden', 'true').attr('data-target', '#emailModal').click(function () {
							emailPopup(title, person.name, type);
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

var emailPopup = function (title, lastname, type) {
	//if(!oversight) {
		$('#emailModal .modal-body').html('');
	if (type === 'rep') {
		$.get(baseUrl + 'emails/primary.html', function (data) {
			$('#emailModal .modal-body').html(data.replace('..TITLE..', title).replace('..LASTNAME..', lastname));
		});
	} else {
		$('#emailModal .modal-body').html('');
		$.get(baseUrl + 'emails/senate.html', function (data) {
			$('#emailModal .modal-body').html(data.replace('..TITLE..', title).replace('..LASTNAME..', lastname));
		});
	}
	$('#emailModal').modal('show')
	/*}
	else {
		$('#emailModal .modal-body').html('');
		$.get(baseUrl + 'emails/secondary.html', function (data) {
			$('#emailModal .modal-body').html(data.replace('..TITLE..', title).replace('..LASTNAME..', lastname));
		});
	}*/
//	writeData(title, lastname, oversight);
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
