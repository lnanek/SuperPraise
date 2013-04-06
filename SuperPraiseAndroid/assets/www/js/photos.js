var pictureSource; // picture source
var destinationType; // sets the format of returned value
var smallImage;

// Wait for Cordova to connect with the device
//
document.addEventListener("deviceready", onDeviceReady, false);

// Cordova is ready to be used!
//
function onDeviceReady() {
	pictureSource = navigator.camera.PictureSourceType;
	destinationType = navigator.camera.DestinationType;
	smallImage = document.getElementById('smallImage');
}

// Called when a photo is successfully retrieved
//
function onPhotoDataSuccess(imageData) {
		
	smallImage.style.display = 'block';
	smallImage.src = "data:image/jpeg;base64," + imageData;

}

// Called when a photo is successfully retrieved
//
function onPhotoURISuccess(imageURI) {

	smallImage.style.display = 'block';
	smallImage.src = imageURI;

}

// A button will call this function
//
function capturePhoto() {
	// Take picture using device camera and retrieve image as base64-encoded
	// string
	navigator.camera.getPicture(onPhotoDataSuccess, onFail, {
		quality : 50,
		destinationType : destinationType.DATA_URL
	});
}

// A button will call this function
//
function capturePhotoEdit() {
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