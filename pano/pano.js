function Pano() {	
	this.inFov = 30.0 + ((1.0 - 40/100.0) * 90.0);
	this.fov = this.inFov;
	
	this.mvMatrix = mat4.create();
	this.pMatrix = mat4.create();
	this.texture = null;
}

Pano.prototype.init = function(canvas) {	
	var self = this;
	
	try {
		this.gl = canvas.getContext("experimental-webgl");	// gl = canvas.getContext("webgl");
		this.setSize(canvas.width, canvas.height);
	} catch (e) { alert("Could not initialise WebGL"); }
	
	// global gl-settings
	this.gl.clearColor(1.0, 0.0, 1.0, 1.0);
	this.gl.enable(this.gl.DEPTH_TEST);
	
	this.fov = (this.inFov * (100.0/100.0)) * (this.gl.viewportHeight/this.gl.viewportWidth);

	this.inputHandler  = new InputHandler(canvas, this); 
	this.inputHandler.setFov(this.fov);
	this.sphere = new Sphere(this.gl);
	
	var shaderLoader = new ShaderLoader(this.gl, "pano/shader/unlit_texture.vs", "pano/shader/unlit_texture.fs");
	shaderLoader.loadShaders(function() {
		self.shaderProgram = shaderLoader.initShaders();
		self.render();
	});
}

Pano.prototype.setSize = function(width, height)
{
	this.gl.viewportWidth = width
	this.gl.viewportHeight = height;
}

Pano.prototype.setImage = function(image)
{
	var self = this;
	this.texture = null;
	
	var textureLoader = new TextureLoader(this.gl);
	textureLoader.initTextureFromImage(image, function(texture) {
		self.texture = texture;
		self.inputHandler.reset();
		self.render();
	});
}


Pano.prototype.setFov = function(v)
{
	this.inFov = 30.0 + ((1.0 - v/100.0) * 90.0);
	this.fov = (this.inFov * (100.0/100.0)) * (this.gl.viewportHeight/this.gl.viewportWidth);
	this.inputHandler.setFov(this.fov);
	this.render();
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
