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
      
      requestAnimationFrame(update);
      
      function update() {
        requestAnimationFrame(update);
        
        // Clear previously drawn frame.
        context.clearRect(0, 0, canvas.width, canvas.height);

				// Draw grid.
  			context.strokeStyle = "#AAAAFF";
  			context.fillStyle = "#CCCCFF";
        var left = 0, top = 0;
        for(var i = 0; i < gridWidthInput.value; i++) {
                					
         	for(var j = 0; j < gridHeightInput.value; j++) {
         	
								if ( hasGridSquareBeenClicked( i, j ) ) {
		          		context.fillRect (left, top, getSquareWidth(), getSquareHeight());								
								}         	   		

          	context.strokeRect (left, top, getSquareWidth(), getSquareHeight());          	
          	
  					top += getSquareHeight();
        	}       
  				left += getSquareWidth();  
  				top = 0;					
        	
        }
        
        // Draw calculated size reading.
        context.lineWidth=1;
        context.fillStyle="#000000";
        context.font="32px sans-serif";
        context.textAlign = 'center';
        
        var units = filledGridX.length;
        var unitValue = gridValue.value;
        var squareUnits = units * unitValue;
        
        context.fillText("Total: " 
        	+ squareUnits 
        	+ " sq. " + gridUnits.value, canvas.width / 2, canvas.height / 2);

      }
      
      function hasGridSquareBeenClicked(gridX, gridY) {
         	   for(var n = 0; n < filledGridX.length; n++) {
         	   		var clickedGridX = filledGridX[n];
         	   		var clickedGridY = filledGridY[n];
								if ( clickedGridX == gridX && clickedGridY == gridY ) {
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
        
        if ( !hasGridSquareBeenClicked(gridX, gridY) ) {
        	filledGridX.push(gridX);
        	filledGridY.push(gridY);
        }      
      
      }