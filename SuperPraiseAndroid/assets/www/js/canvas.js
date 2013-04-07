// Fake requestAnimationFrame using setInterval when not present. From: 
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
(function() {
	var lastTime = 0;
	var vendors = [ 'webkit', 'moz' ];
	for ( var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
		window.requestAnimationFrame = window[vendors[x]
				+ 'RequestAnimationFrame'];
		window.cancelAnimationFrame = window[vendors[x]
				+ 'CancelAnimationFrame']
				|| window[vendors[x] + 'CancelRequestAnimationFrame'];
	}

	if (!window.requestAnimationFrame)
		window.requestAnimationFrame = function(callback, element) {
			var currTime = new Date().getTime();
			var timeToCall = Math.max(0, 16 - (currTime - lastTime));
			var id = window.setTimeout(function() {
				callback(currTime + timeToCall);
			}, timeToCall);
			lastTime = currTime + timeToCall;
			return id;
		};

	if (!window.cancelAnimationFrame)
		window.cancelAnimationFrame = function(id) {
			clearTimeout(id);
		};
}());

var canvas = document.getElementById('myCanvas');
var context = canvas.getContext('2d');

var gridWidthInput = document.getElementById('gridWidthInput');
var gridHeightInput = document.getElementById('gridHeightInput');
var gridValue = document.getElementById('gridValue');
var gridUnits = document.getElementById('gridUnits');
var gridUnitsSquared = document.getElementById('gridUnitsSquared');
var lastSqFt = -1;

var filledGridX = [];
var filledGridY = [];

function getSquareWidth() {
	return (canvas.width / gridWidthInput.value) - 1;
}

function getSquareHeight() {
	return (canvas.height / gridHeightInput.value) - 1;
}

function getGridWidth() {
	return parseInt(gridWidthInput.value);
}

function getGridHeight() {
	return parseInt(gridHeightInput.value);
}

$(document).bind("pageinit", function() {

	var sizedWindowWidth = $(window).width() - 30;
	canvas.width = sizedWindowWidth;
	context.lineWidth = 1;
	context.strokeStyle = "#AAAAFF";

	requestAnimationFrame(update);
});

