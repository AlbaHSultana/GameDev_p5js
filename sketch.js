/*THE FINAL GAME PROJECT*/

// global varibales
var gameChar_x;
var gameChar_y;
var floorPos_y;
var scrollPos;
var gameChar_world_x;

var isLeft;
var isRight;
var isFalling;
var isPlummeting;

var mountains;
var trees_x;
var clouds;
var canyon;
var collectable;
var birds;

var game_score;
var flagpole;
var lives;

var jumpSound;
var fallSound;
var keySound;
var losingSound;
var winningSound;


function preload()
{
    soundFormats('mp3','wav');
    
    //load the sounds here
    jumpSound = loadSound('assets/jump.wav');
    jumpSound.setVolume(0.1);
    
    fallSound = loadSound('assets/fall.wav');
    fallSound.setVolume(0.1);
    
    keySound = loadSound('assets/keyFound.wav');
    keySound.setVolume(0.1);
    
    losingSound = loadSound('assets/losing.mp3');
    losingSound.setVolume(0.1);
    
    winningSound = loadSound('assets/winning.wav');
    winningSound.setVolume(0.1);
}
function setup()
{
	createCanvas(1024, 576);
	floorPos_y = height * 3/4;
	
    lives = 4;
    startGame();

}
function draw()
{
	background(204,255,255); // fill the sky blue

	noStroke();
	fill(35,226,73);
	rect(0, floorPos_y, width, height/4); // draw some green ground
    
    fill(244,146,66);
    ellipse(330,78,80,80);//The sun
   
    push();
        translate(scrollPos,0);

        // Calling Draw clouds function.
        drawClouds();

        // Calling Draw mountains function.
        drawMountains();  

        // Calling Draw trees function below.
        drawTrees();
     
         // Calling Draw clouds function.
        drawBirds();

        // Draw canyons
        for (var i =0; i < canyon.length; i++)
            {
                drawCanyon(canyon[i]);
                checkCanyon(canyon[i]);
            }
        // draw collectable
        for (var i =0; i < collectable.length; i++)
        { 
            checkCollectable(collectable[i]);

            if (collectable[i].isFound == false)
            {
                drawCollectable(collectable[i]);
            }    
        }
        // Draw game character.
        if(gameChar_y < floorPos_y)
           {
                isFalling= true;
                gameChar_y += 2;
                fallSound.play();
           }
        else
            {
                isFalling= false;
            }

        renderFlagpole();
    pop();
    
	drawGameChar();
   
    //Draw screen lives counter
    fill(0);
    textSize(20);
    text("Lives:", 520,30);
    
    // Draw screen text
    fill(0);
    text ("score:  " + game_score, 30,30);
    
    //Lives
    if (lives > 0 && gameChar_y > 576)
        {    
            startGame();
            fallSound.play();
        }
    for (var i = 0; i < lives; i++)
        {
            noStroke();
            fill(243,26,171)
            triangle(594 +i *40 ,23,606 + i * 40,23, 600 +i *40 ,30 );
            ellipse(597 +i *40, 19,9,10);
            ellipse(603 +i * 40, 19,9,10); 
        }
    
    //In gameplay: screen text lives counter, level completed
    if (lives < 1)
        {
          fill(0);
          textSize(35);
          text ("GAME OVER. Press SPACE to continue" ,width/2 -260, height/2); 
            return
            {
                losingSound.play();
            }
            end();
        }
    
    
    //Draw screen text level completed
    if (flagpole.isReached)
        {
          fill(0);
          textSize(35);
          text ("LEVEL COMPLETED. Press SPACE to continue" , width/2 -260, height/2); 
            {
                winningSound.play();
            }
            end();
        }
	// Logic to make the game character move or the background scroll.
	if(isLeft)
	{
		if(gameChar_x > width * 0.2)
		{
			gameChar_x -= 5;
		}
		else
		{
			scrollPos += 5;
		}
	}

	if(isRight)
	{
		if(gameChar_x < width * 0.8)
		{
			gameChar_x  += 5;
		}
		else
		{
			scrollPos -= 5; // negative for moving against the background
		}
	}

	// Logic to make the game character rise and fall.
      if(gameChar_y < floorPos_y)
       {
            isFalling= true;
            gameChar_y += 2;
         
       }
    else
        {
            isFalling= false;
        }
    
    //game character reaching flagpole
    if (flagpole.isReached != true)
        {
            checkFlagpole();
        }

	// Update real position of gameChar for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;
}
  
