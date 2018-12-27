var counter = 1;
var radius = 20;
//interval variable for animations
var interval;
var animIter = 2;
var explanationY = 240;
var lineSize = 17; //16px text size + 1
var aliceX = 70;
var bobX = 370;
var defaultY = 70;

function draw_circle(context, centerX, centerY, rad, colour) {
//function to reduce the amount of boilerplate code needed to draw a single circle
    context.beginPath();
    context.arc(centerX, centerY, rad, 0, 2 * Math.PI, false);
    context.fillStyle = colour;
    context.fill();
    context.lineWidth = 5;
    context.strokeStyle = colour;
    context.stroke();
}

function draw_base(context, line) {
//draws the base image of alice/bob and the message line between them
    var textY = 40;
    draw_circle(context, aliceX, defaultY, radius, 'black');
    draw_circle(context, bobX, defaultY, radius, 'black');
    
    context.fillText("Alice", aliceX - 25, textY);
    context.fillText("Bob", bobX - 20, textY);
    
	if(line) {
		context.beginPath();
		context.moveTo(aliceX, defaultY);
		context.lineTo(bobX, defaultY);
		context.stroke();
	}
}

function draw_animated_encryption(context, i) {
//animation for drawing line going through keys to encrypt and decrypt
    var leftBound = aliceX + 70;
    var rightBound = bobX - 70;
    if(i == leftBound || i == rightBound) {
        draw_circle(context, i, defaultY, radius * 0.8, 'blue');
        if(i == leftBound)
            context.fillText("Encrypt", i-radius, radius+85);
        else if(i == rightBound)
            context.fillText("Decrypt", i-radius, radius+85);
    }	

    context.beginPath();
    context.moveTo(i, defaultY);
    if( i < leftBound || i >= (rightBound + radius) - animIter )
        context.strokeStyle = 'black';
    else
        context.strokeStyle = 'blue';

    i += animIter;

    context.lineTo(i, defaultY);
    context.stroke();
    return i;
}

