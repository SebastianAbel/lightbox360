
function Sphere (gl) 
{
	this.gl = gl;
	
	var segments_h = 32;
	var segments_v = 32;
	
	
	var vertices_s = [];
	var colors_s = [];
	var tri_s = [];
	var tex_s = [];
	
	for (var y = 0, v = 0; y < segments_v+1; y++)
	{
		var rad = Math.sin(y * Math.PI/segments_v);
		var py = Math.cos(y * Math.PI/segments_v);
		for (var x = 0; x < segments_h+1; x++, v++)
		{
			var px = Math.sin(x * 2.0*Math.PI/segments_h);
			var pz = Math.cos(x * 2.0*Math.PI/segments_h);
			
			vertices_s[v*3+0] = px*rad;
			vertices_s[v*3+1] = py;
			vertices_s[v*3+2] = pz*rad;
			
			colors_s[v*4+0] = (px+1.0)*0.5;
			colors_s[v*4+1] = (py+1.0)*0.5;
			colors_s[v*4+2] = (pz+1.0)*0.5;
			colors_s[v*4+3] = 1.0;
			
			tex_s[v*2+0] = 1.0-x/segments_h;
			tex_s[v*2+1] = y/segments_v;
		}
	}
	
	for (var y = 0, t = 0; y < segments_v; y++)
	{
		for (var x = 0; x < segments_h; x++, t++)
		{			
			tri_s[t*6+0] = y*(segments_h+1) + x;
			tri_s[t*6+1] = y*(segments_h+1) + (x+1);
			tri_s[t*6+2] = (y+1)*(segments_h+1) + x;
		
			
			tri_s[t*6+3] = y*(segments_h+1) + (x+1);
			tri_s[t*6+4] = (y+1)*(segments_h+1) + (x+1);
			tri_s[t*6+5] = (y+1)*(segments_h+1) + x;
		}
	}
	
	this.vertexBuffer = this.gl.createBuffer();
	this.gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
	this.gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices_s), this.gl.STATIC_DRAW);
	this.vertexBuffer.itemSize = 3;
	this.vertexBuffer.numItems = (segments_v+1)*(segments_h+1);
		
	this.uvBuffer = this.gl.createBuffer();
  	this.gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
  	this.gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tex_s), this.gl.STATIC_DRAW);
  	this.uvBuffer.itemSize = 2;
	this.uvBuffer.numItems = (segments_v+1)*(segments_h+1);
	
	this.triangles = gl.createBuffer();
	this.gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.triangles);
	this.gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(tri_s), this.gl.STATIC_DRAW);
    this.triangles.numItems = segments_v*segments_h*2*3;
}

Sphere.prototype.draw = function( shaderPgm )
{	
	this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
	this.gl.vertexAttribPointer(shaderPgm.vertexPositionAttribute, this.vertexBuffer.itemSize, this.gl.FLOAT, false, 0, 0);

  	this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.uvBuffer);
  	this.gl.vertexAttribPointer(shaderPgm.textureCoordAttribute, 2, this.gl.FLOAT, false, 0, 0);

	this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.triangles);
	this.gl.drawElements(this.gl.TRIANGLES, this.triangles.numItems, this.gl.UNSIGNED_SHORT, 0);
}



