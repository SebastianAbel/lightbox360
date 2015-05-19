function TextureLoader(gl)
{
	this.gl = gl;
	this.iOS = ( navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true : false );
	
	this.$videoElement = $('<video></video>');
    this.$videoElement.hide();

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


TextureLoader.prototype.initTextureFromVideo = function(video, fps, callback) {
	var self = this;
	var texture = this.gl.createTexture();

	this.$videoElement.attr('src', video);
	this.$videoElement.attr('loop', true);
	this.playing = false;
	
	this.videoUpdate = setInterval(function() {
		src = self.$videoElement.get(0);
		self.handleTextureLoaded (src, texture, callback);
	}
	, 1000.0/fps);	
}


TextureLoader.prototype.play = function() {
	if (this.videoUpdate != null)
	{
		this.$videoElement.get(0).play();
		this.playing = true;
	}
}


TextureLoader.prototype.pause = function() {
	if (this.videoUpdate != null)
	{
		this.$videoElement.get(0).pause();
		this.playing = false;
	}
}


TextureLoader.prototype.isPlaying = function() {
	return (this.videoUpdate != null) && (this.playing);
}


TextureLoader.prototype.stopTextureFromVideo = function(video, callback) {
	if (this.videoUpdate != null)
	{
		clearInterval(this.videoUpdate);
		this.videoUpdate = null;
		
		this.$videoElement.get(0).pause();
		this.$videoElement.attr('src', null);
		
		this.playing = false;
	}
}

TextureLoader.prototype.isUpdatingVideo = function()
{
	return (this.videoUpdate != null);
}


TextureLoader.prototype.handleTextureLoaded = function(src, texture, callback) {
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
		if (!isPowerOfTwo(src.width) || !isPowerOfTwo(src.height)) {
			// Scale up the texture to the next highest power of two dimensions.
			var canvas = document.createElement("canvas");
			canvas.width = nextHighestPowerOfTwo(src.width);
			while (canvas.width > 2048)
				canvas.width /= 2;
			
			canvas.height = nextHighestPowerOfTwo(src.height);
			while (canvas.height > 2048)
				canvas.height /= 2;
			
			var ctx = canvas.getContext("2d");
			ctx.drawImage(src, 0, 0, canvas.width, canvas.height);
			src = canvas;
		}
	}
	
	this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, src);
	this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
	this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
	this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
	this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
	this.gl.bindTexture(this.gl.TEXTURE_2D, null);
	
	if (callback != null)
			callback(texture);
}


 