function draw_steps(context) {
//contains the main drawing code
    switch(counter) {
        case 1:
            //first screen
            draw_base(context, true);
    		context.fillText("Message", aliceX + 100, 40);
            
            context.fillText("Alice and Bob want to send a message to each other.", 20, explanationY);
            
            break;
        case 2:
            draw_base(context, true);
    		context.fillText("Message", aliceX + 100, 40);

            var trudyX = (aliceX + bobX) / 2;
            context.beginPath();
            context.strokeStyle = 'red';
            context.moveTo(trudyX, defaultY);
            var i = aliceX;
            var trudyY = defaultY + 100;
            interval = window.setInterval(function() {
                if(i != (trudyY)) {
                    i+= animIter;
                    context.lineTo(trudyX, i);
                    context.stroke();
                } else {
                    draw_circle(context, trudyX, trudyY, radius, 'red');
                    window.clearInterval(interval);
                    context.fillText("Trudy", trudyX-radius, 210);
                    
                    context.fillStyle = 'black';
                    context.fillText("But when their connection is unencrypted,", 20, explanationY);
                    context.fillText("Trudy can listen in.", 20, explanationY+lineSize);
                    
                }
            }, 15);
            break;
        case 3:
			draw_base(context, false);
			var i = 56;
            c3Y = explanationY;
            context.fillText("To stop their messages being tampered with, Alice and Bob can use symmetric encryption.", 20, c3Y);
            context.fillText("In symmetric encryption, both parties use the same key to encrypt and decrypt the message.", 20, c3Y+lineSize);
            c3Y += (lineSize*2);
            
			interval = window.setInterval(function() {
                i = draw_animated_encryption(context, i);
				if( i >= bobX) {
					window.clearInterval(interval);
                    context.fillStyle = 'blue';
                    context.fillText("Encrypted Message", 140, 40);
					context.fillStyle = 'black';
					
					context.fillText("But this requires both parties to have the same key.", 20, c3Y+lineSize);
					context.fillText("How do they share a key without already knowing it?", 20, c3Y+(lineSize*2));
				}
			}, 10);
			
			break;

            //To circumvent this they can use encryption
            //message -> key -> ciphertext animation
            //but if both parties don't have a key, how do they share?
        case 4:
            draw_base(context, false);
            context.fillText("One way past what is known as the Key Distribution Problem is to", 20, explanationY);
            context.fillText("share the key through a known secure channel beforehand (such as a physical courier).", 20, explanationY+lineSize);
            var x = i = aliceX;
            var y = defaultY;
            var secure_channel = false;
            context.moveTo(aliceX,defaultY);
            interval = window.setInterval(function() {
				if(secure_channel) {
                    context.lineWidth = 5;
                    i = draw_animated_encryption(context, i);
                    if(i >= bobX) {
                        window.clearInterval(interval);
                        context.fillStyle = "black";
                        context.fillText("But this solution isn't practical for most interactions, especially on the scale of the internet.", 20, explanationY+(lineSize*3));
                        context.fillText("And so we must use other methods, like Asymmetric Encryption.", 20, explanationY+(lineSize*4));
                    }
                } else {
                    //animated drawing of dotted line
                    if(x == bobX) {
                        if(y == defaultY) {
                            secure_channel = true;
                            context.fillText("Key shared over secure channel", 100, 190);
                            //drawing an arrow back to (70,70)
                            context.lineWidth = 2;
                            context.moveTo(bobX, 160);
                            context.lineTo(aliceX, 160);
                            context.stroke();
                            context.beginPath();
                            context.moveTo(aliceX, 160);
                            context.lineTo(80, 170);
                            context.lineTo(80, 150);
                            context.fill();
                        } else {
                            y -= animIter;
                            context.lineTo(x, y);
                        }
                    }
                    else if(y < 140) {
                        y += animIter;
                        context.lineTo(aliceX, y);
                    } else {
                        var gap = ((x - aliceX) % 20) == 0; //evaluates as a true or false for if we draw a gap
                        if(!gap || x == aliceX) {
                            x += animIter;
                            context.lineTo(x, 140);
                            context.stroke();
                        } else {
                            x += 10;
                            context.moveTo(x, 140);
                        }
                    }
                    context.stroke();
                }
            }, 10);
            //One way is a private channel for key sharing that only Alice and Bob know about
            //private channel -> message -> key -> ciphertext
			//But for anonymous interactions on the scale of the internet, this solution is unfeasible
			break;
        case 5:
            //draw_base(context, false);
            var messageY = 20;
            context.fillText("In Asymmetric Encryption, everyone has two personal keys.",20,messageY);
            context.fillText("In the RSA algorithm, these keys are created from three variables: e, p and q. ",20,messageY+lineSize);
            
            var midX = (aliceX+bobX)/2;

            draw_circle(context, midX, defaultY, radius, "black");
            context.fillText("Alice", midX+40, defaultY+5);
            


            //Generates two numbers, p and q
            break;
        case 6:
            //For Asymmetric Encryption to work, both sides have to first generate two keys
            //draw key generation example
			//Do smaller animations bit-by-bit to explain
			//Each person has two keys, a public key for encryption and a private key for decryption. 
            
            break;
    }
}

function draw() {
//sets up the canvas
    var canvas = document.getElementById("canvas1");
    if (canvas.getContext) {
        var context = canvas.getContext('2d');
        context.font = "16px Verdana";
        context.strokeStyle = 'black';
        context.fillStyle = 'black';
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        draw_steps(context);
    }
}

function button_click(iter) {
//iterates the counter for going through each step of the animation
    window.clearInterval(interval);
    counter += iter;
    draw();
    if(counter > 1) {
        $("#back").show();
    } else if(counter <= 1) {
        $("#back").hide();
    }
}

$("#continue").click(function() {
    button_click(1);
});

$("#back").click(function() {
    button_click(-1);
});

draw();
