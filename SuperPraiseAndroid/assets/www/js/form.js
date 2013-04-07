
$('#squareFootage').val(getSqFt());
	
$.get('http://appraiseblaze.eu1.frbit.net/app_dev.php/client/property/address', function(data) {
	  $('#addressOfProperty').val(data);
	  alert('Pre-filled address from web.');
	});

