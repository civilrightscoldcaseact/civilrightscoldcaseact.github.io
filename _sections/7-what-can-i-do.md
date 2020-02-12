---
order: 2
title: What can I do to contribute? 
link: Help Us
---


Well, for starters, share the news! Share this website and tell your friends and family about our efforts.

<div>	
<div>
<div>
<div>
Section 5 of our legislation essentially creates a Civil Rights Cold Case Records Review Board. This board is will be responsible for releasing the case information to the public. Stating,"The President shall appoint, by and with the advice and consent of the Senate, 5 individuals to serve as members of the Review Board, to ensure and facilitate the review, transmission to the Archivist, and public disclosure of civil rights cold case records."

<div>	
<div>
<div>
<div>
We are currently working on securing the nominations for our board. We are working to reach the President, to urge him to appoint the nominees that the legislation is entitled to. 
<div>	
<div>
<div>
<div>
If you're in the United States and want to participate directly, we can help you find your lawmakers and write an email to them. You can <a href="javascript:void(0)" onclick="emailPopup('Representative', '', 'rep')">click here</a> to view a sample email for your representative.
<div>	
<div>
<div>
<div>
<div>	
Thank you, all help your help is greatly appreciated.
<div>	
<div>
<div>
<div>
<div>	
<div>	
<div>
<div>
<div>

<div class="panel panel-default">
	<div class="panel-body">
		<div class="row">
			<div class="col-md-3 col-md-offset-3">
				<button id="find-lawmakers-location" disabled="disabled" class="btn btn-primary">Use my location</button>
			</div>
			<div class="col-md-3">
				<div class="input-group">
					<input type="text" class="form-control" placeholder="zipcode" id="find-lawmakers-zip-text">
					<span class="input-group-btn">
						<button id="find-lawmakers-zip" disabled="disabled" class="btn btn-primary">Search by 
					</span>
				</div>
			</div>
		</div>
		<div id="lawmaker-container">
			<table id="lawmaker-list" class="table table-striped table-responsive">
				<thead>
					<tr>
						<td>Role</td>
						<td>Name</td>
						<td>District</td>
						<td>Legislative Director Email</td>
						<td>Phone</td>
						<td></td>
					</tr>
				</thead>
				<tbody>
				</tbody>
			</table>
		</div>
		<div id="loadingDiv">Loading lawmaker data...</div>
		<div id="email-text"></div>
		<div class="modal fade" id="emailModal" tabindex="-1" role="dialog" aria-labelledby="emailModalLabel">
			<div class="modal-dialog" role="document">
				<div class="modal-content">
					<div class="modal-header">
						<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
						<h4 class="modal-title" id="emailModalLabel">Sample email</h4>
					</div>
					<div class="modal-body">
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
					</div>
				</div>
			</div>
		</div>
		<div class="alerts">
			<div id="location-alert">
				<div class="alert alert-danger alert-dismissible fade in" role="alert">
					<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
					<strong>Failed</strong> to retrieve location. You can use the zip code search instead.
				</div>
			</div>
			<div id="senators-warning">
				<div class="alert alert-warning alert-dismissible fade in" role="alert">
					<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
					<strong>Warning:</strong> Your zip code spans multiple states, so more than two senators were found. Make sure you pick the senators for your state.
				</div>
			</div>
			<div id="representatives-warning">
				<div class="alert alert-warning alert-dismissible fade in" role="alert">
					<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
					<strong>Warning:</strong> Your zip code spans multiple districts, so more than one representative was found. Make sure you pick the representative for your district.
				</div>
			</div>
			<div id="no-lawmakers-location">
				<div class="alert alert-danger alert-dismissible fade in" role="alert">
					<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
					<strong>No lawmakers</strong> were found for your area. If you are in the United States, try using a zip code to search instead.
				</div>
			</div>
			<div id="no-lawmakers-zip">
				<div class="alert alert-danger alert-dismissible fade in" role="alert">
					<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
					<strong>No lawmakers</strong> were found for your area. Check your zip code.
				</div>
			</div>
			<div id="address-error">
				<div class="alert alert-danger alert-dismissible fade in" role="alert">
					<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
					There was an error parsing the address provided.
				</div>
			</div>
			<div id="email-info">
				<div class="alert alert-info alert-dismissible fade in" role="alert">
					<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>

					Click the email icon next to a lawmaker's name for a sample email you can send.
				</div>
			</div>
