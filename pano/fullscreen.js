var fsCheck;

function checkFullscreen()
{
	if (!document.fullscreenElement &&    // alternative standard method
      	!document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement )
   	{
   		var canvas = document.getElementById('pano-canvas');
   		
   		canvas.width = 800;
		canvas.height = 600;
	
		gl.viewportWidth = canvas.width;
		gl.viewportHeight = canvas.height; 
		
		clearInterval(fsCheck);
		
		render(); 
   	}
}


function fullscreen()
{
	
	if (!document.fullscreenElement &&    // alternative standard method
      	!document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement )
   	{  
    	var canvas = document.getElementById('pano-canvas');  
      	
      	// current working methods
      
      
	    if (canvas.requestFullscreen)
	    {
	    	canvas.requestFullscreen();
	    }
	    else if (canvas.msRequestFullscreen)
	    {
	    	canvas.msRequestFullscreen();
	    }
	    else if (canvas.mozRequestFullScreen)
	    {
	    	canvas.mozRequestFullScreen();
	    }
	    else if (canvas.webkitRequestFullscreen)
	    {
	    	canvas.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
	    }
	  
		canvas.width  = window.innerWidth;
		canvas.height = window.innerHeight;
	
		gl.viewportWidth = canvas.width;
		gl.viewportHeight = canvas.height; 
		
		fsCheck = setInterval(checkFullscreen, 1000.0/30.0);
		
		render();  
   	}     
}
