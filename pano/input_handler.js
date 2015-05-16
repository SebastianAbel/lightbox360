var dragging = false;

function mouseDown(event) {
	dragging = true;
	
	console.log("mouse");
	
	if (motionCheck != null)
	{
		clearInterval(motionCheck);
		motionCheck = null;
	}
	
	var canvas = document.getElementById('pano-canvas');
	var rect = canvas.getBoundingClientRect();
	
	var scale = 800.0/canvas.width;
	
	inputHandler.startDragging((event.clientX - rect.left)*scale, (event.clientY - rect.top)*scale);
}

function touchDown(event) {
	dragging = true;
	
	if (motionCheck != null)
	{
		clearInterval(motionCheck);
		motionCheck = null;
	}
	
	event.preventDefault();
	
	var canvas = document.getElementById('pano-canvas');
	var rect = canvas.getBoundingClientRect();
	
	var scale = 800.0/canvas.width;
	
	inputHandler.startDragging((event.targetTouches[0].pageX - rect.left)*scale, (event.targetTouches[0].pageY - rect.top)*scale);
}


function mouseUp() {
	dragging = false;
	motionCheck = setInterval(checkAftermotion, 1000.0/60.0);
	
	inputHandler.stopDragging();
}

function checkAftermotion()
{
	inputHandler.checkAftermotion();
	render();
}


/* On a mouse drag, we'll re-render the scene, passing in
 * incremented angles in each time.  */
function mouseMove(event)
{
	if (dragging)
	{
		var canvas = document.getElementById('pano-canvas');
		var rect = canvas.getBoundingClientRect();
		var scale = 800.0/canvas.width;
		
		inputHandler.drag((event.clientX - rect.left)*scale, (event.clientY - rect.top)*scale);
		
		render();
	}
}


function touchMove(event)
{
	event.preventDefault();
            
	if (dragging)
	{
		var canvas = document.getElementById('pano-canvas');
		var rect = canvas.getBoundingClientRect();
		var scale = 800.0/canvas.width;
		
		inputHandler.drag((event.targetTouches[0].pageX - rect.left)*scale, (event.targetTouches[0].pageY - rect.top)*scale);
		
		render();
	}
}



function InputHandler()
{
	this.translateMat = mat4.create();
	mat4.identity(this.translateMat);
	mat4.translate(this.translateMat,[0,0,0]);	// camera
	this.rotateMat = mat4.create();
	mat4.identity(this.rotateMat);
	this.mouseX;
	this.mouseY;
	
	this.dx = 0;
	this.dy = 0;
	
	this.angleX = 0;
	this.angleY = 0;
}

InputHandler.prototype.setMatrix = function( tbTransform )
{
	mat4.multiply(this.translateMat, this.rotateMat, tbTransform);
}

InputHandler.prototype.startDragging = function ( mouseX, mouseY )
{
	
	this.mouseX = mouseX;
	this.mouseY = mouseY;
}

InputHandler.prototype.stopDragging = function ()
{
}


InputHandler.prototype.drag = function ( mouseX, mouseY )
{	
	var dx = this.mouseX - mouseX;
	var dy = this.mouseY - mouseY; // mouse Y axis is downward
	this.mouseX = mouseX;
	this.mouseY = mouseY;
	this.dx = dx;
	this.dy = dy;
	
	var scale = 0.25 * fov/90.0;
	this.angleX += (dx*scale);
	this.angleY += (dy*scale);
	if (this.angleY > 90)
	{
		this.angleY = 90;
	}
	else if (this.angleY < -90)
	{
		this.angleY = -90;
	}	
	

	var rotation = mat4.create();
	mat4.identity(rotation);
	
	mat4.rotate(rotation, degToRad(this.angleY), [1,0,0] );
	mat4.rotate(rotation, degToRad(this.angleX), [0,1,0] );  // [-dy,dx,0] is perpendicular to [dx,dy,0]
	
	this.rotateMat = rotation;
	
}


InputHandler.prototype.checkAftermotion = function ( )
{		
	this.dx *= 0.95;
	this.dy *= 0.95;
	
	if ((Math.abs(this.dx) < 0.01) && (Math.abs(this.dy) < 0.01))
	{
		clearInterval(motionCheck);
		motionCheck = null;
	}
	
	var dx = this.dx;
	var dy = this.dy;
	
	
	var scale = 0.25 * fov/90.0;
	this.angleX += (dx*scale);
	this.angleY += (dy*scale);
	if (this.angleY > 90)
	{
		this.angleY = 90;
	}
	else if (this.angleY < -90)
	{
		this.angleY = -90;
	}	
	

	var rotation = mat4.create();
	mat4.identity(rotation);
	
	mat4.rotate(rotation, degToRad(this.angleY), [1,0,0] );
	mat4.rotate(rotation, degToRad(this.angleX), [0,1,0] );  // [-dy,dx,0] is perpendicular to [dx,dy,0]
	
	this.rotateMat = rotation;
	
}
