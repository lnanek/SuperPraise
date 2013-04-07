var pictureSource; // picture source
var destinationType; // sets the format of returned value

// Wait for Cordova to connect with the device
//
document.addEventListener("deviceready", onDeviceReady, false);

// Cordova is ready to be used!
//
function onDeviceReady() {
    console.log("onDeviceReady");
    
	pictureSource = navigator.camera.PictureSourceType;
	destinationType = navigator.camera.DestinationType;
    
    capturePhoto();
}

// Called when a photo is successfully retrieved
//
function onPhotoDataSuccess(imageData) {
    console.log("onPhotoDataSuccess");
    
	addImage("data:image/jpeg;base64," + imageData);
}

function addImage(src) {
    console.log("addImage");
    
	var width = ($(window).width() - 40) / 2;
	var insertion = '<img src="' + src + '" width="' + width + '"/>';	
	$(".photoDestination").append(insertion);
	
}

// Called when a photo is successfully retrieved
//
function onPhotoURISuccess(imageURI) {
    console.log("onPhotoURISuccess");
	addImage(imageURI);
}

// A button will call this function
//
function capturePhoto() {
    console.log("capturePhoto");
    
	// Take picture using device camera and retrieve image as base64-encoded
	// string
	navigator.camera.getPicture(onPhotoDataSuccess, onFail, {
		quality : 50,
                                sourceType : navigator.camera.PictureSourceType.CAMERA,
                                destinationType : navigator.camera.DestinationType.FILE_URI
//                                destinationType : destinationType.DATA_URL
	});
}

// A button will call this function
//
function capturePhotoEdit() {
    console.log("capturePhotoEdit");
    
	// Take picture using device camera, allow edit, and retrieve image as
	// base64-encoded string
	navigator.camera.getPicture(onPhotoDataSuccess, onFail, {
		quality : 20,
		allowEdit : true,
		destinationType : destinationType.DATA_URL
	});
}

// A button will call this function
//
function getPhoto(source) {
	// Retrieve image file location from specified source
	navigator.camera.getPicture(onPhotoURISuccess, onFail, {
		quality : 50,
		destinationType : destinationType.FILE_URI,
		sourceType : source
	});
}

// Called if something bad happens.
// 
function onFail(message) {
	alert('Failed because: ' + message);
}