function update() {
	requestAnimationFrame(update);

	// Clear previously drawn frame.
	context.clearRect(0, 0, canvas.width, canvas.height);

	// Draw grid.
	context.font = "18px sans-serif";
	var left = 0, top = 0;
	for ( var i = 0; i < getGridWidth(); i++) {

		var leftDimensionTotal = 0;
		var leftDimensionTop = 0;
		var rightDimensionTotal = 0;
		var rightDimensionTop = 0;

		for ( var j = 0; j < getGridHeight(); j++) {

			// If in a building, fill it in.
			if (hasGridSquareBeenClicked(i, j)) {
				context.fillStyle = "#CCCCFF";
				context
						.fillRect(left, top, getSquareWidth(),
								getSquareHeight());
				// Otherwise we might draw a dimension here.
			} else {
				// Draw left dimension.
				var leftDimension = hasGridSquareBeenClicked(i + 1, j);
				if (leftDimension) {
					leftDimensionTotal += parseInt(gridValue.value);
					if (!leftDimensionTop) {
						leftDimensionTop = top;
					}

					var nextIsLeftDimension = !hasGridSquareBeenClicked(i,
							j + 1)
							&& hasGridSquareBeenClicked(i + 1, j + 1);
					if (!nextIsLeftDimension) {
						context.textAlign = 'right';
						context.textBaseline = 'middle';
						context.fillStyle = "#000000";
						context
								.fillText("" + leftDimensionTotal + ""
										+ gridUnits.value, left
										+ getSquareWidth(), (leftDimensionTop
										+ top + getSquareHeight()) / 2);
						leftDimensionTotal = 0;
						leftDimensionTop = 0;
					}
				} else {
					leftDimensionTotal = 0;
					leftDimensionTop = 0;
				}
				// Draw right dimension.
				var rightDimension = hasGridSquareBeenClicked(i - 1, j);
				if (rightDimension) {
					rightDimensionTotal += parseInt(gridValue.value);
					if (!rightDimensionTop) {
						rightDimensionTop = top;
					}

					var nextIsRightDimension = !hasGridSquareBeenClicked(i,
							j + 1)
							&& hasGridSquareBeenClicked(i - 1, j + 1);
					if (!nextIsRightDimension) {
						context.textAlign = 'left';
						context.textBaseline = 'middle';
						context.fillStyle = "#000000";
						context.fillText("" + rightDimensionTotal + ""
								+ gridUnits.value, left, (rightDimensionTop
								+ top + getSquareHeight()) / 2);
						rightDimensionTotal = 0;
						rightDimensionTop = 0;
					}
				} else {
					rightDimensionTotal = 0;
					rightDimensionTop = 0;
				}
			} // end if else not filled in

			if (j > 0) {
				context.strokeRect(left, top, getSquareWidth(),
						getSquareHeight());
			}

			top += getSquareHeight();
		} // end for each grid y
		left += getSquareWidth();
		top = 0;

	} // end for each grid x

	// Draw top and bottom dimensions.
	var left = 0, top = 0;
	for ( var j = 0; j < getGridHeight(); j++) {

		var topDimensionTotal = 0;
		var topDimensionLeft = 0;
		var bottomDimensionTotal = 0;
		var bottomDimensionLeft = 0;

		for ( var i = 0; i < getGridWidth(); i++) {

			// If in a building, filled in.
			// Otherwise we might draw a dimension here.
			if (!hasGridSquareBeenClicked(i, j)) {
				// Draw top dimension.
				var topDimension = hasGridSquareBeenClicked(i, j + 1);
				if (topDimension) {
					topDimensionTotal += parseInt(gridValue.value);
					if (!topDimensionLeft) {
						topDimensionLeft = left;
					}

					var nextIsTopDimension = !hasGridSquareBeenClicked(i + 1, j)
							&& hasGridSquareBeenClicked(i + 1, j + 1);
					if (!nextIsTopDimension) {
						context.textAlign = 'center';
						context.textBaseline = 'bottom';
						context.fillStyle = "#000000";
						context
								.fillText("" + topDimensionTotal + ""
										+ gridUnits.value, (topDimensionLeft
										+ left + getSquareWidth()) / 2, top
										+ getSquareHeight());
						topDimensionTotal = 0;
						topDimensionLeft = 0;
					}
				} else {
					topDimensionTotal = 0;
					topDimensionLeft = 0;
				}
				// Draw bottom dimension.
				var bottomDimension = hasGridSquareBeenClicked(i, j - 1);
				if (bottomDimension) {
					bottomDimensionTotal += parseInt(gridValue.value);
					if (!bottomDimensionLeft) {
						bottomDimensionLeft = left;
					}

					var nextIsBottomDimension = !hasGridSquareBeenClicked(
							i + 1, j)
							&& hasGridSquareBeenClicked(i + 1, j - 1);
					if (!nextIsBottomDimension) {
						context.textAlign = 'center';
						context.textBaseline = 'top';
						context.fillStyle = "#000000";
						context
								.fillText("" + bottomDimensionTotal + ""
										+ gridUnits.value, (bottomDimensionLeft
										+ left + getSquareWidth()) / 2, top);
						bottomDimensionTotal = 0;
						bottomDimensionLeft = 0;
					}
				} else {
					bottomDimensionTotal = 0;
					bottomDimensionLeft = 0;
				}
			} // end if else not filled in

			left += getSquareWidth();
		} // end for each grid c
		top += getSquareHeight();
		left = 0;

	} // end for each grid y

	// Draw calculated size reading.
	var units = filledGridX.length;
	var unitValue = gridValue.value;
	var squareUnits = units * unitValue;
	if (lastSqFt < 0 || lastSqFt != squareUnits) {
		setSqFt(squareUnits);
		lastSqFt = squareUnits;
	}
	context.font = "24px sans-serif";
	context.textAlign = 'center';
	context.textBaseline = 'top';
	context.fillStyle = "#000000";
	context.fillText("Total: " + squareUnits + " " + gridUnitsSquared.value,
			canvas.width / 2, 0);
}

function ensureBorder() {
	console.log("ensureBorder()");
	if (!hasRightBorder()) {
		gridWidthInput.value = getGridWidth() + 1;
	}
	if (!hasBottomBorder()) {
		gridHeightInput.value = getGridHeight() + 1;
	}
	if (!hasLeftBorder()) {
		gridWidthInput.value = getGridWidth() + 1;
		moveClickedRight();
	}
	if (!hasTopBorder()) {
		gridHeightInput.value = getGridHeight() + 1;
		moveClickedDown();
	}
	if (!hasTopBorder()) {
		gridHeightInput.value = getGridHeight() + 1;
		moveClickedDown();
	}
}

function hasLeftBorder() {
	for ( var i = 0; i < getGridHeight(); i++) {
		if (hasGridSquareBeenClicked(0, i)) {
			return false;
		}
	}
	return true;
}

function hasRightBorder() {
	for ( var i = 0; i < getGridHeight(); i++) {
		if (hasGridSquareBeenClicked(getGridWidth() - 1, i)) {
			return false;
		}
	}
	return true;
}

