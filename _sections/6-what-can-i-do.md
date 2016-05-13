---
order: 6
title: What can I do?
link: Help
---
Well, for starters, share the news! Share this website and tell your friends and family about our efforts.

If you're in the United States and want to participate directly, we can help you find your lawmakers and write an email to them.

<div class="panel panel-default">
	<div class="panel-body">
		<div class="row">
			<div class="col-md-3 col-md-offset-3">
				<button id="find-lawmakers-location" disabled="disabled" class="btn btn-primary">Use my location</button>
			</div>
			<div class="col-md-3">
				<div class="input-group">
					<input type="text" class="form-control" placeholder="zip code" id="find-lawmakers-zip-text">
					<span class="input-group-btn">
						<button id="find-lawmakers-zip" disabled="disabled" class="btn btn-primary">Search by zip</button>
					</span>
				</div>
			</div>
		</div>
		<div class="alert alert-danger alert-dismissible fade in" id="location-alert" role="alert">
			<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
			<strong>Failed</strong> to retrieve location. You can use the zip code search instead.
		</div>
		<div id="lawmaker-container">
			<div class="alert alert-warning alert-dismissible fade in" id="senators-warning" role="alert">
				<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
				<strong>Warning:</strong> Your zip code spans multiple states, so more than two senators were found. Make sure you pick the senators for your state.
			</div>
			<div class="alert alert-warning alert-dismissible fade in" id="representatives-warning" role="alert">
				<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
				<strong>Warning:</strong> Your zip code spans multiple districts, so more than one representative was found. Make sure you pick the representative for your district.
			</div>
			<table id="lawmaker-list" class="table table-striped">
				<thead>
					<tr>
						<td>Role</td>
						<td>Name</td>
						<td>District</td>
						<td>Legislative Director Email</td>
					</tr>
				</thead>
				<tbody>
				</tbody>
			</table>
		</div>
		<div id="email-text"></div>
	</div>
</div>