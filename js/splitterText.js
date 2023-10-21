function splitterText(options) {

    // for readability, save variables of the options.
    var id = options.id;
    var text = document.getElementById(id).innerHTML;
    var containerclass = options.containerclass != null ? options.containerclass : "mask";
    var mclass = options.class != null ? options.class : "splitterLetter";
    var l = []; // return string
    var from = options.from; 
    var to = options.to;
    var escape = options.escape != null ? options.escape : " ";

    for (var i = 0; i < text.length; i++) {
      if (text.charAt(i) !=  escape)
        l +=
          '<div class="' +
          containerclass +
          '"> <span class="' +
          mclass +
          '" del="' +
          i +
          '">' +
          text.charAt(i) +
          "</span></div>";
      else l += "<br />";
    }
    // create elements inside target
    document.getElementById(id).innerHTML = l;



    // add custom CSS to elements
    containers = document.getElementsByClassName(containerclass);
    letters = document.getElementsByClassName(mclass);
    for (var i = 0; i < containers.length; i++) {
      containers[i].style.overflow = "hidden";
      containers[i].style.display = "inline-block";
    }
    for (var i = 0; i < letters.length; i++) {
      letters[i].style.display = "block";
    }



    // animate elements
    gsap.from("." + mclass, from);
    gsap.to("." + mclass, to);
  }

  window.onload = function() {
    var container = document.getElementById("container");
    
    var cW = container.offsetWidth;
    var cH = container.offsetHeight;
    var gravity = 2.55;
    var lifespan1 = 100;
    var lifespan2 = 150;
    var ground = .3 * cH;
    var startX;
    var r = 38;
    var speedX;
    var speedYDown = 3;
    var speedYUp = 15;
    var fontSize = 100;    
    if (cW > 500) {
        startX = 0.25 * cW;
        speedX = 0.005 * cW;
    } else {
        startX = 0.15 * cW;
        speedX = 0.007 * cW;
    }
    
    
    // Ball object
    var Ball = function(sLetter, index) {
        this.sLetter = sLetter;
        this.node;
        this.x = startX;
        this.y = ground - 50;
        this.index = index;
        this.r = r;
        this.jumpN = 0;
        this.speedY = speedYDown;
        this.speedX = speedX;
        this.opa = 1;
        this.create();
    }
    
    Ball.prototype = {
        create: function() {
            this.node = document.createElement("div");
            this.node.className = "ball";
            this.node.style.width = this.r + "px";
            this.node.style.height = this.r + "px";
            this.node.style.left = this.x + "px";
            this.node.style.top = this.y + "px";
            this.node.innerHTML = this.sLetter;
            container.appendChild(this.node);
            this.node.style.fontSize = fontSize + "px";
        },
        move: function() {
            this.y += this.speedY;
            this.x += this.speedX;
        
        },
        display: function() {
            //this.node.style.transform = "translate("+ this.x + "px," + this.y + "px)";
            //this.node.style.top = this.y + "px";
            //this.node.style.left = this.x + "px";
          this.node.style.top = this.y / cH * 100 + "%";
            this.node.style.left = this.x / cW * 100 + "%";
        }
    }
    
    
    // TextBall object
    var TextBalls = function(sText) {
        this.sText = sText + " ";
        this.n = sText.length + 1;
        this.balls = [];
        this.timeIntv = null;
        this.life = 0;
        this.createBalls();
        
    }
    TextBalls.prototype = {
        createBalls: function() {
            for (var i = 0; i < this.n; i++) {
                var ball = new Ball(this.sText[i], i);
                this.balls.push(ball);
            }
            this.balls[this.n-1].node.className = "cover";
            this.balls[this.n-1].xTarget = cW;
        },
        
        move: function() {
            var thisObj = this;
            this.timeIntv = setInterval(function(){
                thisObj.life++;
                if (thisObj.life < lifespan2) {
                    for (var i = 0; i < thisObj.n; i++) {
                        var ball = thisObj.balls[i];                        
                        if (ball.y < ground) {
                            ball.speedY += gravity;                                
                        } else {
                            ball.y = ground;
                            if (ball.jumpN < i || i == thisObj.n - 1) {
                                ball.jumpN++;
                                ball.speedY = - speedYUp;
                            } else {
                                ball.speedY = 0;
                                ball.speedX = 0;                                                              
                            }
                        }                        
                        
                        ball.move();
                        ball.display();                    
                    }
                    if (thisObj.life > lifespan1) {
                        var coverB1 = thisObj.balls[thisObj.n-1];
                        coverB1.opa = coverB1.opa > 0? coverB1.opa-0.025 : 0;
                        coverB1.node.style.opacity = coverB1.opa;
                    }
                }  else {clearInterval(thisObj.timeIntv);}                
                
            }, 50);
        }
    }
    
    var tb = new TextBalls("ABOUT US");
    tb.move();
    
}