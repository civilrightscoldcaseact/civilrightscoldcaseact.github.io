var SUNLIGHT_API_KEY = 'b32511ef8b524de99f2bae7fc5cd3cc6';

$(function () {
	$('#location-alert').hide();
	$('#senators-warning, #representatives-warning').hide();
	$('#lawmaker-list').hide();
	$('#loadingDiv').hide();

	$.get(baseUrl + 'files/legislative-directors.csv', function (data) {
		var legislativeEmails = {};
		var mailArray = data.split('\n');
		for (var i = 0; i < mailArray.length; i++) {
			var kv = mailArray[i].split(',');
			legislativeEmails[kv[0]] = kv[1];
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
			$('#loadingDiv').show();
			var zip = encodeURIComponent($('#find-lawmakers-zip-text').val().trim());
			var url = 'https://congress.api.sunlightfoundation.com/legislators/locate?zip=' + zip + '&apikey=' + SUNLIGHT_API_KEY;
			$.get(url, function (data) {
				$('#loadingDiv').hide();
				renderResults(data.results, 'zip');
			});
		});

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
				var person = results[i];
				var extended_title;
				if (person.title === 'Sen') {
					extended_title = 'Senator';
					senators++;
				} else if (person.title === 'Rep') {
					extended_title = 'Representative';
					representatives++;
				} else if (person.title === 'Del') {
					extended_title = 'Delegate';
				} else if (person.title === 'Com') {
					extended_title = 'Commissioner';
				}

				var email = legislativeEmails[person.bioguide_id];
				if (email === undefined) {
					email = person.oc_email;
				}

				var district = person.state;
				if (extended_title === 'Representative') {
					district += person.district;
				}

				$('#lawmaker-list tbody').append($('<tr>').append(
					$('<td>').text(extended_title),
					$('<td>').text(person.first_name + ' ' + person.last_name),
					$('<td>').text(district),
					$('<td>').append($('<a>').text(email).attr('href', 'mailto:' + email)),
					$('<td>').text(person.phone);
				));
			}

			$('#lawmaker-list').show();

			if (senators > 2) {
				$('#lawmaker-container').prepend($('#senators-warning').html());
			}

			if (representatives > 1) {
				$('#lawmaker-container').prepend($('#representatives-warning').html());
			}
		};
	});
});
