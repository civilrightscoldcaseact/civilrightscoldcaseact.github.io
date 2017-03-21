var SUNLIGHT_API_KEY = 'b32511ef8b524de99f2bae7fc5cd3cc6';

$(function () {
	$('#location-alert').hide();
	$('#senators-warning, #representatives-warning').hide();
	$('#lawmaker-list').hide();
	$('#loadingDiv').hide();

	var baseUrl = 'https://congress.api.sunlightfoundation.com/committees?apikey=' + SUNLIGHT_API_KEY + '&fields=member_ids&committee_id=';
	var senateJudiciaryUrl = baseUrl + 'SSJU';
	var houseJudiciaryUrl = baseUrl + 'HSJU';

	var houseOversightUrl = baseUrl + 'HSGO';

	var senateJudiciaryMembers = [];
	var houseJudiciaryMembers = [];

	var houseOversightMembers = [];

	$.get(senateJudiciaryUrl, function (data) {
		senateJudiciaryMembers = data.results[0].member_ids;
	});
	$.get(houseJudiciaryUrl, function (data) {
		houseJudiciaryMembers = data.results[0].member_ids;
	});

	$.get(houseOversightUrl, function (data) {
		houseOversightMembers = data.results[0].member_ids;
	});

	$.get(baseUrl + 'files/legislative-directors.csv', function (data) {
		var legislativeEmails = {};
		var mailArray = data.toString().split('\n');
		for (var i = 0; i < mailArray.length; i++) {
			var kv = mailArray[i].toString().split(',');
			legislativeEmails[i] = kv[1];
			console.log(data)
		}

		if (navigator.geolocation) {
			$('#find-lawmakers-location').prop('disabled', false).click(function () {
				$('#loadingDiv').show();
				navigator.geolocation.getCurrentPosition(function (pos) {
					var latitude = pos.coords.latitude;
					var longitude = pos.coords.longitude;

					var url = 'https://congress.api.sunlightfoundation.com/legislators/locate?latitude=' + latitude + '&longitude=' + longitude + '&apikey=' + SUNLIGHT_API_KEY;

					$.get(url, function (data) {
						$('#loadingDiv').hide();
						renderResults(data.results, 'location');
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

		var searchZip = function () {
			$('#loadingDiv').show();
			var zip = encodeURIComponent($('#find-lawmakers-zip-text').val().trim());
			var url = 'https://congress.api.sunlightfoundation.com/legislators/locate?zip=' + zip + '&apikey=' + SUNLIGHT_API_KEY;
			$.get(url, function (data) {
				$('#loadingDiv').hide();
				renderResults(data.results, 'zip');
			});
		};

		var renderResults = function (results, type) {
		 	if (results.length === 0) {
		 		if (type === 'zip') {
		 			$('#lawmaker-container').before($('#no-lawmakers-zip').html());
		 		} else {
		 			$('#lawmaker-container').before($('#no-lawmakers-location').html());
		 		}
		 		return;
		 	}

			$('#lawmaker-list tbody').html('');

			results.sort(function (a, b) {
				var ranks = {
					'Sen': 0,
					'Rep': 1,
					'Del': 2,
					'Com': 3
				};

				return ranks[a.title] - ranks[b.title];
			});

			var senators = 0;
			var representatives = 0;

			for (var i = 0; i < results.length; i++) {
				(function (i) {
					var person = results[i];
					console.log(person.bioguide_id);
					var extended_title;
					var judiciary = false;
					var oversight = false;
					if (person.title === 'Sen') {
						extended_title = 'Senator';
						for (var j = 0; j < senateJudiciaryMembers.length; j++) {
							if (person.bioguide_id === senateJudiciaryMembers[j]) {
								judiciary = true;
							}
						}
						senators++;
					} else if (person.title === 'Rep') {
						extended_title = 'Representative';
						for (var j = 0; j < houseJudiciaryMembers.length; j++) {
							if (person.bioguide_id === houseJudiciaryMembers[j]) {
								judiciary = true;
							}
						}
						for (var k = 0; k < houseOversightMembers.length; k++) {
							if (person.bioguide_id === houseOversightMembers[k]) {
								oversight = true;
							}
						}
						representatives++;
					} else if (person.title === 'Del') {
						extended_title = 'Delegate';
					} else if (person.title === 'Com') {
						extended_title = 'Commissioner';
					}

					var email = legislativeEmails[i];
					if (email === undefined) {
						email = person.oc_email;
					}

					var district = person.state;
					if (extended_title === 'Representative') {
						district += person.district;
					}

					var tr = $('<tr>').append(
						$('<td>').text(extended_title),
						$('<td>').text(person.first_name + ' ' + person.last_name),
						$('<td>').text(district),
						$('<td>').append($('<a>').text(email).attr('href', 'mailto:' + email)),
						$('<td>').text(person.phone),
						$('<td>').append($('<span>').addClass('glyphicon glyphicon-envelope').attr('aria-hidden', 'true').attr('data-toggle', 'modal').attr('data-target', '#emailModal').click(function () {
							emailPopup(extended_title, person.last_name, oversight);
						}))
					);

					if (judiciary) {
						console.log(12);
						tr.addClass('judiciary');
					}

					if(oversight) {
						console.log(13);
						tr.addClass('oversight');
					}

					$('#lawmaker-list tbody').append(tr);
				})(i);
			}

			$('#lawmaker-list').show();

			$('#lawmaker-container').prepend($('#email-info').html());

			if (senators > 2) {
				$('#lawmaker-container').prepend($('#senators-warning').html());
			}

			if (representatives > 1) {
				$('#lawmaker-container').prepend($('#representatives-warning').html());
			}
		};
	});
});

var emailPopup = function (title, lastname, isOversight) {
	if(!isOversight) {
		$('#emailModal .modal-body').html('');
		$.get(baseUrl + 'emails/primary.html', function (data) {
			$('#emailModal .modal-body').html(data.replace('..TITLE..', title).replace('..LASTNAME..', lastname));

		});
	}
	else {
		$('#emailModal .modal-body').html('');
		$.get(baseUrl + 'emails/secondary.html', function (data) {
			$('#emailModal .modal-body').html(data.replace('..TITLE..', title).replace('..LASTNAME..', lastname));
		});
	}
	writeData(person.lastname, person.zipcode, person.title, person.isOversight);
};

function writeData(name, zipcode, title, oversight) {
	var lawmakerData = {
		name : name,
		zipcode : zipcode,
		title : title,
		isOversight : oversight
	}

	var userID = firebase.auth().currentUser.uid;

	database.ref('cold-case/' + userID).set(lawmakerData);
}
