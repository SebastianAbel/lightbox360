function InputHandler(canvas, renderer)
{
	var self = this;
	
	this.dragging = false;
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
	this.fov = 0;
	this.renderer = renderer;
	this.canvas = canvas;
	
	/* Mouse and keyboard interaction functions */
	this.canvas.addEventListener('mousedown', function(event){
		self.dragging = true;
		if (self.motionCheck != null)
		{
			clearInterval(self.motionCheck);
			self.motionCheck = null;
		}
		
		var rect = self.canvas.getBoundingClientRect();		
		var scale = 800.0/self.canvas.width;
		
		self.startDragging((event.clientX - rect.left)*scale, (event.clientY - rect.top)*scale);
	}, true);
	
	
	this.canvas.addEventListener('mousemove', function(event) {
		if (self.dragging) {		
		
			var rect = self.canvas.getBoundingClientRect();
			var scale = 800.0/self.canvas.width;
		
			self.drag((event.clientX - rect.left)*scale, (event.clientY - rect.top)*scale);
			self.renderer.render();
		}
	}, true);
	
	this.canvas.addEventListener('mouseup', function() {
		self.dragging = false;
		self.motionCheck = setInterval(function() {
			self.aftermotion();
			self.renderer.render();
		}, 1000.0/60.0);
	}, true);	
	
	this.canvas.addEventListener('touchstart', function(event) {
		event.preventDefault();
		
		self.dragging = true;
	
		if (self.motionCheck != null)
		{
			clearInterval(self.motionCheck);
			self.motionCheck = null;
		}
		
		var rect = self.canvas.getBoundingClientRect();
		var scale = 800.0/self.canvas.width;
	
		self.startDragging((event.targetTouches[0].pageX - rect.left)*scale, (event.targetTouches[0].pageY - rect.top)*scale);
	}, true);
	
	this.canvas.addEventListener('touchmove', function(event) {	
		event.preventDefault();
            
		if (self.dragging)
		{
			var rect = self.canvas.getBoundingClientRect();
			var scale = 800.0/self.canvas.width;
			
			self.drag((event.targetTouches[0].pageX - rect.left)*scale, (event.targetTouches[0].pageY - rect.top)*scale);
			self.renderer.render();
		}
	}, true);
	
	this.canvas.addEventListener('touchend', function() {
		self.dragging = false;
		self.motionCheck = setInterval(function() {
			self.aftermotion();
			self.renderer.render();
		}, 1000.0/60.0);
	}, true);	
}

InputHandler.prototype.reset = function()
{
	this.dx = 0;
	this.dy = 0;
	
	this.angleX = 0;
	this.angleY = 0;
	
	this.rotateMat = mat4.create();
	mat4.identity(this.rotateMat);
}

InputHandler.prototype.setFov = function(fov)
{
	this.fov = fov;
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

InputHandler.prototype.drag = function (mouseX, mouseY )
{	
	var dx = this.mouseX - mouseX;
	var dy = this.mouseY - mouseY; // mouse Y axis is downward
	this.mouseX = mouseX;
	this.mouseY = mouseY;
	this.dx = dx;
	this.dy = dy;
	
	var scale = 0.25 * this.fov/90.0;
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
	
	mat4.rotate(rotation, this.angleY * Math.PI / 180, [1,0,0]);
	mat4.rotate(rotation, this.angleX * Math.PI / 180, [0,1,0]);
	
	this.rotateMat = rotation;
}

InputHandler.prototype.aftermotion = function ( )
{		
	this.dx *= 0.95;
	this.dy *= 0.95;
	
	if ((Math.abs(this.dx) < 0.01) && (Math.abs(this.dy) < 0.01))
	{
		clearInterval(this.motionCheck);
		this.motionCheck = null;
	}
	
	var dx = this.dx;
	var dy = this.dy;
	
	
	var scale = 0.25 * this.fov/90.0;
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
	
	mat4.rotate(rotation, this.angleY * Math.PI / 180, [1,0,0]);
	mat4.rotate(rotation, this.angleX * Math.PI / 180, [0,1,0]);
	
	this.rotateMat = rotation;
}