// ---------------------
// Key control functions
// ---------------------

function keyPressed()
{
    // if statements to control the animation of the character when
	// keys are pressed.
    if(flagpole.isReached && key == ' ')
    {
        nextLevel();
        return
    }
    else if(lives == 0 && key == ' ')
    {
        returnToStart();
        return
    }
    
    if (keyCode ==37)
    {
        isLeft = true;
        
    }
    
    if (keyCode ==39)
    {
        isRight = true;
        
    }
    
    if (keyCode ==32 && gameChar_y==floorPos_y) 
    {
        gameChar_y -=100 ;
        
        {
                jumpSound.play();
        }
    }  
}

function keyReleased()
{
    if (keyCode ==37)
    {
        isLeft = false;    
    }
    if (keyCode ==39)
    {
        isRight = false;   
    } 

}

// ------------------------------
// Game character render function
// ------------------------------

// Function to draw the game character.

function drawGameChar()
{
	// draw game character
    if(isLeft && isFalling)
	{
        // add your jumping-left code
        fill(255,243,216); //face shade
        stroke(0);
        ellipse(gameChar_x,gameChar_y -57,17,30); //face
        triangle(gameChar_x -7,gameChar_y -53,gameChar_x-6,gameChar_y -50,gameChar_x -12,gameChar_y -53)//nose
        fill(255,10,0);
        arc(gameChar_x -4,gameChar_y - 49,5,5,0,PI,CHORD) //mouth
        fill(243,26,171);
        arc(gameChar_x,gameChar_y -63,16,19,PI,0,CHORD);// head hair
        fill(255);
        strokeWeight(0.2);
        ellipse(gameChar_x - 5,gameChar_y - 57,5,6);//left eye
        stroke(0,0,255);
        fill(0,0,255);
        ellipse(gameChar_x - 5,gameChar_y - 57,1,3);//left iris
        fill(243,26,171)
        stroke(102,51,0)
         //right braid
        ellipse(gameChar_x +6,gameChar_y -62,3,5);
        ellipse(gameChar_x +7,gameChar_y -59,3,5);
        ellipse(gameChar_x +7,gameChar_y -57,3,5)
        ellipse(gameChar_x +7,gameChar_y -53,3,5);
        ellipse(gameChar_x +9,gameChar_y -50,3,5);
        ellipse(gameChar_x +11,gameChar_y -47,3,5);

        stroke(0);
        fill(255,243,216);
        rect(gameChar_x-2,gameChar_y -43,4,5,5);//neck
        stroke(252,130,8)
        fill(252,130,8);
        rect(gameChar_x -5,gameChar_y -39,10,22,15);//body
        //bend leg to left
        beginShape();
            vertex(gameChar_x,gameChar_y -25);
            vertex(gameChar_x +8, gameChar_y -25);
            vertex(gameChar_x -5, gameChar_y -5);
            vertex(gameChar_x-12,gameChar_y-10);
        endShape(CLOSE);
        rect(gameChar_x -12,gameChar_y -10,8,5);//lower left knee
        rect(gameChar_x ,gameChar_y -39,8,3);//right arm 1st
        stroke(0);
        fill(255,243,216);
        rect(gameChar_x +5,gameChar_y -39,5,10,30);// right arm
        rect(gameChar_x -9,gameChar_y -30,20,5,45);// right arm
        ellipse(gameChar_x -7,gameChar_y -30,5,9);//right hand
        fill(0);
        rect(gameChar_x -16,gameChar_y -6,12,4,5);//left shoe
    }
    
	else if(isRight && isFalling)
	{
        // add your jumping-right code
        fill(255,243,216); //face shade
        stroke(0);
        ellipse(gameChar_x,gameChar_y -57,17,30); //face
        triangle(gameChar_x +7,gameChar_y -53,gameChar_x + 7,gameChar_y -50,gameChar_x + 13,gameChar_y -53);//nose
        fill(255,10,0);
        arc(gameChar_x +4,gameChar_y - 49,5,5,0,PI,CHORD) //mouth
        fill(243,26,171);
        arc(gameChar_x,gameChar_y -63,16,19,PI,0,CHORD);// head hair
        fill(255);
        strokeWeight(0.2);
        ellipse(gameChar_x + 5,gameChar_y - 57,5,6);//left eye
        stroke(0,0,255);
        fill(0,0,255);
        ellipse(gameChar_x + 5,gameChar_y - 57,1,3);//left iris
        fill(243,26,171)
        stroke(102,51,0)
         //right braid
        ellipse(gameChar_x -6,gameChar_y -62,3,5);
        ellipse(gameChar_x -7,gameChar_y -59,3,5);
        ellipse(gameChar_x -7,gameChar_y -57,3,5)
        ellipse(gameChar_x -7,gameChar_y -53,3,5);
        ellipse(gameChar_x -9,gameChar_y -50,3,5);
        ellipse(gameChar_x -11,gameChar_y -47,3,5);

        stroke(0);
        fill(255,243,216);
        rect(gameChar_x-2,gameChar_y -43,4,5,5);//neck
        stroke(252,130,8)
        fill(252,130,8);
        rect(gameChar_x -5,gameChar_y -39,10,22,15);//body
        //bend leg to left
        beginShape();
            vertex(gameChar_x , gameChar_y -25);
            vertex(gameChar_x -8, gameChar_y -25);
            vertex(gameChar_x +5, gameChar_y -5);
            vertex(gameChar_x+12,gameChar_y-10);
        endShape(CLOSE);
        rect(gameChar_x +4,gameChar_y -10,8,8);//lower left knee
        rect(gameChar_x -8 ,gameChar_y -39,8,3);//right arm 1st
        stroke(0);
        fill(255,243,216);
        rect(gameChar_x -10,gameChar_y -39,5,10,30);// right arm
        rect(gameChar_x -9,gameChar_y -30,20,5,45);// right arm
        ellipse(gameChar_x +11,gameChar_y -30,5,9);//right hand
        fill(0);
        rect(gameChar_x +4,gameChar_y -5,12,4,5);//left shoe
	}
    
	else if(isLeft)
	{
		// add your walking left code
        fill(255,243,216); //face shade
        stroke(0);
        ellipse(gameChar_x,gameChar_y -57,17,30); //face
        triangle(gameChar_x -7,gameChar_y -53,gameChar_x-6,gameChar_y -50,gameChar_x -12,gameChar_y -53)//nose
        fill(255,10,0);
        arc(gameChar_x -4,gameChar_y - 49,5,5,0,PI,CHORD) //mouth
        fill(243,26,171);
        arc(gameChar_x,gameChar_y -63,16,19,PI,0,CHORD);// head hair
        fill(255);
        strokeWeight(0.2);
        ellipse(gameChar_x - 5,gameChar_y - 57,5,6);//left eye
        stroke(0,0,255);
        fill(0,0,255);
        ellipse(gameChar_x - 5,gameChar_y - 57,1,3);//left iris
        fill(243,26,171)
        stroke(102,51,0)
         //right braid
        ellipse(gameChar_x +6,gameChar_y -62,3,5);
        ellipse(gameChar_x +7,gameChar_y -59,3,5);
        ellipse(gameChar_x +7,gameChar_y -57,3,5)
        ellipse(gameChar_x +7,gameChar_y -53,3,5);
        ellipse(gameChar_x +9,gameChar_y -50,3,5);
        ellipse(gameChar_x +11,gameChar_y -47,3,5);

        stroke(0);
        fill(255,243,216);
        rect(gameChar_x-2,gameChar_y -43,4,5,5);//neck
        stroke(252,130,8)
        fill(252,130,8);
        rect(gameChar_x -5,gameChar_y -39,10,22,15);//body
        //bend leg to left
        beginShape();
            vertex(gameChar_x, gameChar_y -25);
            vertex(gameChar_x +8, gameChar_y -25);
            vertex(gameChar_x -5, gameChar_y -5);
            vertex(gameChar_x-12,gameChar_y-10);
        endShape(CLOSE);
        rect(gameChar_x -12,gameChar_y -10,8,10);//lower left knee
        rect(gameChar_x ,gameChar_y -39,8,3);//right arm 1st
        stroke(0);
        fill(255,243,216);
        rect(gameChar_x +5,gameChar_y -39,5,10,30);// right arm
        rect(gameChar_x -10,gameChar_y -30,20,5,45);// right arm
        ellipse(gameChar_x -11,gameChar_y -27,7,5);//right hand
        fill(0);
        rect(gameChar_x -16,gameChar_y -1,12,4,5);//left shoe
	}
    
	else if(isRight)
	{
		// add your walking right code
        fill(255,243,216); //face shade
        stroke(0);
        ellipse(gameChar_x,gameChar_y -57,17,30); //face
        triangle(gameChar_x +7,gameChar_y -53,gameChar_x + 7,gameChar_y -50,gameChar_x + 13,gameChar_y -53);//nose
        fill(255,10,0);
        arc(gameChar_x +4,gameChar_y - 49,5,5,0,PI,CHORD) //mouth
        fill(243,26,171);
        arc(gameChar_x,gameChar_y -63,16,19,PI,0,CHORD);// head hair
        fill(255);
        strokeWeight(0.2);
        ellipse(gameChar_x + 5,gameChar_y - 57,5,6);//left eye
        stroke(0,0,255);
        fill(0,0,255);
        ellipse(gameChar_x + 5,gameChar_y - 57,1,3);//left iris
        fill(243,26,171)
        stroke(102,51,0)
         //right braid
        ellipse(gameChar_x -6,gameChar_y -62,3,5);
        ellipse(gameChar_x -7,gameChar_y -59,3,5);
        ellipse(gameChar_x -7,gameChar_y -57,3,5)
        ellipse(gameChar_x -7,gameChar_y -53,3,5);
        ellipse(gameChar_x -9,gameChar_y -50,3,5);
        ellipse(gameChar_x -11,gameChar_y -47,3,5);

        stroke(0);
        fill(255,243,216);
        rect(gameChar_x-2,gameChar_y -43,4,5,5);//neck
        stroke(252,130,8)
        fill(252,130,8);
        rect(gameChar_x -5,gameChar_y -39,10,22,15);//body
        //bend leg to left:
        beginShape();
            vertex(gameChar_x , gameChar_y -25);
            vertex(gameChar_x -8, gameChar_y -25);
            vertex(gameChar_x +5, gameChar_y -5);
            vertex(gameChar_x+12,gameChar_y-10);
        endShape(CLOSE);
        rect(gameChar_x +4,gameChar_y -10,8,10);//lower left knee
        rect(gameChar_x -8 ,gameChar_y -39,8,3);//right arm 1st
        stroke(0);
        fill(255,243,216);
        rect(gameChar_x -10,gameChar_y -39,5,10,30);// right arm
        rect(gameChar_x -10,gameChar_y -30,20,5,45);// right arm
        ellipse(gameChar_x +11,gameChar_y -28,7,5);//right hand
        fill(0);
        rect(gameChar_x +4,gameChar_y -1,12,4,5);//left shoe
	}
    
	else if(isFalling || isPlummeting)
	{
		// add your jumping facing forwards code
         fill(255,243,216); //face shade
        stroke(0);
        ellipse(gameChar_x,gameChar_y -57,25,30); //face
        line(gameChar_x,gameChar_y -54,gameChar_x - 2,gameChar_y - 53);//nose
        line(gameChar_x-2, gameChar_y -53, gameChar_x +1,gameChar_y - 52);//nose
        fill(255,10,0);
        arc(gameChar_x,gameChar_y - 49, 7,7,0,PI,CHORD) //mouth
        fill(243,26,171);
        arc(gameChar_x, gameChar_y -62, 24,24,PI,0,CHORD);// head hair
        fill(255);
        strokeWeight(0.2);
        ellipse(gameChar_x + 5 , gameChar_y - 57, 5,6);//right eye
        ellipse(gameChar_x - 5, gameChar_y - 57,5,6);//left eye
        stroke(0,0,255);
        fill(0,0,255);
        ellipse(gameChar_x + 5, gameChar_y - 57, 1,3);//right iris
        ellipse(gameChar_x - 5, gameChar_y - 57,1,3);//left iris
        fill(243,26,171)
        stroke(102,51,0)
        //left braid:
        ellipse(gameChar_x -11,gameChar_y -62,3,5);
        ellipse(gameChar_x -12,gameChar_y -59,3,5);
        ellipse(gameChar_x -12,gameChar_y -57,3,5);
        ellipse(gameChar_x -12,gameChar_y -53,3,5);
        ellipse(gameChar_x -14,gameChar_y -50,3,5);
        ellipse(gameChar_x -16,gameChar_y -47,3,5);
        //right braid:
        ellipse(gameChar_x +11,gameChar_y -62,3,5);
        ellipse(gameChar_x +12,gameChar_y -59,3,5);
        ellipse(gameChar_x +12,gameChar_y -57,3,5)
        ellipse(gameChar_x +12,gameChar_y -53,3,5);
        ellipse(gameChar_x +14,gameChar_y -50,3,5);
        ellipse(gameChar_x +16,gameChar_y -47,3,5);

        stroke(0);
        fill(255,243,216);
        rect(gameChar_x-2,gameChar_y -43,4,5,5);//neck
        rect(gameChar_x +10,gameChar_y -39,3,10,30);// up to elbow R right arm
        rect(gameChar_x +10,gameChar_y -30,8,3,30);
        ellipse(gameChar_x +18,gameChar_y -29,7,5);//right hand
        rect(gameChar_x -11,gameChar_y -39,3,10,30);// up to elbow L left arm
        rect(gameChar_x - 16,gameChar_y -30,8,3,30);
        ellipse(gameChar_x -17  ,gameChar_y -29,7,5);//left hand

        stroke(252,130,8)
        fill(252,130,8);
        rect(gameChar_x -8,gameChar_y -39,17,22,5);//body
        rect(gameChar_x -5,gameChar_y -19,4,16,5);//left leg
        ellipse( gameChar_x -3,gameChar_y -10,6,3);//left knee
        rect(gameChar_x +3,gameChar_y -19,4,16,5);//right leg
        ellipse( gameChar_x +5,gameChar_y -10,6,3);//right knee
        rect(gameChar_x +5,gameChar_y -39,8,3);//right arm 1st
        rect(gameChar_x -11,gameChar_y -39,7,3);//left arm 1st
        fill(0);
        rect(gameChar_x +3,gameChar_y -5,8,4,5);// right shoe
        rect(gameChar_x -7,gameChar_y -5,8,4,5);//left shoe
	}
    
	else
	{
		// add your standing front facing code
        fill(255,243,216); //face shade
        stroke(0);
        ellipse(gameChar_x, gameChar_y -57, 25,30); //face
        line(gameChar_x, gameChar_y -54, gameChar_x - 2, gameChar_y - 53);//nose
        line(gameChar_x -2, gameChar_y -53,gameChar_x +1,gameChar_y - 52);//nose
        fill(255,10,0);
        arc(gameChar_x,gameChar_y - 49,7,7,0,PI,CHORD) //mouth
        fill(243,26,171);
        arc(gameChar_x, gameChar_y -62, 24,24,PI,0,CHORD);// head hair
        fill(255);
        strokeWeight(0.2);
        ellipse(gameChar_x + 5 , gameChar_y - 57, 5,6);//right eye
        ellipse(gameChar_x - 5,gameChar_y - 57,5,6);//left eye
        stroke(0,0,255);
        fill(0,0,255);
        ellipse(gameChar_x + 5,gameChar_y - 57,1,3);//right iris
        ellipse(gameChar_x - 5, gameChar_y - 57,1,3);//left iris
        fill(243,26,171)
        stroke(102,51,0)
        //left braid
        ellipse(gameChar_x -11,gameChar_y -62, 3,5);
        ellipse(gameChar_x -12,gameChar_y -59,3,5);
        ellipse(gameChar_x -12,gameChar_y -57,3,5);
        ellipse(gameChar_x -12, gameChar_y -53,3,5);
        ellipse(gameChar_x -14,gameChar_y -50, 3,5);
        ellipse(gameChar_x -16, gameChar_y -47,3,5);
         //right braid
        ellipse(gameChar_x +11,gameChar_y -62,3,5);
        ellipse(gameChar_x +12,gameChar_y -59,3,5);
        ellipse(gameChar_x +12,gameChar_y -57, 3,5)
        ellipse(gameChar_x +12, gameChar_y -53,3,5);
        ellipse(gameChar_x +14,gameChar_y -50, 3,5);
        ellipse(gameChar_x +16, gameChar_y -47,3,5);

        stroke(0);
        fill(255,243,216);
        rect(gameChar_x-2,gameChar_y -43, 4,5,5);//neck
        rect(gameChar_x +10,gameChar_y -39,3,20,30);// right arm
        rect(gameChar_x -11, gameChar_y -39,3,20,30);//left arm
        ellipse(gameChar_x +12, gameChar_y -19,5,7);//right hand
        ellipse(gameChar_x -10,gameChar_y -19, 5,7);//left hand

        stroke(252,130,8)
        fill(252,130,8);
        rect(gameChar_x -8,gameChar_y -39, 17,22,5);//body
        rect(gameChar_x -5,gameChar_y -19,4,19,5);//left leg
        rect(gameChar_x +3,gameChar_y -19,4,19,5);//right leg
        rect(gameChar_x +5,gameChar_y -39,8,3);//right arm 1st
        rect(gameChar_x -11,gameChar_y -39,7,3);//left arm 1st
        fill(0);
        rect(gameChar_x +3,gameChar_y -1,8,4,5);// right shoe
        rect(gameChar_x -7,gameChar_y -1,8,4,5);//left shoe
	}
}
// ---------------------------
// Background render functions
// ---------------------------


