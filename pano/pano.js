function Pano() {	
	
	this.fovScaleDefault = 40.0;
	
	this.inFov = 30.0 + ((1.0 - this.fovScaleDefault/100.0) * 90.0);
	this.fov = this.inFov;
	
	this.mvMatrix = mat4.create();
	this.pMatrix = mat4.create();
	this.texture = null;
}

Pano.prototype.init = function(canvas) {	
	var self = this;
	
	this.canvas = canvas;
	try {
		this.gl = canvas.getContext("experimental-webgl");	// gl = canvas.getContext("webgl");
		this.setSize(canvas.width, canvas.height);
	} catch (e) { 
		this.available = false;
		return;
	}
	
	this.available = true;
	
	// global gl-settings
	this.gl.clearColor(1.0, 0.0, 1.0, 1.0);
	this.gl.enable(this.gl.DEPTH_TEST);
	
	this.fov = (this.inFov * (100.0/100.0)) * (this.gl.viewportHeight/this.gl.viewportWidth);

	this.inputHandler  = new InputHandler(canvas, this); 
	this.inputHandler.setFov(this.fov);
	this.sphere = new Sphere(this.gl, 32, 32);
	
	var shaderLoader = new ShaderLoader(this.gl, "shaders/unlit_texture.vs", "shaders/unlit_texture.fs");
	shaderLoader.loadShaders(function() {
		self.shaderProgram = shaderLoader.initShaders();
		self.render();
	});
}

Pano.prototype.isAvailable = function()
{
	return this.available;
}

Pano.prototype.setSize = function(width, height)
{
	this.width = width;
	this.height = height;
	
	this.canvas.width = width;
	this.canvas.height = height;
				
	this.gl.viewportWidth = width
	this.gl.viewportHeight = height;
	
	this.fov = (this.inFov * (100.0/100.0)) * (this.gl.viewportHeight/this.gl.viewportWidth);
	if (this.inputHandler != null)
	{
		this.inputHandler.setFov(this.fov);
	}
	this.render();
}

Pano.prototype.setImage = function(image)
{
	var self = this;
	this.texture = null;
	
	this.setFovScale(this.fovScaleDefault);
	this.inputHandler.setFov(this.fov);
	self.inputHandler.reset();
	
	var textureLoader = new TextureLoader(this.gl);
	textureLoader.initTextureFromImage(image, function(texture) {
		self.texture = texture;
		self.render();
	});
}


Pano.prototype.setFovScale = function(v)
{
	this.inFov = 30.0 + ((1.0 - v/100.0) * 90.0);
	this.fov = (this.inFov * (100.0/100.0)) * (this.gl.viewportHeight/this.gl.viewportWidth);
	this.inputHandler.setFov(this.fov);
	this.render();
}

Pano.prototype.getFovScale = function()
{
	return ((this.inFov - 30.0)/90.0 - 1.0) * -100.0;
}


Pano.prototype.render = function() 
{
	if (this.shaderProgram == null)
		return;
				
	// adjust render area to the canvas
	this.gl.viewport(0, 0, this.gl.viewportWidth, this.gl.viewportHeight);
	
	// erase the image
	this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

	if (this.texture == null)
		return;

	// set perspective projection
	mat4.perspective(this.fov, this.gl.viewportWidth / this.gl.viewportHeight, 0.1, 10.0, this.pMatrix);

	// set viewing transformation
    this.inputHandler.setMatrix(this.mvMatrix);
  
	this.gl.useProgram(this.shaderProgram);
	  
	this.gl.activeTexture(this.gl.TEXTURE0);
	this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
	this.gl.uniform1i(this.gl.getUniformLocation(this.shaderProgram, "uSampler"), 0);	
	
	this.gl.uniformMatrix4fv(this.shaderProgram.pMatrixUniform, false, this.pMatrix);
	this.gl.uniformMatrix4fv(this.shaderProgram.mvMatrixUniform, false, this.mvMatrix);
	
	this.sphere.draw(this.shaderProgram);
}

Pano.prototype.fullscreen = function()
{
	var self = this;
	var setToFull = false;
	/*
	if (!document.fullscreenElement &&    // alternative standard method
      	!document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement )
   	{  
      	// current working methods
      
      
	    if (this.canvas.requestFullscreen)
	    {
	    	this.canvas.requestFullscreen();
	    	setToFull = true;
	    }
	    else if (this.canvas.msRequestFullscreen)
	    {
	    	this.canvas.msRequestFullscreen();
	    	setToFull = true;
	    }
	    else if (this.canvas.mozRequestFullScreen)
	    {
	    	this.canvas.mozRequestFullScreen();
	    	setToFull = true;
	    }
	    else if (this.canvas.webkitRequestFullscreen)
	    {
	    	this.canvas.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
	    	setToFull = true;
	    }
   
	  	var normalWidth = this.width;
	  	var normalHeight = this.height;
	  	
	  	this.setSize(window.innerWidth, window.innerHeight);
		if (setToFull)
		{
			var fsCheck = setInterval(function() {
				if (!document.fullscreenElement &&    // alternative standard method
		     		!document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement )
		  			{		
			   		self.setSize(normalWidth, normalHeight);
					clearInterval(fsCheck);
					self.render(); 
		  			}
			}, 1000.0/30.0);
		}
		this.render();    
   	}
   	*/
   	return setToFull;
}

window['Pano'] = Pano; // <-- Constructor
Pano.prototype['isAvailable'] = Pano.prototype.isAvailable;
Pano.prototype['init'] = Pano.prototype.init;
Pano.prototype['setSize'] = Pano.prototype.setSize;
Pano.prototype['setImage'] = Pano.prototype.setImage;
Pano.prototype['fullscreen'] = Pano.prototype.fullscreen;
Pano.prototype['setFovScale'] = Pano.prototype.setFovScale;
Pano.prototype['getFovScale'] = Pano.prototype.getFovScale;