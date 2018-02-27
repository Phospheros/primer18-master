// R.A. Robertson "River of Souls Sequel" 2017-2018 Creative Commons SA
// Branched project "Orb Variant" in visual design collaboration with vurv collective for Primer 2018 conference.

// ====================== Declarations ====================== //

var souls = [], soulNum;                                    // Object array and length.
var windowRes;                                              // Display resolution.
var clockStart, clockEnd, lapsedTime;                       // Timer.
var v;                                                      // Velocity.
var bground, onionSkin, commLines, soulStroke, soulFill;		// Color declarations.
var soulsDistance, soulSpace, communionDistance, threshold; // Spacing variables.
var separation, distThreshRatio, growD;
var radFract, limit, lerpX, lerpY;                          // Gradient variables.
var vect1, vect2, vect3, vect4, radFract1, radFract2;       // Distances between orb radii.
var lerpV1, lerpV2, lerpPerimeters, radAverage;
var r, gain, x1, y1, x2, y2;                                // Shine variables.

// ====================== Setup ====================== //

function setup() {
  createCanvas(windowWidth, windowHeight);

  bground = color(20);										                  // Color definitions.
  onionSkin = color(20, 30);
  soulStroke = color(214, 3);
  soulFill = color(0, 126, 255, 1);
  background(bground);

  threshold = 150;                                          // Interaction distance, or range of effect between orbs.
  v = 2;                                                    // Velocity range + - .
  windowRes = windowWidth * windowHeight;
  // soulNum = int(windowRes / 30000);
  // soulNum = constrain(soulNum, 12, 33);
                                                        soulNum = 12; // Dev testing. Update windowResized also.

  for (var i = 0; i < soulNum; i++) {												// Initialize souls.
    souls[i] = new Soul();
  }
  // frameRate(30);
}

// ====================== Draw ====================== //

function draw() {

  noStroke();															  			                                // Onion skin layer.
  fill(onionSkin);
  rect(0, 0, width, height);

  for (var i = 0; i < souls.length; i++) {											                  // Invoke souls.
    // souls[i].show();

    if (soulsDistance > communionDistance) {                                      // Orb seed (pre/post orb location tracking.)
      stroke(soulStroke);
      strokeWeight(10);
      point(souls[i].x, souls[i].y);
    }

    souls[i].move();
    for (var j = 0; j < souls.length; j++) {										                  // Soul interaction.

      if (i != j) {
        soulsDistance = dist(souls[i].x, souls[i].y, souls[j].x, souls[j].y);	    // Total distance.
        soulSpace = souls[i].d / 2 + souls[j].d / 2;							                // Touch Radius.
        communionDistance = soulSpace + threshold;                                // Activation threshold plus radii.

        if (soulsDistance <= communionDistance) {		          					          // Communion.
          // var lineWeight = 15/soulsDistance;
          // commLines = color(lineWeight * 80, lineWeight, lineWeight, 50);			    // Communion lines color [legacy].
          // strokeWeight(lineWeight);
          // stroke(commLines, lineWeight);
          // line(souls[i].x, souls[i].y, souls[j].x, souls[j].y);

          separation = soulsDistance - soulSpace;                                 // Set spacing for growth protocol.
          distThreshRatio = separation/threshold;
          growD =	souls[i].d - (souls[i].d * distThreshRatio);

          // This block creates the gradient orbs.
          stroke(soulStroke);                                                     // Halo, or corona surrounding orb.
          strokeWeight(6);
          ellipse(souls[i].x, souls[i].y, growD, growD);

          // Gradients.
          radFract = (souls[i].d / 2) / soulsDistance;                            // Radius fraction, or ratio of radius to distance.
          for (var k = 1; k <= growD; k++) {                                      // Gradient loop.
            limit = (soulsDistance > souls[i].d / 2) ? k / souls[i].d * radFract : k / souls[i].d;
            lerpX = lerp(souls[i].x, souls[j].x, limit);
            lerpY = lerp(souls[i].y, souls[j].y, limit);
            noStroke();
            fill(k / 1.5 * int(255 / souls[i].d), k * int(255 / souls[i].d)); // Tweak alpha for interest.
            ellipse(lerpX, lerpY, growD - k,  growD - k);
          } // End gradient.

          // This block calculates distance between radii and centerpoint along line for shine, below.
          vect1 = createVector(souls[i].x, souls[i].y);                         // Location vectors.
          vect2 = createVector(souls[j].x, souls[j].y);
          radFract1 = (souls[i].d/2) / soulsDistance;			                      // Get fraction radius1:dist.
          radFract2 = (souls[j].d/2) / soulsDistance;                           // Get fraction radius2:dist.
          lerpV1 = p5.Vector.lerp(vect1, vect2, radFract1);	                    // Interpolate per fraction1.
          lerpV2 = p5.Vector.lerp(vect2, vect1, radFract2);	                    // Interpolate per fraction2.
          vect3 = createVector(lerpV1.x, lerpV1.y);			                        // Location of perimeter point1.
          vect4 = createVector(lerpV2.x, lerpV2.y);                             // Location of perimeter point2.
          lerpPerimeters = p5.Vector.lerp(vect3, vect4, 0.5);                   // Set pt along perimeter line.
          radAverage = (souls[i].d + souls[j].d) / 2;                           // Average radii.
          radAverage = map(soulsDistance, communionDistance, 0, 0, radAverage); // Stretch with distance.

          // stroke('red');                                                        // Dev/debug displays
          // noFill();
          // ellipse(lerpV1.x, lerpV1.y, 4, 4);						                        // Show perimeter near points
          // ellipse(lerpV2.x, lerpV2.y, 4, 4);
          // stroke(color('blue'));
          // ellipse(lerpPerimeters.x, lerpPerimeters.y, radAverage, radAverage);  // Show circle of averaged radii at centerpoint.


          // Shine between orbs from common center toward orb centers.
          stroke(255, radAverage / 64);
          strokeWeight(1);
          r = radAverage;
          gain = 3;
          for (var l = 0; l < 150; l++) {
            x1 = randomGaussian(souls[i].x, (l + r) / gain);
            y1 = randomGaussian(souls[i].y, (l + r) / gain);
            x2 = randomGaussian(souls[j].x, (l + r) / gain);
            y2 = randomGaussian(souls[j].y, (l + r) / gain);
            line(x1, y1, lerpPerimeters.x, lerpPerimeters.y);
            line(x2, y2, lerpPerimeters.x, lerpPerimeters.y);
          }

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

      //   strokeWeight(lineWeight);													                    // Inner glow [legacy].
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
    fill(soulFill);
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