// Function to draw cloud objects.
function drawClouds()
{
    for ( var i= 0; i < clouds.length; i++)
    {   
        stroke(255);
        fill(255)
        ellipse(clouds[i].x_pos,
                clouds[i].y_pos,
                80 * clouds[i].size,
                50 * clouds[i].size);

        ellipse(clouds[i].x_pos + 40 * clouds[i].size,
                clouds[i].y_pos + 20,
                80 * clouds[i].size,
                50 * clouds[i].size);

        ellipse(clouds[i].x_pos + 40 * clouds[i].size,
                clouds[i].y_pos - 20,
                80 * clouds[i].size,
                50 * clouds[i].size);

        ellipse(clouds[i].x_pos + 90 * clouds[i].size,
                clouds[i].y_pos,
                80 * clouds[i].size,
                50 * clouds[i].size);
    }; 
}
// function to draw the birds
function drawBirds()
{
    for (var i=0; i < birds.length; i++)  
    {
        strokeWeight(3);
        stroke(80,90,226);
        //right wing
        line(birds[i].x_pos,birds[i].y_pos,
             birds[i].x_pos + 23,birds[i].y_pos - 13);
        
        line(birds[i].x_pos + 23,birds[i].y_pos - 13,
             birds[i].x_pos + 36,birds[i].y_pos - 6);
        
        //left wing:
        line(birds[i].x_pos + 36,birds[i].y_pos - 6,
             birds[i].x_pos + 49,birds[i].y_pos -13);
        
        line(birds[i].x_pos + 49,birds[i].y_pos -13,
             birds[i].x_pos + 70,birds[i].y_pos);
        strokeWeight(0);
    }
}
// Function to draw mountains objects.
function drawMountains()
{   
    for ( var i= 0; i < mountains.length; i++)
    {
        stroke(34,139,34);
        fill(0,128,10);
        //left mountain
        triangle(mountains[i].x_pos,
                 mountains[i].y_pos,
                 mountains[i].x_pos -160,
                 mountains[i].y_pos + 285,
                 mountains[i].x_pos + 150,
                 mountains[i].y_pos + 285);
        
        //right mountain
        triangle(mountains[i].x_pos + 200,
                 mountains[i].y_pos,
                 mountains[i].x_pos + 30,
                 mountains[i].y_pos + 285,
                 mountains[i].x_pos + 350,
                 mountains[i].y_pos + 285);
    }
}

