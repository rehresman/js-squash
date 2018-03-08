function arrowKeyControl() {
	//variables
	var playButton = document.getElementById("playButton");
	var movableObject = { body: document.getElementById("movableObject"),
		direction: null,
		moveId: null,
		length: 1, 
		width: "615px"};
	const unitSlice = -2;

	//functions

	// e is the event, which is a key press.  The arrow keys correspond to the 
	// direction variable.  So we're comparing "e" and "direction" together. The 
	// moveId is the id of the setInterval animation.
	movableObject.keyHandler = function (e) {
		//subroutines
		movableObject.changeDirection = function (e) {
			if (this.direction != e) {
				e.preventDefault();
				if (this.moveId != null) {
				clearInterval(this.moveId);
				}
				this.direction = e;
			}
			//no need to change directions
			else {
				return;
			}
		}

		movableObject.move = function (left,top) {
			//subroutines 
			movableObject.frame = function(left,top) {
				return function () {
					var movableObjectStyle = this.body.style;
					var sTop = parseInt(movableObjectStyle.top.
						slice(0,unitSlice));
					var sLeft = parseInt(movableObjectStyle.left.
						slice(0,unitSlice));
					movableObjectStyle.top = top + sTop + "px";
					movableObjectStyle.left = left + sLeft + "px";
				}.bind(this);
			}

			//implementation
			if (this.body.style.top == "") {
				this.body.style.top = "0px";
			}
			if (this.body.style.left == "") {
				this.body.style.left = "0px";
			}
			//if (this.body.style.width == "") {
				this.body.style.left == "0px"
			//}
			this.moveId = setInterval(movableObject.frame(left,top).bind(this), 16);
		}

		//implementation
		switch (e.keyCode) {
			case 37:
				this.changeDirection(e);
				console.log("left");
				this.move(-1,0);
				break;
			case 38:
				this.changeDirection(e);
				console.log("up");
				this.move(0,-1);
				break;
			case 39:
				this.changeDirection(e);
				console.log("right");
				this.move(1,0);
				break;
			case 40:
				this.changeDirection(e);
				console.log("down");
				this.move(0,1);
				break;
			default:
				break;
		}
	}
	
	movableObject.quit = function () {
		clearInterval(this.moveId);
		this.moveId = null;
		window.removeEventListener("keydown", keyWrapper, false);
		//playButton is coming in as a closure variable
		playButton.innerHTML = "<h2>Want to move the blue box?</h2>";
		playButton.onclick = arrowKeyControl;
	}

	//implementation of movableObject!
	var keyWrapper = movableObject.keyHandler.bind(movableObject);
	window.addEventListener("keydown", keyWrapper, false);
	playButton.innerHTML = "<h1>(Quit)</h1>";
	playButton.onclick = movableObject.quit.bind(movableObject);
}