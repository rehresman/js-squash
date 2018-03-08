//javascript functions


function progressAnimation() {
	//array of the items to be animated first

	var progress = document.getElementsByClassName("animate");
	var numProgresss = progress.length;
	var progressId = setInterval(progressFrame, 16);
	var progressIndex = 0;

	function progressFrame() {
		if (progressIndex > 100) {
			clearInterval(progressId);
		}
		else {
			for (var i = 0; i < numProgresss; i++) {
				progress[i].style.width = progressIndex + "%";
			}
			progressIndex++;
		}
	}
}

function bubbleAnimation() {
	//array of the items to be animated first

	var bubbleId = setInterval(bubbleFrame, 5);
	var bubbleIndex = 0;
	var bubble = document.getElementById("circle");

	function bubbleFrame() {
		if (bubbleIndex > 100) {
			clearInterval(bubbleId);
		}
		else {
			bubble.style.left = 50 - (bubbleIndex)/2 + "%";
			bubble.style.top = 50 - (bubbleIndex)/2 + "%";
			bubble.style.width = bubbleIndex + "%";
			bubble.style.height = bubbleIndex + "%";
		}
		bubbleIndex++;
	}
}


function isOnViewportTopEdge(element) {
	var bounding = element.getBoundingClientRect();
	return (bounding.top <= 0);
}

function isOnViewportRightEdge(element) {
	var bounding = element.getBoundingClientRect();
	return (bounding.right >= 
		(window.innerWidth || document.body.clientHeight || 
			document.documentElement.clientWidth))
}

function isOnViewportLeftEdge(element) {
	var bounding = element.getBoundingClientRect();
	return (bounding.left <= 0);
}

function isOnViewportBottomEdge(element) {
	var bounding = element.getBoundingClientRect();
	return (bounding.bottom >= (window.innerHeight || document.body.clientHeight || 
			document.documentElement.clientHeight))
}

//this function is based on a similar one by Chris Ferdinandi - gomakethings.com
function isInViewport(element) {
	var bounding = element.getBoundingClientRect();
	return (
		bounding.top >= 0 && 
		bounding.left >= 0 && 
		bounding.bottom <= 
		(window.innerHeight || document.body.clientHeight || 
			document.documentElement.clientHeight) &&
		bounding.right <= 
		(window.innerWidth || document.body.clientHeight || 
			document.documentElement.clientWidth)
		);
}

//returns true if the active element is sitting on top of the passive element.
//offset is to calibrate relatively positioned elements.
//offset for the ball is 50.
function isOnElementTop(activeElement,passiveElement,hitbox) {
	var aInfo = activeElement.getBoundingClientRect();
	var pInfo = passiveElement.getBoundingClientRect();
	return (
		(aInfo.bottom >= pInfo.top - hitbox) && 
		(aInfo.right >= pInfo.left) && 
		(aInfo.left <= pInfo.right));
}

//on the passive element's left edge..
function isOnElementLeftEdge(activeElement,passiveElement) {
	var aInfo = activeElement.getBoundingClientRect();
	var pInfo = passiveElement.getBoundingClientRect();
	return (
		((aInfo.top >= pInfo.top) && 
		(aInfo.top <= pInfo.bottom)) && 
		(aInfo.right >= pInfo.left) &&
		aInfo.left <= pInfo.left);
			}
//on the passive element's right edge
function isOnElementRightEdge(activeElement,passiveElement) {
	var aInfo = activeElement.getBoundingClientRect();
	var pInfo = passiveElement.getBoundingClientRect();
	return (
		((aInfo.top <= pInfo.bottom) && 
		(aInfo.bottom >= pInfo.top)) && 
		(aInfo.left <= pInfo.right) &&
		(aInfo.right >= pInfo.right));
			}

