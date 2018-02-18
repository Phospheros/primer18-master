// R.A. Robertson "River of Souls Sequel" 2017-2018 Creative Commons SA

var souls = [];
var windowRes, soulNum;
var clockStart, clockEnd, lapsedTime;
var v;
var bground, onionSkin, commLines, soulStroke, soulFill;		// Color declarations.

function setup() {
  var canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent();
  bground = color(255);										                  // Color definitions.
  onionSkin = color(255, 30);
  soulStroke = color(214, 125);
  soulFill = color(0, 126, 255, 1);
  background(bground);
  v = 2;
  windowRes = windowWidth * windowHeight;
  soulNum = int(windowRes / 30000);
  soulNum = constrain(soulNum, 12, 33);
  for (var i = 0; i < soulNum; i++) {												 // Initialize souls.
    souls[i] = new Soul();
  }
  frameRate(30);
}

function draw() {

  noStroke();															  			                                // Onion skin layer.
  fill(onionSkin);
  rect(0, 0, width, height);

  for (var i = 0; i < souls.length; i++) {											                  // Invoke souls.
    souls[i].show();
    souls[i].move();

    for (var j = 0; j < souls.length; j++) {										                  // Soul interaction.
      if (i != j) {
        var soulsDistance = dist(souls[i].x, souls[i].y, souls[j].x, souls[j].y);	// Total distance.
        var soulSpace = souls[i].d / 2 + souls[j].d / 2;							            // Touch Radius.
        var communionDistance = 150;

        if (soulsDistance <= communionDistance) {		          					          // Communion lines.
          var lineWeight = 50/soulsDistance;
          commLines = color(lineWeight * 80, lineWeight, lineWeight, 1);			    // Communion lines color.
          stroke(commLines);
          line(souls[i].x, souls[i].y, souls[j].x, souls[j].y);
        }

        if (soulsDistance <= soulSpace) {											                    // Adhesion. (Average velocities).
          souls[i].xv = souls[j].xv = (souls[i].xv + souls[j].xv) / 2;
          souls[i].yv = souls[j].yv = (souls[i].yv + souls[j].yv) / 2;

          clockStart = (clockStart == 0) ? millis() : 0;							            // Set timer.
          clockEnd = random(15000, 200000);
          timeLapse = millis() - clockStart;

          if (timeLapse >= clockEnd) {												                    // Separation.
            clockStart = 0;
            clockEnd = 20;
            souls[i].xv = random(-v, v);
  			souls[i].yv = random(-v, v);
            souls[j].xv = random(-v, v);
  			souls[j].yv = random(-v, v);
          }	  // End if timer.
        }	// End if collision/adhesion.
      }	  // End if i != j.
    }	// End for j.

      //   strokeWeight(lineWeight);													// Inner glow.
    	// for (var k = 0; k < 14; k++) {
      // 	  bezier(souls[i].x, souls[i].y,
      //     souls[i].x + random(-50, 50), souls[i].y + random(-50, 50),
      //     souls[i].x + random(-50, 50), souls[i].y + random(-50, 50),
      //     souls[i].x, souls[i].y);
    // }	// End glow.
  }	  // End for i.
}	// End draw.

// ====================== Soul Object ====================== //

function Soul() {											 // Setup.
  this.d = int(random(10, windowRes * 0.00015));			       // Adaptive/responsive sizing.
  this.d = constrain(this.d, 10, int(random(10, 150)));
  this.x = random(this.d, windowWidth - this.d);
  this.y = random(this.d, windowHeight - this.d);
  this.xv = random(-v, v);
  this.yv = random(-v, v);

  this.show = function() {									                 // Display.
    stroke(soulStroke);
    strokeWeight(2);
    // fill(soulFill);
    ellipse(this.x, this.y, this.d, this.d);
  }

  this.move = function() {									                 // Behavior (non-interactive).
    this.x += this.xv;
    this.y += this.yv;
    this.xv = (this.x > windowWidth - this.d / 2 || this.x < 0 + this.d / 2) ? -this.xv : this.xv;
    this.yv = (this.y > windowHeight - this.d / 2 || this.y < 0 + this.d / 2) ? -this.yv : this.yv;
  }
}

// ====================== Functions ====================== //

function windowResized() {									                 // Adaptive/responsive design feature.
	//resizeCanvas(windowWidth, windowHeight);				         // Does not work as well here as width, height.
    resizeCanvas(width, height);
    souls = [];
    windowRes = windowWidth * windowHeight;
    soulNum = int(windowRes / 30000);
  	soulNum = constrain(soulNum, 12, 33);
    for (var i = 0; i < soulNum; i++) {						           // Re-initialize souls in new environment.
      souls[i] = new Soul();
    }

  	background(bground);
}

// ====================== UI ====================== //

// function keyPressed() {
//     var timeStamp = (new Date).getTime();
// 	if (key == 'i' || key == 'I') saveCanvas('river_frame_' + timeStamp, 'png');       // DEV PURPOSES ONLY -- REMOVE FOR GOLIVE !!!
// }

// ====================== End ====================== //
