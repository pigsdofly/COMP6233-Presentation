var counter = 1;
var radius = 20;
//interval variable for animations
var interval;
var anim_iter = 2;

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
    var textY = radius + 90;
    draw_circle(context, 70, 70, radius, 'black');
    draw_circle(context, 370, 70, radius, 'black');
    
    context.fillText("Alice", 45, textY);
    context.fillText("Bob", 350, textY);
    
	if(line) {
		context.beginPath();
		context.moveTo(70, 70);
		context.lineTo(370, 70);
		context.stroke();
	}
}

function draw_steps(context) {
//contains the main drawing code
    switch(counter) {
        case 1:
            //first screen
            draw_base(context, true);
    		context.fillText("Message", 181, 60);
            
            context.fillText("Alice and Bob want to send a message to each other.", 20, 230);
            
            break;
        case 2:
            draw_base(context, true);
    		context.fillText("Message", 181, 60);

            var trudyX = (70 + 370) / 2;
            context.beginPath();
            context.strokeStyle = 'red';
            context.moveTo(trudyX, 70);
            var i = 70;
            interval = window.setInterval(function() {
                if(i != 170) {
                    i+= anim_iter;
                    context.lineTo(trudyX, i);
                    context.stroke();
                } else {
                    draw_circle(context, trudyX, 170, radius, 'red');
                    window.clearInterval(interval);
                    context.fillText("Trudy", trudyX-radius, 210);
                    
                    context.fillStyle = 'black';
                    context.fillText("But when their connection is unencrypted,", 20, 240);
                    context.fillText("Trudy can listen in.", 20, 257);
                    
                }
            }, 15);
            break;
        case 3:
			draw_base(context, false);
			var i = 56;
			interval = window.setInterval(function() {
				if(i == 140 || i == 300) {
					draw_circle(context, i, 70, radius * 0.8, 'blue');
					context.fillText("Key", i-20, radius+85);
				}	

				if( i >= 370) {
					window.clearInterval(interval);
					context.fillStyle = 'black';
					context.fillText("One method of circumventing this is symmetric encryption.", 20, 240);
					context.fillText("But this requires both parties to have the same key.", 20, 257);
					context.fillText("How do they share a key without already knowing it?", 20, 274);
				} else if( i < 140 || i >= 318 ) {
					context.beginPath();
					context.moveTo(i, 70);
					context.strokeStyle = 'black';
					i += anim_iter;
					
					context.lineTo(i, 70);
					context.stroke();
				} else {
					context.beginPath();
					context.moveTo(i, 70);
					context.strokeStyle = 'blue';
					i += anim_iter;
					
					context.lineTo(i, 70);
					context.stroke();
				}
			}, 10);
			
			break;

            //To circumvent this they can use encryption
            //message -> key -> ciphertext animation
            //but if both parties don't have a key, how do they share?
        case 4:
            //One way is a private channel for key sharing that only Alice and Bob know
            //private channel -> message -> key -> ciphertext
			break;
        case 5:
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
