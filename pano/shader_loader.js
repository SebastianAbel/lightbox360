function ShaderLoader(gl, vs, fs)
{
	this.gl = gl;
	this.vs = vs;
	this.fs = fs;
	this.loadedShaders = [null, null];
}

ShaderLoader.prototype.loadShaders = function(callback)
{
	var self = this;
	var fl = new FileLoader();
	fl.loadFiles([this.vs, this.fs], function (shaderText)
	{		
		self.loadedShaders[0] = shaderText[0];
		self.loadedShaders[1] = shaderText[1];
		callback();
	},
	function (url)
	{
    	alert('Failed to download "' + url + '"');
	});
}


ShaderLoader.prototype.initShaders = function()
{
	var vertexShader = this.gl.createShader(this.gl.VERTEX_SHADER);
	this.gl.shaderSource(vertexShader, this.loadedShaders[0]);
	this.gl.compileShader(vertexShader);
	if (!this.gl.getShaderParameter(vertexShader, this.gl.COMPILE_STATUS))
	{
		alert(this.gl.getShaderInfoLog(vertexShader));
		return null;
	}
	
	var fragmentShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
  	this.gl.shaderSource(fragmentShader, this.loadedShaders[1]);
	this.gl.compileShader(fragmentShader);

	if (!this.gl.getShaderParameter(fragmentShader, this.gl.COMPILE_STATUS)) {
		alert(this.gl.getShaderInfoLog(fragmentShader));
		return null;
	}
  
	// Create the shader program
	
	shaderPgm = this.gl.createProgram();
	this.gl.attachShader(shaderPgm, vertexShader);
	this.gl.attachShader(shaderPgm, fragmentShader);
	this.gl.linkProgram(shaderPgm);
	
	// If creating the shader program failed, alert
	
	if (!this.gl.getProgramParameter(shaderPgm, this.gl.LINK_STATUS))
	{
		alert("Unable to initialize the shader program.");
	}
		
	shaderPgm.vertexPositionAttribute = this.gl.getAttribLocation(shaderPgm, "aVertexPosition");
	this.gl.enableVertexAttribArray(shaderPgm.vertexPositionAttribute);
	
	shaderPgm.textureCoordAttribute = this.gl.getAttribLocation(shaderPgm, "aTextureCoord");
	this.gl.enableVertexAttribArray(shaderPgm.textureCoordAttribute);
	
	shaderPgm.pMatrixUniform = this.gl.getUniformLocation(shaderPgm, "uPMatrix");
	shaderPgm.mvMatrixUniform = this.gl.getUniformLocation(shaderPgm, "uMVMatrix");
	
	return shaderPgm;
}