function playPlatform() {
	//variables
	var quitButton = document.getElementById("quitButton");
	var platformArray = [];
	var platform = { body: document.getElementById("platform"),
		direction: null,
		moveId: null,
		speed: 2,
		frameRate: 10
		};
	const unitSlice = -2;

	//functions

	// e is the event, which is a key press.  The arrow keys correspond to the 
	// direction variable.  So we're comparing "e" and "direction" together. The 
	// moveId is the id of the setInterval animation.
	platform.keyHandler = function (e) {
		//subroutines
		platform.changeDirection = function (e) {
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

		platform.movePlatform = function (left,top) {
			//subroutines 
			platform.frame = function(left,top) {
				return function () {
					var platformStyle = this.body.style;
					var sTop = parseInt(platformStyle.top.slice(0,unitSlice));
					var sLeft = parseInt(platformStyle.left.slice(0,unitSlice)) ;
					platformStyle.top = this.speed * top + sTop + "px";
					platformStyle.left = this.speed * left +  sLeft + "px";
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
			this.moveId = setInterval(platform.frame(left,top).bind(this), 
				platform.frameRate);
		}

		//implementation
		switch (e.keyCode) {
			case 37:
				this.changeDirection(e);
				console.log("left");
				this.movePlatform(-1,0);
				break;
			case 39:
				this.changeDirection(e);
				console.log("right");
				this.movePlatform(1,0);
			default:
				break;
		}
	}
	
	platform.quitPlatform = function () {
		clearInterval(this.moveId);
		this.moveId = null;
		this.body.classList.remove("platform");
		window.removeEventListener("keydown", keyWrapper, false);
		//quitButton is coming in as a closure variable
		quitButton.classList.remove("is-active");

	}

	//implementation of Platform!
	platform.body.classList.add("platform");
	var keyWrapper = platform.keyHandler.bind(platform);
	window.addEventListener("keydown", keyWrapper, false);
	quitButton.classList.add("is-active");
	quitButton.onclick = platform.quitPlatform.bind(platform);
}

function bounceAround() {
	const precision = 10000;
	const unitSlice = -2;
	const angleFlipper = 3;
	const twoPi = 2 * Math.PI;
	var screenTop = window.screenTop;
	var screenLeft = window.screenLeft;
	var platform = document.getElementById("platform");
	var bouncyBall = { body: document.getElementById("bouncyBall"),
		angle: Math.round(precision * 3 * Math.PI / (4))/ precision,
		speed: 3,
		frameRate: 10,
		bouncingLeft: false,
		bouncingTop: false,
		score: 0
		}

	bouncyBall.move = function() {
		bouncyBall.frame = function(platform) {
			bouncyBall.frameInner = function() {
			this.body.style.top = (this.speed) * Math.round((-precision) * 
				Math.sin(this.angle))/precision + 
				parseFloat(this.body.style.top.slice(0,unitSlice)) + "px";
			this.body.style.left = (this.speed) * (Math.round((-precision) * 
				Math.cos(this.angle))/precision) + 
				parseFloat(this.body.style.left.slice(0,unitSlice)) + "px";
			}

			//implementation

			//vertical bounce
			if (isOnViewportTopEdge(this.body)) {
				//if it's not already bouncing, then bounce!
				//this is for issues with imperfect boundaries (resizing).
				//we only want to readjust the angle once per bounce.
				if (this.bouncingTop == false) {
					this.angle = Math.round(precision * (-1) * this.angle) 
						/ precision; 
					this.bouncingTop = true;
					if (platform.classList.contains("platform")) {
						document.getElementById("score").innerHTML = this.score++;
					}
				}	
			}
			else if (isOnViewportBottomEdge(this.body)) {
				//if it's not already bouncing, then bounce!
				//this is for issues with imperfect boundaries (resizing).
				//we only want to readjust the angle once per bounce.
				if (this.bouncingTop == false && 
					!(platform.classList.contains("platform"))) {
					this.angle = Math.round(precision * (-1) * this.angle) 
						/ precision; 
					this.bouncingTop = true;
				}	
				else if (platform.classList.contains("platform")) {
					this.bouncingTop = true;
					document.body.style.backgroundColor = "black";
					document.body.style.color = "yellow";
				}

			}
			else {
				this.bouncingTop = false;
			}

			//horizontal bounce
			if (isOnViewportLeftEdge(this.body) ||
			 		 isOnViewportRightEdge(this.body)) {
				if (this.bouncingLeft == false) {
					while (this.angle > twoPi) {
						this.angle = this.angle - twoPi;
					}
					while (this.angle < -twoPi) {
						this.angle = this.angle + twoPi;
					}
					this.angle = Math.round(this.angle * angleFlipper *precision) /
						precision; 
					this.bouncingLeft = true;
				}	 
			}
			else {
				this.bouncingLeft = false;
			}

			//platform bounce
			if (platform.classList.contains("platform")) {
				if (isOnElementTop(this.body,platform,-1)) {
					console.log("platform top hit!");
					//if it's not already bouncing, then bounce!
					//this is for issues with imperfect boundaries (resizing).
					//we only want to readjust the angle once per bounce.
					if (this.bouncingTop == false) {
						this.angle = Math.round(precision * (-1) * this.angle) 
							/ precision; 
						this.bouncingTop = true;
					}	
				}

				if (isOnElementLeftEdge(this.body,platform)) {
					console.log("platform left hit!");
					if (this.bouncingLeft == false) {
						while (this.angle > twoPi) {
							this.angle = this.angle - twoPi;
						}
						while (this.angle < -twoPi) {
							this.angle = this.angle + twoPi;
						}
						this.angle = Math.round(this.angle * angleFlipper * precision) /
							precision; 
						this.bouncingLeft = true;
					}	
				}

				if (isOnElementRightEdge(this.body,platform)) {
					console.log("platform right hit!");
					if (this.bouncingLeft == false) {
						while (this.angle > twoPi) {
							this.angle = this.angle - twoPi;
						}
						while (this.angle < -twoPi) {
							this.angle = this.angle + twoPi;
						}
						this.angle = Math.round(this.angle * angleFlipper * precision) /
							precision; 
						this.bouncingLeft = true;
					}	
				}
			}

			bouncyBall.frameInner();
		}

		//implementation
		var intervalId = setInterval(function (){
			bouncyBall.frame(platform)}.bind(bouncyBall), bouncyBall.frameRate);
	}

	bouncyBall.body.style.top = "0px";
	bouncyBall.body.style.left = "0px";
	playPlatform();
	bouncyBall.move();
}

progressAnimation();
setTimeout(bubbleAnimation, 750);


