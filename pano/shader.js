var loadedShaders = [null, null];

function loadShaders(callback)
{
	loadFiles(["pano/shader/unlit_texture.vs", "pano/shader/unlit_texture.fs"], function (shaderText)
	{		
		loadedShaders[0] = shaderText[0];
		loadedShaders[1] = shaderText[1];
		callback();
	},
	function (url)
	{
    	alert('Failed to download "' + url + '"');
	});
}


function initShaders()
{
	var vertexShader = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(vertexShader, loadedShaders[0]);
	gl.compileShader(vertexShader);
	if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS))
	{
		alert(gl.getShaderInfoLog(vertexShader));
		return null;
	}
	
	var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  	gl.shaderSource(fragmentShader, loadedShaders[1]);
	gl.compileShader(fragmentShader);

	if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
		alert(gl.getShaderInfoLog(fragmentShader));
		return null;
	}
  
	// Create the shader program
	
	shaderPgm = gl.createProgram();
	gl.attachShader(shaderPgm, vertexShader);
	gl.attachShader(shaderPgm, fragmentShader);
	gl.linkProgram(shaderPgm);
	
	// If creating the shader program failed, alert
	
	if (!gl.getProgramParameter(shaderPgm, gl.LINK_STATUS))
	{
		alert("Unable to initialize the shader program.");
	}
		
	shaderPgm.vertexPositionAttribute = gl.getAttribLocation(shaderPgm, "aVertexPosition");
	gl.enableVertexAttribArray(shaderPgm.vertexPositionAttribute);
	
	shaderPgm.textureCoordAttribute = gl.getAttribLocation(shaderPgm, "aTextureCoord");
	gl.enableVertexAttribArray(shaderPgm.textureCoordAttribute);
	
	shaderPgm.pMatrixUniform = gl.getUniformLocation(shaderPgm, "uPMatrix");
	shaderPgm.mvMatrixUniform = gl.getUniformLocation(shaderPgm, "uMVMatrix");
	
	return shaderPgm;
}





