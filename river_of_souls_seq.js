// R.A. Robertson "River of Souls Sequel" 2017-2018 Creative Commons SA
// Branched project "Orb Variant" in collaboration in visual design with vurv collective 2018.

var souls = [];
var windowRes, soulNum;
var clockStart, clockEnd, lapsedTime;
var v;
var bground, onionSkin, commLines, soulStroke, soulFill;		// Color declarations.

function setup() {
  var canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent();
  bground = color(255);										                  // Color definitions.
  onionSkin = color(20, 30);
  soulStroke = color(214, 3);
  soulFill = color(0, 126, 255, 1);
  background(bground);
  v = 2;
  windowRes = windowWidth * windowHeight;
  // soulNum = int(windowRes / 30000);
                                              soulNum = 12; // Dev testing. Update windowResized also.
  // soulNum = constrain(soulNum, 12, 33);
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
    // souls[i].show();


    // stroke((soulsDistance >= threshold) ? soulStroke : 0);
    if (soulsDistance > communionDistance) {
      stroke(soulStroke);
      strokeWeight(10);
      point(souls[i].x, souls[i].y);
    }



    souls[i].move();
    for (var j = 0; j < souls.length; j++) {										                  // Soul interaction.

      if (i != j) {
        var soulsDistance = dist(souls[i].x, souls[i].y, souls[j].x, souls[j].y);	// Total distance.
        var soulSpace = souls[i].d / 2 + souls[j].d / 2;							            // Touch Radius.
        var communionDistance = soulSpace + threshold;                                  // Activation threshold plus radii.








        // GrowD paremeters. Move elsewhere during cleanup.
        var threshold = 150;
        var separation = soulsDistance - soulSpace;
        var distThreshRatio = separation/threshold;
        var growD =	souls[i].d - (souls[i].d * distThreshRatio);

        if (soulsDistance <= communionDistance) {		          					          // Communion.
          // var lineWeight = 15/soulsDistance;
          // commLines = color(lineWeight * 80, lineWeight, lineWeight, 50);			    // Communion lines color.
          // strokeWeight(lineWeight);
          // stroke(commLines, lineWeight);
          // line(souls[i].x, souls[i].y, souls[j].x, souls[j].y);




       // This block creates the gradient orbs.

       // Halo, or corona.
       stroke(soulStroke);
       strokeWeight(6);
       ellipse(souls[i].x, souls[i].y, growD, growD);

       var radFract, limit, lerpX, lerpY;
       radFract = (souls[i].d / 2) / soulsDistance;

       for (var k = 1; k <= growD; k++) { // Gradient loop.
         limit = (soulsDistance > souls[i].d / 2) ? k / souls[i].d * radFract : k / souls[i].d;
         lerpX = lerp(souls[i].x, souls[j].x, limit);
         lerpY = lerp(souls[i].y, souls[j].y, limit);
         noStroke();
         fill(k / 1.5 * int(255 / souls[i].d), k * int(255 / souls[i].d)); // Tweak alpha for interest.
         ellipse(lerpX, lerpY, growD - k,  growD - k);
       } // End gradient.

        // This block is to bring in perimeters center code for shine.

        noFill();
        // strokeWeight(4);
        var v1 = createVector(souls[i].x, souls[i].y);
        var v2 = createVector(souls[j].x, souls[j].y);
        // var centersDistVal = p5.Vector.dist(v1, v2);	            // Get distance
        var radFract1 = (souls[i].d/2) / soulsDistance;			      // Get fraction radius1:dist
        var radFract2 = (souls[j].d/2) / soulsDistance;           // Get fraction radius2:dist
        var lerpV1 = p5.Vector.lerp(v1, v2, radFract1);	          // Interpolate per fraction1
        var lerpV2 = p5.Vector.lerp(v2, v1, radFract2);	          // Interpolate per fraction2
        stroke('red');
        // ellipse(lerpV1.x, lerpV1.y, 4, 4);						            // Show perimeter near points
        // ellipse(lerpV2.x, lerpV2.y, 4, 4);
        var v3 = createVector(lerpV1.x, lerpV1.y);			          // Location of perimeter point1
        var v4 = createVector(lerpV2.x, lerpV2.y);                // Location of perimeter point2
        var lerpPerimeters = p5.Vector.lerp(v3, v4, 0.5);         // Set pt along perimeter line
        line(souls[i].x, souls[i].y, souls[j.x], souls[j].y);
        var radAverage = (souls[i].d + souls[j].d) / 2;
        radAverage = map(soulsDistance, communionDistance, 0,  0, radAverage);
        // stroke(color('blue'));
        // ellipse(lerpPerimeters.x, lerpPerimeters.y, radAverage, radAverage);



        stroke(255, radAverage / 64);
        strokeWeight(1);
        var r = radAverage;
        var gain = 3;
        for (var l = 0; l < 150; l++) {
          var x1 = randomGaussian(souls[i].x, (l + r) / gain);
          var y1 = randomGaussian(souls[i].y, (l + r) / gain);
          var x2 = randomGaussian(souls[j].x, (l + r) / gain);
          var y2 = randomGaussian(souls[j].y, (l + r) / gain);
          line(x1, y1, lerpPerimeters.x, lerpPerimeters.y);
          line(x2, y2, lerpPerimeters.x, lerpPerimeters.y);

          // Or, the simpler way:
          // var x1 = randomGaussian(lerpPerimeters.x, (l + r) / gain);
          // var y1 = randomGaussian(lerpPerimeters.y, (l + r) / gain);
          // line(x1, y1, lerpPerimeters.x, lerpPerimeters.y);
        }




// End new code block.

        } // End Communion.


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

function Soul() {											                       // Setup.
  this.d = int(random(10, windowRes * 0.00015));			       // Adaptive/responsive sizing.
  this.d = constrain(this.d, 30, int(random(30, 200)));
  this.x = random(this.d, windowWidth - this.d);
  this.y = random(this.d, windowHeight - this.d);
  this.xv = random(-v, v);
  this.yv = random(-v, v);

  this.show = function() {									                 // Display.
    stroke(soulStroke);
    strokeWeight(.2);
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
    // soulNum = int(windowRes / 30000);
  	// soulNum = constrain(soulNum, 12, 33);
                                                soulNum = 10;
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