// Function to draw trees objects.
function drawTrees()
{
     for (var i =0; i < trees_x.length; i++)
        {
             //trunk
            stroke(139,69,19);
            fill(139,69,19);
            rect(trees_x[i]-15,floorPos_y -105,30,110,10);
            
            //leaves
            stroke(107,165,35);
            fill(100,163,35);
            ellipse( trees_x[i],floorPos_y -150 ,80,80);
            ellipse(trees_x[i] + 1,floorPos_y -115 , 120,100);
        }      
}

  

// ---------------------------------
// Canyon render and check functions
// ---------------------------------

// Function to draw canyon objects.
function drawCanyon(t_canyon)
{ 
    stroke(204,255,255);
    fill(20,235,255);
    rect(t_canyon.x_pos, 432, t_canyon.width, 236);      
}

// Function to check character is over a canyon.
function checkCanyon(t_canyon)
{
    if ((gameChar_world_x < 50 + t_canyon.x_pos  &&
        gameChar_world_x > 7+ t_canyon.x_pos )&&
        gameChar_y == floorPos_y)
       
    {
        isPlummeting = true;
    }
    
    if (isPlummeting ==true)
    {
        gameChar_y += 2;
    }
}
// ----------------------------------
// Collectable items render and check functions
// ----------------------------------

