
$('#sendingInfo').hide();

$('#squareFootage').val(getSqFt());

$.get('http://appraiseblaze.eu1.frbit.net/app_dev.php/client/property/address',
		function(data) {
			$('#loadingAddress').hide();
	
			$('#addressOfProperty').val(data);
		});

$("#infoForm").submit(function() {
	
	// Show loading message above submit.
	$('#sendingInfo').show();
	
	// Scroll down.
	$('html, body').scrollTop($(document).height());

	$.post(
		'http://appraiseblaze.eu1.frbit.net/app_dev.php/demo', 
		$(this).serialize(), 
		function(data) {
			
			
			var results = '';
			if ( data && data.id ) {
				results += ' (Appraisal ID ' + data.id + ')';
				setAppraisalIdKey(data.id);
			}
			
			alert('Success uploading info to web. ' + results);
		}).always(function() {
			$('#sendingInfo').hide();
		});
	
	return false;
});
