var gl;

var shaderProgram;

var inputHandler;

var panoImage;
var panoTexture;

var sphere;

var inFov;
var fov;

var iOS;

var motionCheck = null;


function setTexture(sel)
{
	initTexture(sel, render);
}

function setTextureFromImg(img)
{
	console.log(img);
	initTexture(img, render);
}

function setFov(v)
{
	inFov = 30.0 + ((1.0 - v/100.0) * 90.0);
	render();
}

var imgSrc;
function initPano(img, w, h)
{
	iOS = ( navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true : false );
	inFov = 30.0 + ((1.0 - 40.0/100.0) * 90.0);
	
	// Create canvas and setup GL
	var canvas = document.getElementById("pano-canvas");
	canvas.width = w;
	canvas.height = h;
	try {
		gl = canvas.getContext("experimental-webgl");	// gl = canvas.getContext("webgl");
		gl.viewportWidth = w
		gl.viewportHeight = h;
	} catch (e) { alert("Could not initialise WebGL"); }
	gl.clearColor(1.0, 0.0, 0.0, 1.0);
	gl.enable(gl.DEPTH_TEST);

	/* Mouse and keyboard interaction functions */
	canvas.addEventListener('mousedown', mouseDown, true);
	canvas.addEventListener('touchstart', touchDown, true);
	canvas.addEventListener('mousemove', mouseMove, true);
	canvas.addEventListener('touchmove', touchMove, true);
	canvas.addEventListener('mouseup', mouseUp, true);	
	canvas.addEventListener('touchend', mouseUp, true);	
	
	inputHandler  = new InputHandler(); 
	sphere = new Sphere();

	imgSrc = img;
	loadShaders(start);
}

function start()
{
	// Create the shader
	shaderProgram = initShaders();
	setTexture(imgSrc);
}

function render() 
{
	
	// adjust render area to the canvas
	gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
	
	// erase the image
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	// set perspective projection
	fov = (inFov * (100.0/100.0)) * (gl.viewportHeight/gl.viewportWidth);
	mat4.perspective(fov, gl.viewportWidth / gl.viewportHeight, 0.1, 1000.0, pMatrix);

	// set viewing transformation
    inputHandler.setMatrix(mvMatrix);
  
	gl.useProgram(shaderProgram);
	  
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, panoTexture);
	gl.uniform1i(gl.getUniformLocation(shaderProgram, "uSampler"), 0);	
	setMatrixUniforms(shaderProgram);
	
	sphere.draw(shaderProgram);
}




/*----------------------------------------------------------------------
 * Matrix utility functions
 *---------------------------------------------------------------------*/
var mvMatrix = mat4.create();
var mvMatrixStack = [];
var pMatrix = mat4.create();

function mvPushMatrix() {
	var copy = mat4.create();
	mat4.set(mvMatrix, copy);
	mvMatrixStack.push(copy);
}

function mvPopMatrix() {
	if (mvMatrixStack.length == 0) {
		throw "Invalid popMatrix!";
	}
	mvMatrix = mvMatrixStack.pop();
}

function setMatrixUniforms( shaderPgm ) {
	gl.uniformMatrix4fv(shaderPgm.pMatrixUniform, false, pMatrix);
	gl.uniformMatrix4fv(shaderPgm.mvMatrixUniform, false, mvMatrix);
}

function degToRad(degrees) {
	return degrees * Math.PI / 180;
}