// Function to draw collectable objects.
function drawCollectable(t_collectable)
{
    stroke(255,165,0);
    fill(255,215,0);
    ellipse(t_collectable.x_pos,
            t_collectable.y_pos,
            25 * t_collectable.size,
            20 * t_collectable.size);

    rect(t_collectable.x_pos + 5,
         t_collectable.y_pos,
         30 * t_collectable.size,
         5 * t_collectable.size);

    rect(t_collectable.x_pos + 30,
         t_collectable.y_pos,
         5 *t_collectable.size,
         15 * t_collectable.size);

    rect(t_collectable.x_pos + 22,
         t_collectable.y_pos,
         3 * t_collectable.size,
         10 * t_collectable.size);
}

// Function to check character has collected an item.
function checkCollectable(t_collectable)
{
    //this checks the ditance between the game character World and the collectable posiotion
    var d = (dist(gameChar_world_x, gameChar_y, t_collectable.x_pos, t_collectable.y_pos));
   
    if (d < 22)  
    {
        t_collectable.isFound = true;
        game_score +=t_collectable.size;
        keySound.play();
    }
}
function renderFlagpole()
{
    push();
        stroke(150);
        strokeWeight(5);
        line(flagpole.x_pos, floorPos_y, flagpole.x_pos, floorPos_y -200);

        if (flagpole.isReached)
        {
            noStroke();
            fill (255,10,70);
            rect(flagpole.x_pos, floorPos_y - 200,50,50); 
        }
        else
        {
            noStroke();
            fill (255,10,70);
            rect(flagpole.x_pos, floorPos_y - 50,50,50);
        }
    pop();
}
function checkFlagpole()
{
    var d = abs(gameChar_world_x - flagpole.x_pos);
    
    if  (d < 50)  
    {
        flagpole.isReached = true;
    }
}

