/*global document,image, Image, int, alert*/

///////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////                              ////////////////////////////////////
/////////////////////////////////            GLOBALS           ////////////////////////////////////
/////////////////////////////////                              ////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////

var Direction = {
	Left: 0,
	Up: 1,
	Right: 2,
	Down: 3
};

//Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
var canvasSize = 500;
canvas.width = canvasSize;
canvas.height = canvasSize;
document.body.appendChild(canvas);


///////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////                              ////////////////////////////////////
/////////////////////////////////        INFRASTRUCTURE        ////////////////////////////////////
/////////////////////////////////                              ////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////

//Snakepart-class
function snakePart(x, y){
	this.x = x;
	this.y = y;
}

//Snake-class
function snake(size, nParts){
	var parts = [];
	this.numberOfStartParts = nParts;
	this.partSize = size;
	var dir;
	
	this.getPart = function(i){
		return parts[i];
	};
	
	this.setDir = function(d){
		this.dir = d;
	};
	
	this.createSnake = function(){
		parts.length = 0;
		
		var xs = 5;
		var ys = 5;
		
		for(var i = 0; i < this.numberOfStartParts; i++){
			var p = new snakePart(xs, ys);
			parts.push(p);
			xs++;
		}
	};
	
	this.update = function(grow){
		var p;
		switch(this.dir){
			case Direction.Left:
				if(parts[parts.length-1].x - 1 < 0){
					p = new snakePart((canvasSize-this.partSize)/this.partSize, parts[parts.length-1].y);
				}else{
					p = new snakePart(parts[parts.length-1].x - 1, parts[parts.length-1].y);
				}	
				break;
			case Direction.Up:
				if(parts[parts.length-1].y - 1 < 0){
					p = new snakePart(parts[parts.length-1].x, (canvasSize-this.partSize)/this.partSize);					
				}else{
					p = new snakePart(parts[parts.length-1].x, parts[parts.length-1].y - 1);
				}
				break;
			case Direction.Right:
				if(parts[parts.length-1].x + 1 >= canvasSize/this.partSize){
					p = new snakePart(0, parts[parts.length-1].y);	
				}else{
					p = new snakePart(parts[parts.length-1].x + 1, parts[parts.length-1].y);					
				}
				break;
			case Direction.Down:
				if(parts[parts.length-1].y + 1 >= canvasSize/this.partSize){
					p = new snakePart(parts[parts.length-1].x, 0);					
				}else{
					p = new snakePart(parts[parts.length-1].x, parts[parts.length-1].y + 1);
				}
				break;
			default:
				p = new snakePart(parts[parts.length-1].x + 1, parts[parts.length-1].y);				
		}
		parts.push(p);
		
		//Om inte tagit mat skall sista parten tas bort
		if(grow === false){
			parts.shift();
		}
	};
	
	this.render = function(){	
		for(var i = 0; i < parts.length; i++){
			ctx.fillStyle="#000000";
			ctx.fillRect(parts[i].x * this.partSize, parts[i].y * this.partSize, this.partSize, this.partSize);
		}
	};
	
	this.getLength = function(){
		return parts.length;
	}
	
	//Construct
	this.createSnake();
}

//Food-class
function food(size, min, max){
	var x;
	var y;
	this.size = size;
	this.min = min;
	this.max = Math.floormax;
	
	this.newFood = function(min, max){
		this.x = randomFromInterval(min, Math.floor(max/size)-size);
		this.y = randomFromInterval(min, Math.floor(max/size)-size);
	};
	
	this.render = function(){
		ctx.fillStyle="#FF0000";
		ctx.beginPath();
		ctx.fillRect(this.x * size, this.y * size, size, size);
	};
	
	//Construct
	this.newFood(min, max);
}

//Game-class ( Handles the snake and food )
function Game(size, startParts){
	var mainInterval;
	var points = 0;
	var self = this;
	
	var s = new snake(size, startParts);
	var f = new food(size, 0, canvasSize);
	
	this.checkCollision = function(){
		for(var i = 0; i < s.getLength(); i++){
			if(s.getPart(i).x === f.x && s.getPart(i).y === f.y){
				return true;
			}
		}
		return false;
	};

	this.createNonOverlappingFood = function(min, max){
		f.newFood(min, max);
		
		if(self.checkCollision()){
			this.createNonOverlappingFood(min, max);
		}
	};
	
	this.changeDirection = function(key){
		if(key == 87){
			s.setDir(Direction.Up);
		}
		if(key == 83){
			s.setDir(Direction.Down);
		}
		if(key == 65){
			s.setDir(Direction.Left);
		}
		if(key == 68){
			s.setDir(Direction.Right);
		}				
	};
	
	this.render = function() {
		clearCanvas();
		ctx.beginPath();
		ctx.strokeStyle="#000000";
		ctx.strokeRect(0,0,canvasSize-1,canvasSize-1);
		
		s.render();
		f.render();
	};
	
	this.checkSnakeCollision = function(){
		for(var i = 0; i < s.getLength()-1; i++){
			if(s.getPart(i).x === s.getPart(s.getLength()-1).x && s.getPart(i).y === s.getPart(s.getLength()-1).y){
				return true;
			}
		}
		return false;		
	};
	
	this.gameLoop = function(){
		//Om kolliderar med sig själv
		//Game over
		if(self.checkSnakeCollision()){
			self.gameOver();
		}
		
		//Om kolliderar med mat
		//poäng++ och väx
		if(self.checkCollision()){
			self.createNonOverlappingFood(0, canvasSize);
			s.update(true);			
			points++;
		//Annars
		//Fortsätt
		}else{
			s.update(false);
		}
		
		//Rita ut allt
		self.render();
	};
	
	this.play = function(speed){
		this.mainInterval = setInterval(this.gameLoop, speed);
	};
	
	this.gameOver = function(){
		alert("Game over!\nPoints: "+points);
		points = 0;
		s.createSnake();
		s.setDir(Direction.Right);
		self.createNonOverlappingFood(0, canvasSize);
	};
}
///////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////                              ////////////////////////////////////
/////////////////////////////////         MAIN PROGRAM         ////////////////////////////////////
/////////////////////////////////                              ////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////

var g = new Game(10, 6);
//Events som lyssnar efter knapptryckn
addEventListener("keydown", function (e) {
	g.changeDirection(e.which);
}, false);

g.play(50);