function hasTopBorder() {
	for ( var i = 0; i < getGridWidth(); i++) {
		if (hasGridSquareBeenClicked(i, 0)) {
			return false;
		}
		if (hasGridSquareBeenClicked(i, 1)) {
			return false;
		}
	}
	return true;
}

function hasBottomBorder() {
	for ( var i = 0; i < getGridWidth(); i++) {
		if (hasGridSquareBeenClicked(i, getGridHeight() - 1)) {
			return false;
		}
	}
	return true;
}

function moveClickedRight() {
	for ( var n = 0; n < filledGridX.length; n++) {
		filledGridX[n]++;
	}
}

function moveClickedDown() {
	for ( var n = 0; n < filledGridY.length; n++) {
		filledGridY[n]++;
	}
}

function hasGridSquareBeenClicked(gridX, gridY) {
	for ( var n = 0; n < filledGridX.length; n++) {
		var clickedGridX = filledGridX[n];
		var clickedGridY = filledGridY[n];
		if (clickedGridX == gridX && clickedGridY == gridY) {
			return true;
		}
	}
	return false;
}

var mouseDown = 0;

$(canvas).bind('vmouseup', function(event) {
	if (mouseDown) {
		ensureBorder();
	}
	mouseDown = 0;
});

$(canvas).bind('vmousedown', function(event) {
	mouseDown = 1;

	fillSquare(event);
});

$(canvas).bind('vmousemove', function(event) {
	if (!mouseDown) {
		return;
	}

	fillSquare(event);
});

function fillSquare(event) {

	event = event || window.event;
	var x = event.pageX - context.canvas.offsetLeft;
	var y = event.pageY - context.canvas.offsetTop;

	var gridX = Math.floor(x / getSquareWidth());
	var gridY = Math.floor(y / getSquareHeight());

	console.log("gridX: " + gridX);
	console.log("gridY: " + gridY);

	if (!hasGridSquareBeenClicked(gridX, gridY)) {
		filledGridX.push(gridX);
		filledGridY.push(gridY);
	}

}

function uploadSketch() {

	window.plugins.screenshot.saveScreenshot();

	$('#uploadingMessage').show();
	
	// TODO wait for return properly.
	setTimeout(function() {
		uploadPhoto("file:///mnt/sdcard/Pictures/AppraiseBlaze.png");
	},5000);
	 
}


var loadingStatus = 0;

function uploadPhoto(imageURI) {
	console.log("uploadPhoto");
	
    var options = new FileUploadOptions();
    options.fileKey="appraiseblaze_main_media[file]";
    options.fileName="AppraiseBlaze" + (new Date()) + ".jpg";
    options.mimeType="image/jpeg";

    var params = {};
    options.params = params;

    var ft = new FileTransfer();
    
    loadingStatus = 0;
    ft.onprogress = function(progressEvent) {
        if (progressEvent.lengthComputable) {
            $('#uploadingMessage').html('Uploading... ' 
            		+ (Math.round(progressEvent.loaded / progressEvent.total) * 100) + '%');
        } else {
        	loadingStatus++;
        	$('#uploadingMessage').html('Uploading... ' + loadingStatus);
        }
    };
    
    
    ft.upload(imageURI, encodeURI("http://appraiseblaze.eu1.frbit.net/app_dev.php/media"), win, fail, options);
}

function win(r) {
	console.log("win");

	$('#uploadingMessage').hide();
	
    console.log("Code = " + r.responseCode);
    console.log("Response = " + r.response);
    console.log("Sent = " + r.bytesSent);
}

function fail(error) {
	console.log("fail");
	
	('#uploadingMessage').hide();
	
    alert("Error uploading (" + error.code + ")");
    console.log("upload error source " + error.source);
    console.log("upload error target " + error.target);
}

/*
function uploadSketch() {
	var xhr = new XMLHttpRequest();
	var fileUpload = xhr.upload;
	var boundary = 'multipartformboundary' + (new Date).getTime();

	fileUpload.addEventListener("load", function(ajax) {
		console.debug(ajax); // getting the response
	}, false);

	xhr.open("POST", "http://appraiseblaze.eu1.frbit.net/app_dev.php/media",
			true);
	xhr.setRequestHeader('content-type', 'multipart/form-data; boundary='
			+ boundary);

	builder = '--'
			+ boundary
			+ '\r\n Content-Disposition: form-data; name="appraiseblaze_main_media[file]"; filename="upload.png"\r\n Content-Type: image/png \r\n\r\n';
	builder += (canvas.toDataURL('image/png').split(","))[1];

	builder += '\r\n--' + boundary + '--\r\n';

	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
			if (xhr.status == 200)
				alert("URL Exists!")
			else if (xhr.status == 404)
				alert("URL doesn't exist!")
			else
				alert("Status is " + xhr.status)
		}
	}
	xhr.send(builder);

}
*/