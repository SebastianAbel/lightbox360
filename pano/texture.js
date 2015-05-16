function initTexture(texturename, callback) {
  panoTexture = gl.createTexture();
  panoImage = new Image();
  panoImage.onload = function() { handleTextureLoaded(panoImage, panoTexture, callback); }
  panoImage.src = texturename;
}

function initTextureFromImage(img, callback) {
  panoTexture = gl.createTexture();
  panoImage = img;
  //panoImage.onload = function() { handleTextureLoaded(panoImage, panoTexture, callback); }
  //panoImage.src = texturename;
  
  handleTextureLoaded(panoImage, panoTexture, callback);
}

function handleTextureLoaded(image, texture, callback) {
  //console.log("handleTextureLoaded, image = " + image);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  
  if (iOS)
  {
	  if (!isPowerOfTwo(image.width) || !isPowerOfTwo(image.height)) {
	        // Scale up the texture to the next highest power of two dimensions.
	        var canvas = document.createElement("canvas");
	        canvas.width = nextHighestPowerOfTwo(image.width);
	        while (canvas.width > 2048)
	        	canvas.width /= 2;
	        
	        canvas.height = nextHighestPowerOfTwo(image.height);
	        while (canvas.height > 2048)
	        	canvas.height /= 2;
	        
	        var ctx = canvas.getContext("2d");
	        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
	        image = canvas;
	    }
  }
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.bindTexture(gl.TEXTURE_2D, null);
  
  if (callback != null)
  	callback();
}

function isPowerOfTwo(x) {
    return (x & (x - 1)) == 0;
}
 
function nextHighestPowerOfTwo(x) {
    --x;
    for (var i = 1; i < 32; i <<= 1) {
        x = x | x >> i;
    }

    return x + 1;
}