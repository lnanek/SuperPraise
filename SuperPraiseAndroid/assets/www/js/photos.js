var pictureSource; // picture source
var destinationType; // sets the format of returned value

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
	console.log("onDeviceReady");
	
	pictureSource = navigator.camera.PictureSourceType;
	destinationType = navigator.camera.DestinationType;
	
	$('#uploadingMessage').hide();
}

function onPhotoURISuccess(imageURI) {
	console.log("onPhotoURISuccess");
	
	var width = ($(window).width() - 40) / 2;
	var insertion = '<img src="' + imageURI + '" width="' + width + '"/>';	
	$(".photoDestination").append(insertion);
	
	uploadPhoto(imageURI);
	
}

function getPhoto(source) {
	console.log("getPhoto");
	
	// Retrieve image file location from specified source
	navigator.camera.getPicture(onPhotoURISuccess, onFail, {
		quality : 50,
		destinationType : destinationType.FILE_URI,
		sourceType : source
	});
}

function onFail(message) {
	console.log("onFail");
	
	alert('Failed because: ' + message);
}

function uploadPhoto(imageURI) {
	console.log("uploadPhoto");
	
    var options = new FileUploadOptions();
    options.fileKey="appraiseblaze_main_media[file]";
    options.fileName="AppraiseBlaze" + (new Date()) + ".jpg";
    options.mimeType="image/jpeg";

    var params = {};
    options.params = params;

    var ft = new FileTransfer();
    
    //$( "#popupBasic" ).dialog( "open" );
	$('#uploadingMessage').show();
    
    ft.upload(imageURI, encodeURI("http://appraiseblaze.eu1.frbit.net/app_dev.php/media"), win, fail, options);
}

function win(r) {
	console.log("win");

	//$( "#popupBasic" ).dialog( "close" )
	$('#uploadingMessage').hide();
	
    console.log("Code = " + r.responseCode);
    console.log("Response = " + r.response);
    console.log("Sent = " + r.bytesSent);
}

function fail(error) {
	console.log("fail");
	
	//$( "#popupBasic" ).dialog( "close" )
	('#uploadingMessage').hide();
	
    alert("Error uploading (" + error.code + ")");
    console.log("upload error source " + error.source);
    console.log("upload error target " + error.target);
}