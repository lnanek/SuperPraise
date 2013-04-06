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
	context.font = "24px sans-serif";
	context.strokeStyle = "#AAAAFF";
	
	requestAnimationFrame(update);
});

function update() {
	requestAnimationFrame(update);

	// Clear previously drawn frame.
	context.clearRect(0, 0, canvas.width, canvas.height);

	// Draw grid.
	var left = 0, top = 0;
	for ( var i = 0; i < getGridWidth(); i++) {

		var leftDimensionTotal = 0;
		var leftDimensionTop = 0;
		for ( var j = 0; j < getGridHeight(); j++) {

			// If in a building.
			if (hasGridSquareBeenClicked(i, j)) {
				context.fillStyle = "#CCCCFF";
				context
						.fillRect(left, top, getSquareWidth(),
								getSquareHeight());
			// Otherwise we might draw a dimension here.
			} else {
				var leftDimension = hasGridSquareBeenClicked(i + 1, j);
				if ( leftDimension ) {
					leftDimensionTotal += parseInt(gridValue.value);
					if (!leftDimensionTop) {
						leftDimensionTop = top;
					}

					var nextIsLeftDimension = !hasGridSquareBeenClicked(i, j + 1)
						&& hasGridSquareBeenClicked(i + 1, j + 1);
					if ( nextIsLeftDimension ) {
						
					} else {
						context.textAlign = 'right';
						context.textBaseline = 'middle';
						context.fillStyle = "#000000";
						context.fillText("" + leftDimensionTotal + " " + gridUnits.value,
								left + getSquareWidth(), (leftDimensionTop + top + getSquareHeight()) / 2);
					}
				} else {
					leftDimensionTotal = 0;
					leftDimensionTop = 0;					
				}
			}
			

			context.strokeRect(left, top, getSquareWidth(), getSquareHeight());

			top += getSquareHeight();
		}
		left += getSquareWidth();
		top = 0;

	}

	// Draw calculated size reading.
	var units = filledGridX.length;
	var unitValue = gridValue.value;
	var squareUnits = units * unitValue;
	context.textAlign = 'center';
	context.fillStyle = "#000000";
	context.fillText("Total: " + squareUnits + " sq. " + gridUnits.value,
			canvas.width / 2, canvas.height / 2);
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
}

function hasLeftBorder() {
	for ( var i = 0; i < getGridHeight(); i++ ) {
		if ( hasGridSquareBeenClicked(0, i) ) {
			return false;
		}
	}	
	return true;
}

function hasRightBorder() {
	for ( var i = 0; i < getGridHeight(); i++ ) {
		if ( hasGridSquareBeenClicked(getGridWidth() - 1, i) ) {
			return false;
		}
	}	
	return true;
}

function hasTopBorder() {
	for ( var i = 0; i < getGridWidth(); i++ ) {
		if ( hasGridSquareBeenClicked(i, 0) ) {
			return false;
		}
	}	
	return true;
}

function hasBottomBorder() {
	for ( var i = 0; i < getGridWidth(); i++ ) {
		if ( hasGridSquareBeenClicked(i, getGridHeight() - 1) ) {
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
context.canvas.onmousedown = function(event) {
	mouseDown = 1;

	fillSquare(event);
}
context.canvas.onmouseup = function(event) {
	if ( mouseDown) {
		ensureBorder();
	}
	mouseDown = 0;
}

context.canvas.onmousemove = function(event) {
	if (!mouseDown) {
		return;
	}

	fillSquare(event);
};

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