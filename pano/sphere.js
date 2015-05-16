
function Sphere (gl) 
{
	this.gl = gl;
	
	var vertices_s = [];
	var colors_s = [];
	var tri_s = [];
	var tex_s = [];
	
	var size = 512.0;
	var x, y;
	var v = 0;
	for (y = 0; y < 32; y++)
	{
		var rad = Math.sin(y * Math.PI/31.0);
		var py = Math.cos(y * Math.PI/31.0);
		for (x = 0; x < 32; x++)
		{
			var px = Math.sin(x * 2.0*Math.PI/31.0);
			var pz = Math.cos(x * 2.0*Math.PI/31.0);
			
			vertices_s[v*3+0] = px*rad * size;
			vertices_s[v*3+1] = py * size;
			vertices_s[v*3+2] = pz*rad * size;
			
			colors_s[v*4+0] = (px+1.0)*0.5;
			colors_s[v*4+1] = (py+1.0)*0.5;
			colors_s[v*4+2] = (pz+1.0)*0.5;
			colors_s[v*4+3] = 1.0;
			
			tex_s[v*2+0] = 1.0-x/31.0;
			tex_s[v*2+1] = y/31.0;
			
			v++;
		}
	}
	
	var t = 0;
	for (y = 0; y < 31; y++)
	{
		for (x = 0; x < 31; x++)
		{			
			tri_s[t*3+0] = y*32 + x;
			tri_s[t*3+1] = y*32 + (x+1);
			tri_s[t*3+2] = (y+1)*32 + x;
			
			t++
			
			tri_s[t*3+0] = y*32 + (x+1);
			tri_s[t*3+1] = (y+1)*32 + (x+1);
			tri_s[t*3+2] = (y+1)*32 + x;
			
			t++;
		}
	}
	
	this.vertexBuffer = this.gl.createBuffer();
	this.gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer );
	this.gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices_s), this.gl.STATIC_DRAW);
	this.vertexBuffer.itemSize = 3;
	this.vertexBuffer.numItems = 32*32;
		
	this.uvBuffer = this.gl.createBuffer();
  	this.gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
  	this.gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tex_s), this.gl.STATIC_DRAW);
  	this.uvBuffer.itemSize = 2;
	this.uvBuffer.numItems = 32*32;
	
	// Triangles
	this.triangles = gl.createBuffer();
	this.gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.triangles);
	this.gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(tri_s), this.gl.STATIC_DRAW);
    this.triangles.numItems = 31*31*2*3;
}

Sphere.prototype.draw = function( shaderPgm )
{	
	// Vertex positions 
	this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
	this.gl.vertexAttribPointer(shaderPgm.vertexPositionAttribute, this.vertexBuffer.itemSize, this.gl.FLOAT, false, 0, 0);


  	this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.uvBuffer);
  	this.gl.vertexAttribPointer(shaderPgm.textureCoordAttribute, 2, this.gl.FLOAT, false, 0, 0);

	
	// Draw elements
	this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.triangles);
	this.gl.drawElements(this.gl.TRIANGLES, this.triangles.numItems, this.gl.UNSIGNED_SHORT, 0);
}



