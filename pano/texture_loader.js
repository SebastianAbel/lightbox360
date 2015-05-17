function TextureLoader(gl)
{
	this.gl = gl;
	this.iOS = ( navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true : false );
}


TextureLoader.prototype.initTexture = function(texturename, callback) {
	var self = this;
	
	var texture = this.gl.createTexture();
	var image = new Image();
	image.onload = function() { 
		self.handleTextureLoaded(image, texture, callback);
	}
	image.src = texturename;
}


TextureLoader.prototype.initTextureFromImage = function(image, callback) {
	var texture = this.gl.createTexture();
	this.handleTextureLoaded(image, texture, callback);
}


TextureLoader.prototype.handleTextureLoaded = function(image, texture, callback) {
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

	this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
	if (this.iOS)
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
	this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, image);
	
	this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
	this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
	this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
	this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
	this.gl.bindTexture(this.gl.TEXTURE_2D, null);
	
	if (callback != null)
			callback(texture);
}


 
