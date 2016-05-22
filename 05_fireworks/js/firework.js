(function($){
    $.fn.disableSelection = function() {
        return this
                 .attr('unselectable', 'on')
                 .css('user-select', 'none')
                 .on('selectstart', false);
    };
})(jQuery);

$(document).ready(function () {
	var canvas = $('canvas')[0],
		ctx = canvas.getContext('2d'),
		h = $("canvas").height(),
		w = $("canvas").width(),
		rockets = [],
		particles = [],
        fps = 30,
		time_interval =  1.0 / fps ,
		acceleration = 30;

		canvas.height = h;
		canvas.width = w;

	function Particle(x, y, color, size) {
		this.x = x;
		this.y = y;
		this.x0 = x;
		this.y0 = y;
		this.v0 = Math.random() * 100;
		this.angle = Math.random() * (360 * Math.PI / 180);
		this.time = 0;
        this.lifeTime = (1.5 + Math.random() * 1.5);
		this.r = size,
		this.color = color;
	};

    function tickParticles() {
        drawParticles();
        
        evolveParticles();
        
        killParticles();
    }
    
	function drawParticles() {
		_.each(particles, function (part) {
			ctx.fillStyle = part.color;
			ctx.beginPath();
			ctx.arc(part.x, part.y, part.r, 0, 2 * Math.PI);
			ctx.fill();
			ctx.closePath();
		});
	};

    function killParticles() {
        _.each(particles, function (part) {
            if (part != undefined) {
                if (part.time > part.lifeTime) {
                    particles.splice(part, 1);
                }
            }
        });
    };
    
	function evolveParticles() {
		_.each(particles, function (part) {
            var v0x = part.v0 * Math.sin(part.angle);
            var v0y = part.v0 * Math.cos(part.angle);

            part.time += time_interval;

            part.x = part.x0 + v0x * part.time; 
            part.y = part.y0 - v0y * part.time + acceleration * Math.pow(part.time, 2);

		});
	};

	function Rocket(x, y) {
		this.x0 = w / 2;
		this.x = w / 2;
		this.xf = x;
		this.y0 = h;
		this.y = h;
		this.yf = y;
		this.v = 400;
		this.vx;
		this.vy;
        this.fired = false;
	};

    
    function tickRockets() {
        drawRockets();
        
        checkRockets();
        
        killRockets();
    }
    
    function killRockets() {
        _.each(rockets, function (rocket, i) {
            if (rocket != undefined) {
                if (rocket.fired == true) {
                    rockets.splice(rocket, 1);
                }
            }
        });
    };

	function checkRockets() {
        _.each(rockets, function (rocket, i) {
            if (rocket.x_dif < 0) {
                if (rocket.x < rocket.xf && rocket.y < rocket.yf) {
                    rocket.fired = true;
                    explodeRocket(rocket)
                }
            } else {
                if (rocket.x > rocket.xf && rocket.y < rocket.yf) {
                    rocket.fired = true;
                    explodeRocket(rocket)
                }			
            }
        });
	};

	function explodeRocket(rocket) {
        var x = rocket.x,
            y = rocket.y;
		var color = null,
			num = randomInt(50, 100);
        
        color = 'hsl(' + randomInt(0, 360) + ', 100%, 65%)';
		for (var i = 0; i < num/2; i++) {
			var size = Math.random()*1.8;
			particles.push(new Particle(x, y, color, size));
		}
        color = 'hsl(' + randomInt(0, 360) + ', 100%, 65%)';
        for (var i = 0; i < num/2; i++) {
			var size = Math.random()*1.8;
			particles.push(new Particle(x, y, color, size));
		}
	};
    
	function drawRockets() {
		_.each(rockets, function (rocket, i) {			
			ctx.strokeStyle = 'orange';
			ctx.lineWidth = 2;
			ctx.beginPath();
			ctx.moveTo(rocket.x0, rocket.y0);
			ctx.lineTo(rocket.x, rocket.y);
			ctx.stroke();
			ctx.closePath();

			rocket.x0 = rocket.x;			
			rocket.y0 = rocket.y;			
			
			rocket.x += rocket.vx * time_interval;
			rocket.y += rocket.vy * time_interval;				
		});
	};
    
    function launchRocket(x, y) {
        var rocket = new Rocket(x, y);

		rocket['x_dif'] = rocket.xf - rocket.x0;
		rocket['y_dif'] = rocket.yf - rocket.y0;

		rocket['vx'] = (rocket.v * rocket.x_dif)/(Math.sqrt((Math.pow(rocket.x_dif, 2) + Math.pow(rocket.y_dif, 2))));
		rocket['vy'] = (rocket.v * rocket.y_dif)/(Math.sqrt((Math.pow(rocket.x_dif, 2) + Math.pow(rocket.y_dif, 2))));
        
        rockets.push(rocket);
    }

	$('canvas').on('click', function (e) {
        if(rockets.length < 5) {
            launchRocket(e.pageX, e.pageY);
        }
	});

    
    function paintScreen() {
		ctx.fillStyle = 'rgba(0,0,0,0.2)';
		ctx.fillRect(0, 0, w, h);

		tickRockets();
        
		tickParticles();
	};
    
	paintScreen();    
    setInterval(paintScreen, 1000 / fps);
	
	$('body').disableSelection();
	
});

function randomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
};



