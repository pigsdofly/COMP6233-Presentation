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


function draw_line(context, startX, startY, endX, endY) {
//function for drawing a line during an interval
    context.beginPath();
    context.moveTo(startX, startY);
    context.lineTo(endX, endY);
    context.stroke();
                    
}

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
        draw_line(context, aliceX, defaultY, bobX, defaultY);
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

    if( i < leftBound || i >= (rightBound + radius) - animIter )
        context.strokeStyle = 'black';
    else
        context.strokeStyle = 'blue';

    i += animIter;
    draw_line(context, i-animIter, defaultY, i, defaultY);
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
            var i = aliceX;
            var trudyY = defaultY + 100;
            interval = window.setInterval(function() {
                if(i != (trudyY)) {
                    i+= animIter;
                    draw_line(context, trudyX, defaultY, trudyX, i);
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
            //Draws example of asymmetric key generation
            var messageY = 20;
            context.fillText("In Asymmetric Encryption, everyone has two personal keys.",20,messageY);
            context.fillText("In the RSA algorithm, these keys are created from three variables: e, p and q. ",20,messageY+lineSize);
            
            var midX = (aliceX+bobX)/2;

            draw_circle(context, midX, defaultY, radius, "black");
            context.fillText("Alice", midX+40, defaultY+5);
          
            var y = startY = defaultY;
            var iterator = 2;
            var startX = midX;
            interval = window.setInterval(function() {

                if(y == 120) {
                    context.fillText("Alice first generates two prime numbers, 87 (p) and 51 (q).", 300, 135);
                    context.fillText("87 (p)", midX - (iterator + 20), 135);
                    context.fillText("51 (q)", midX + 20, 135);
                    context.fillText("p * q", midX - 20, 165);
                    y += 20;
                } else if ( iterator == 10 && y > 120) { 
                    window.clearInterval(interval);
                    context.fillText("4437 (n)", midX-20, y + 20);
                    draw_line(context, midX, y+30, midX, y+50);
                    context.fillText("2150", midX-20, y+70);
                    draw_line(context, midX, y+80, midX, y+95);
                    context.fillText("69 (e)", midX-20, y+110);
                    draw_line(context, midX, y+115, midX, y+145);
                    context.fillText("779 (d)", midX-20, y+165);
                    context.fillText("These are then multiplied together to get 4437 (n).", 300, y + 20);
                    context.fillText("lcm(p-1, q-1)",midX + 20,y+45);
                    context.fillText("We then find the lowest common multiple of p-1 and  q-1, which in this case is 2150.",300,y+70);
                    context.fillText("e can be any number that is 'coprime' (doesn't share any factors) to 2150.",300,y+87);
                    context.fillText("69 is chosen.", 300, y+110);
                    context.fillText("We then work out the inverse of 69 mod 2150 to get d.",300,y+130);
                    context.fillText("Here it is 779.",300, y+165);
                    
                }

                if (y < 120) {
                    y += animIter;
                    draw_line(context, midX, startY, midX+iterator, y);
                    draw_line(context, midX, startY, midX-iterator, y);

                    iterator += 2;
                } else {
                    y += animIter;
                    draw_line(context, 270, 140, midX+iterator, y);
                    draw_line(context, 170, 140, midX-iterator, y);
                    
                    iterator -= 2;
                    
                }
            }, 15);


            //Generates two numbers, p and q
            //animation showing those numbers and then the maths used to generate keys
            break;
        case 6:
            context.fillText("Alice now has two keys, a public key and a private key", 20, 20);
            var midX = (aliceX+bobX)/2;
            var iterator = 2;
            var y = startY = defaultY;
            context.fillText("Alice", midX + (radius * 2), defaultY);
            draw_circle(context, midX, defaultY, radius, "black");
            
            interval = window.setInterval(function() {
                if (y < 120) {
                    y+=animIter;
                    draw_line(context, midX, startY, midX+iterator, y);
                    draw_line(context, midX, startY, midX-iterator, y);
                    iterator += 2.5;
                } else if(y == 120) {
                    draw_circle(context, midX+iterator, y, radius*0.65, "purple");
                    draw_circle(context, midX-iterator, y, radius*0.65, "green");
                    context.fillText("Public Key", (midX-iterator)-100, y);
                    context.fillStyle = "purple";
                    context.fillText("Private Key", (midX+iterator)+20, y);
                    y+=animIter;
                    startY = y;
                    rightX = midX + iterator;
                    leftX = midX - iterator;
                    iterator = 2;
                } else if(y >= 120) {
                    y+=2;
                    context.strokeStyle = "green";
                    draw_line(context, leftX, startY, leftX+iterator, y);
                    draw_line(context, leftX, startY, leftX-iterator, y);
                    context.strokeStyle = "purple";
                    draw_line(context, rightX, startY, rightX+iterator, y);
                    draw_line(context, rightX, startY, rightX-iterator, y);
                    iterator+=2.5;
                } 
                
                if(y >= 160) {
                    window.clearInterval(interval);
                    context.fillStyle = "black";
                    context.fillText("e", leftX-iterator-10, y+15);
                    context.fillText("n", leftX+iterator+10, y+15);
                    context.fillText("d",rightX+iterator, y+15);
                    
                    context.fillText("The public key is of the format (e, n) and is for encryption", 20, 200);
                    context.fillText("The private key is of the format (d, n) and is for decryption", 20, 220);
                    context.fillText("Alice can now publish her public key so that anybody can easily send her encrypted messages.", 20, 240);
                    context.fillText("Next, we'll see how asymmetric encryption is used in practice.", 20, 280);
                }
            }, 15);
            //For Asymmetric Encryption to work, both sides have to first generate two keys
            //draw key generation example
			//Do smaller animations bit-by-bit to explain
			//Each person has two keys, a public key for encryption and a private key for decryption. 
            
            break;
        case 7:
            context.fillText("Bob has also generated a public/private key pair.", 20, explanationY);
            draw_base(context,false);
            var startY = defaultY + 70;
            var x = aliceX;
            var leftBound = aliceX + 70;
            var rightBound = bobX - 70;
            var leftCircle = rightCircle = false;
            interval = window.setInterval(function() {
                if(x < leftBound) {
                    x += animIter;
                    draw_line(context, x-animIter, defaultY, x, defaultY); 
                } else if ( x == leftBound) {
                    if (!leftCircle) {
                        y = startY;
                        draw_circle(context, x, startY, radius * 0.65, "green");
                        leftCircle = true; 
                        context.fillText("Encrypt with", x-50, startY+10+radius);
                        context.fillText("Bob's Public Key", x-50, startY+27+radius); 
                    }
                    y-= 2;
                    draw_line(context, x, startY, x, y);
                } 
                if(y == defaultY && x < rightBound) {
                    context.strokeStyle = 'blue';
                    x+= animIter;
                    draw_line(context, x-animIter, defaultY, x, defaultY);
                }
                if (x == rightBound) {
                    if (!rightCircle) {
                        context.fillStyle = 'blue';
                        context.fillText("Encrypted Message", 140, 40);
                        y = startY;
                        draw_circle(context, x, startY, radius*0.65, "purple");
                        rightCircle = true;  
                        context.fillText("Decrypt with", x-50, startY+10+radius);
                        context.fillText("Bob's Private Key", x-50, startY+27+radius);
                    }
                    y -= 2;
                    draw_line(context, x, startY, x, y);
                }
                
                if(y == defaultY && x >= rightBound) {
                    context.strokeStyle = 'black';
                    x+= animIter;
                    draw_line(context, x-animIter, defaultY, x, defaultY);
                }
                
                if(x == bobX) {
                    context.fillStyle = 'black';
                    context.fillText("Alice uses Bob's public key to encrypt her message,", 20, explanationY+(lineSize*2));
                    context.fillText("and Bob uses his private key to decrypt.", 20, explanationY+(lineSize*3));
                    context.fillText("Asymmetric algorithms are typically used to set up an encrypted channel,", 20, explanationY+(lineSize*4));
                    context.fillText("because Alice doesn't need to know anything other than Bob's public key.", 20, explanationY+(lineSize*5));
                    window.clearInterval(interval);
                }
                
            }, 15);
            break;
        default:
            context.font = "32px Verdana";
            context.fillText("End.", context.canvas.width/2, context.canvas.height/2);
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
