function initCanvas() {
	var canvas = document.querySelector('canvas');
	var context = canvas.getContext('2d');
	var imgObj = new Image();
	imgObj.src = 'images/grid.bmp';
	imgObj.onLoad = function() {
		context.drawImage(imgObj, 0, 0);
	};
	console.log(imgObj);
}

initCanvas();
