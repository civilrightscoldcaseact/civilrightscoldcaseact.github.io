var SUNLIGHT_API_KEY = 'b32511ef8b524de99f2bae7fc5cd3cc6';

$(function () {
	$('#location-alert').hide();
	$('#senators-warning, #representatives-warning').hide();
	$('#lawmaker-list').hide();

	$.get(baseUrl + 'files/legislative-directors.csv', function (data) {
		var legislativeEmails = {};
		var mailArray = data.split('\n');
		for (var i = 0; i < mailArray.length; i++) {
			var kv = mailArray[i].split(',');
			legislativeEmails[kv[0]] = kv[1];
		}

		if (navigator.geolocation) {
			$('#find-lawmakers-location').prop('disabled', false).click(function () {
				navigator.geolocation.getCurrentPosition(function (pos) {
					var latitude = pos.coords.latitude;
					var longitude = pos.coords.longitude;

					var url = 'https://congress.api.sunlightfoundation.com/legislators/locate?latitude=' + latitude + '&longitude=' + longitude + '&apikey=' + SUNLIGHT_API_KEY;

					$.get(url, function (data) {
						renderResults(data.results);
					});
				}, function () {
					$(this).prop('disabled');
					$('#location-alert').show();
				});
			});
		}

		$('#find-lawmakers-zip').prop('disabled', false).click(function () {
			var zip = encodeURIComponent($('#find-lawmakers-zip-text').val().trim());
			var url = 'https://congress.api.sunlightfoundation.com/legislators/locate?zip=' + zip + '&apikey=' + SUNLIGHT_API_KEY;
			$.get(url, function (data) {
				renderResults(data.results);
			});
		});

		var renderResults = function (results) {
			$('#lawmaker-list tbody').html('');

			var senators = [];
			var representatives = [];

			for (var i = 0; i < results.length; i++) {
				var person = results[i];
				if (person.title === 'Sen') {
					senators.push(person);
				} else {
					representatives.push(person);
				}
			}

			for (var i = 0; i < senators.length; i++) {
				var email = legislativeEmails[senators[i].bioguide_id];
				if (email === undefined) {
					email = senators[i].oc_email;
				}

				$('#lawmaker-list tbody').append($('<tr>').append(
					$('<td>').text('Senator'),
					$('<td>').text(senators[i].first_name + ' ' + senators[i].last_name),
					$('<td>').text(senators[i].state),
					$('<td>').append($('<a>').text(email).attr('href', 'mailto:' + email))
				));
			}
			
			for (var i = 0; i < representatives.length; i++) {
				var email = legislativeEmails[representatives[i].bioguide_id];
				if (email === undefined) {
					email = representatives[i].oc_email;
				}

				$('#lawmaker-list tbody').append($('<tr>').append(
					$('<td>').text('Representative'),
					$('<td>').text(representatives[i].first_name + ' ' + representatives[i].last_name),
					$('<td>').text(representatives[i].state + ' ' + representatives[i].district),
					$('<td>').append($('<a>').text(email).attr('href', 'mailto:' + email))
				));
			}

			$('#lawmaker-list').show();

			if (senators.length > 2) {
				$('#senators-warning').show();
			}

			if (representatives.length > 1) {
				$('#representatives-warning').show();
			}
		};
	});
});