function startGame()
{
    gameChar_x = width/2;
	gameChar_y = floorPos_y;

	// Variable to control the background scrolling.
	scrollPos = 0;

	// Variable to store the real position of the gameChar in the game
	// world. Needed for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;

	// Boolean variables to control the movement of the game character.
	isLeft = false;
	isRight = false;
	isFalling = false;
	isPlummeting = false;
    

	// Initialise arrays of scenery objects.
    trees_x = [100,352,488,854,1024,1700];
    
    clouds =  [
        {x_pos: 110, y_pos: 90, size: 1.0},
        {x_pos: 610, y_pos: 90, size: 1.0},
        {x_pos: 910, y_pos: 90, size: 1.0},
        {x_pos: 1210, y_pos: 90, size: 1.0},
        {x_pos: 1610, y_pos: 90, size: 1.0},
    ];
    
    mountains =[
        {x_pos:410, y_pos:150, size: 1.0},
        {x_pos:1010, y_pos:150, size: 1.0},
        {x_pos:1810, y_pos:150, size: 1.0},
    ];
    
    canyon = [
        {x_pos: 140, width: 64},
        {x_pos: 640, width: 64}, 
        {x_pos: 940, width: 64},
        {x_pos: 1440, width: 64},
        {x_pos: 1940, width: 64},
    ];
     collectable = [
        {x_pos:300, y_pos: floorPos_y, size: 1.0, isFound: false},
        {x_pos:1100, y_pos: floorPos_y, size: 1.0, isFound: false},
        {x_pos:1600, y_pos: floorPos_y, size: 1.0, isFound: false},
        {x_pos:2100, y_pos: floorPos_y, size: 1.0, isFound: false},
    ];
    
    game_score = 0;
    
    flagpole = {
        x_pos:2500,
        isReached: false,
    }
    
    lives -= 1; 
    
    birds =[
        {x_pos:68, y_pos:150},
        {x_pos:519, y_pos:84},
        {x_pos:799, y_pos:100},
        {x_pos:876, y_pos:87},
        {x_pos:1068, y_pos:150},
        {x_pos:1468, y_pos:150},
        {x_pos:1519, y_pos:84},
        {x_pos:1799, y_pos:100},
        {x_pos:1876, y_pos:87},
       
    ];
  
}

