//Sets up game
var Trivia = Trivia || {};

Trivia.GameState = {

  init: function() 
  {   
      //Stores all data from JSON file
      this.allData = JSON.parse(this.game.cache.getText('queryData'));
      //Initialize background
      this.background = this.add.sprite(0 + Trivia.offsetX, 0 + Trivia.offsetY, 'background');
      //Displays the 3 levels option with animation
      this.threeLevels = this.add.sprite(660 + Trivia.offsetX, 570 + Trivia.offsetY, 'threeLevels');
      this.threeLevels.anchor.setTo(0.5, 0.5);
      this.threeLevels.scale.setTo(0.5, 0.5);
      this.threeLevels.alpha = 0;
      this.add.tween(this.threeLevels.scale).to( { x: 1, y: 1 }, 2000, Phaser.Easing.Linear.None, true, 0, -1);
      this.add.tween(this.threeLevels).to( { alpha: 1 }, 2000, Phaser.Easing.Linear.None, true, 0, -1);
      //Keeps track of which query in the list is next
      this.currQuestion = -1;
      //Keeps track of how many items are unlocked
      this.progress = 0;
      //Recycles incorrect questions if second
      this.secondChances = [];
      //Keeps track of the current level
      this.currLevel = 0;
      //Keeps track of correctly answered questions since last object was recieved
      this.numAnswered = 0;
      //Holds the blackboxes
      this.games = this.add.group();
      //Holds the blackbox lightning effect
      this.lightning = this.add.group();
      //Stores shuffled indexes
      this.shuffled;
      //Stores game
      this.gameIndex;
      //Holds the prizes
      this.coupons = ['coupon1', 'coupon2', 'coupon3'];
      //Holds the level display
      this.display = ['level1', 'level2', 'level3'];
      //Holds the overlay backgrounds
      this.overlay = ['overlay1', 'overlay2', 'overlay3'];
      //boolean for coupon rotation
      this.rotate =true;
    },
    create: function()
    {
        this.createMain();
    },
    createMain: function()
    {
      var x=150;
      for(var i=0; i<this.allData.games.length; i++)
      {
          var lightning1 = this.add.sprite(x-50 + Trivia.offsetX, 240 + Trivia.offsetY, 'lightning');
          lightning1.scale.setTo(0.5, 0.5);
          lightning1.scale.y *= -1;
          lightning1.anchor.setTo(0.1, 0.1);
          this.lightning.add(lightning1);
          
          var lightning2 = this.add.sprite(x-50 + Trivia.offsetX, 440 + Trivia.offsetY, 'lightning');
          lightning2.scale.setTo(0.5, 0.5);
          lightning2.anchor.setTo(0.1, 0.1);
          this.lightning.add(lightning2);
          
          var b1 = this.add.button(x + Trivia.offsetX, 350 + Trivia.offsetY, 'spinBox', function(button)
              {
                Trivia.music.stop();
                Trivia.music = this.add.audio(this.allData.games[button.gameIndex].theme);
                Trivia.music.play();
                this.gameIndex=button.gameIndex;
                this.shuffled=this.shuffleData();
                this.currQuestion++;
                this.currLevel = 0;
        
                this.games.removeAll();
                this.lightning.removeAll();
                //Create the first question
                this.newLevel();
       
              }, this);
              b1.anchor.setTo(0.5, 0.5);
              b1.gameIndex = i;
              var anim = b1.animations.add('open');
              b1.animations.play('open', 16, true);
              this.games.add(b1);
          
          var label1 = this.add.button(x + Trivia.offsetX, 350 + Trivia.offsetY, this.allData.games[i].label, function(button)
              {
                Trivia.music.stop();
                Trivia.music = this.add.audio(this.allData.games[button.gameIndex].theme);
                Trivia.music.play();
                this.gameIndex=button.gameIndex;
                this.shuffled=this.shuffleData();
                this.currQuestion++;
                this.currLevel = 0;
        
                this.games.removeAll();
                this.lightning.removeAll();
                //Create the first question
                this.newLevel();
       
              }, this);
              label1.scale.setTo(0.5, 0.5);
              label1.anchor.setTo(0.5, 0.5);
              label1.gameIndex = i;
              label1.alpha = 0;
              label1.angle -= 15;
              var tween = this.add.tween(label1).to( { alpha: 1 }, 2000, Phaser.Easing.Linear.None, true, 0, -1);
              this.games.add(label1);
          
              x+=310;
          }
        this.world.bringToTop(this.games);
        
        var lightningTimer = this.time.events.loop(Phaser.Timer.SECOND * 0.1, function()
        {
            this.lightning.forEach(function(light)
            {
                var timer = this.time.events.add(Phaser.Timer.SECOND * Math.random(), function()
                {
                    light.alpha = 0;
                    this.time.events.add(Phaser.Timer.SECOND * Math.random(), function()
                    {
                        light.alpha = 1; 
                    }, this);
                }, this);
            }, this);
        }, this);
    },
    createQuestion: function()
    {
        //Add overlay
        this.gameOverlay = this.add.sprite(0 + Trivia.offsetX, 0 + Trivia.offsetY, this.overlay[this.currLevel]);
        //Hint button removes 1 answer
        this.hint = this.add.button(50 + Trivia.offsetX, 50 + Trivia.offsetY, 'hint', function()
        {
            if(!this.allData.games[this.gameIndex].levels[this.currLevel].queries[this.shuffled[this.currQuestion]].answer[0] && this.answer1.alive)
            {
                this.answer1.destroy();
            }
            else if(!this.allData.games[this.gameIndex].levels[this.currLevel].queries[this.shuffled[this.currQuestion]].answer[1] && this.answer2.alive)
            {
                this.answer2.destroy();
            }
            else if(!this.allData.games[this.gameIndex].levels[this.currLevel].queries[this.shuffled[this.currQuestion]].answer[2] && this.answer3.alive)
            {
                this.answer3.destroy();
            }
            else if(!this.allData.games[this.gameIndex].levels[this.currLevel].queries[this.shuffled[this.currQuestion]].answer[3] && this.answer4.alive)
            {
                this.answer4.destroy();
            }
        }, this);
        this.hint.scale.setTo(0.7, 0.7);
        
        var style={
            fill: "#FFFFFF",
            stroke: "#000000",
            strokeThickness: 4
        }
        //Get the next question
        this.query = this.add.text(350 + Trivia.offsetX, this.allData.games[this.gameIndex].query + Trivia.offsetY, this.allData.games[this.gameIndex].levels[this.currLevel].queries[this.shuffled[this.currQuestion]].question, style);
        //Create clickable answer
        this.answer1 = this.add.text(400 + Trivia.offsetX, this.allData.games[this.gameIndex].answer + Trivia.offsetY, "A: " + this.allData.games[this.gameIndex].levels[this.currLevel].queries[this.shuffled[this.currQuestion]].availAns[0], style);
        this.answer1.inputEnabled=true;
        this.answer1.events.onInputDown.add(function()
        {
            this.answered(this.allData.games[this.gameIndex].levels[this.currLevel].queries[this.shuffled[this.currQuestion]].answer[0]);
            this.answer1.inputEnabled=false;
            this.answer2.inputEnabled=false;
            this.answer3.inputEnabled=false;
            this.answer4.inputEnabled=false;
        }, this);
        
        this.answer2 = this.add.text(400 + Trivia.offsetX, (this.allData.games[this.gameIndex].answer + 50 + Trivia.offsetY), "B: " + this.allData.games[this.gameIndex].levels[this.currLevel].queries[this.shuffled[this.currQuestion]].availAns[1], style);
        this.answer2.inputEnabled=true;
        this.answer2.events.onInputDown.add(function()
        {
            this.answered(this.allData.games[this.gameIndex].levels[this.currLevel].queries[this.shuffled[this.currQuestion]].answer[1]);
            this.answer1.inputEnabled=false;
            this.answer2.inputEnabled=false;
            this.answer3.inputEnabled=false;
            this.answer4.inputEnabled=false;
        }, this);
        
        this.answer3 = this.add.text(400 + Trivia.offsetX, (this.allData.games[this.gameIndex].answer + 100 + Trivia.offsetY), "C: " + this.allData.games[this.gameIndex].levels[this.currLevel].queries[this.shuffled[this.currQuestion]].availAns[2], style);
        this.answer3.inputEnabled=true;
        this.answer3.events.onInputDown.add(function()
        {
            this.answered(this.allData.games[this.gameIndex].levels[this.currLevel].queries[this.shuffled[this.currQuestion]].answer[2]);
            this.answer1.inputEnabled=false;
            this.answer2.inputEnabled=false;
            this.answer3.inputEnabled=false;
            this.answer4.inputEnabled=false;
        }, this);
        
        this.answer4 = this.add.text(400 + Trivia.offsetX, (this.allData.games[this.gameIndex].answer + 150) + Trivia.offsetY, "D: " + this.allData.games[this.gameIndex].levels[this.currLevel].queries[this.shuffled[this.currQuestion]].availAns[3], style);
        this.answer4.inputEnabled=true;
        this.answer4.events.onInputDown.add(function()
        {
            this.answered(this.allData.games[this.gameIndex].levels[this.currLevel].queries[this.shuffled[this.currQuestion]].answer[3]);
            this.answer1.inputEnabled=false;
            this.answer2.inputEnabled=false;
            this.answer3.inputEnabled=false;
            this.answer4.inputEnabled=false;
        }, this);
        
    },
    answered: function(correct)
    {
        //Update the score if correct answer
        if(correct)
        {
            this.score++;
            Trivia.music.volume = 0.3;
            var sound = this.add.audio(this.allData.games[this.gameIndex].right);
            sound.play();
        }
        else
        {
            Trivia.music.volume = 0.3;
            var sound = this.add.audio(this.allData.games[this.gameIndex].wrong);
            sound.play();
        }
        sound.onStop.add(function()
        {
            Trivia.music.volume = 1;
        }, this);
        //Change the color red if incorrect, green if correct
        for(var i=0; i<this.allData.games[this.gameIndex].levels[this.currLevel].queries[this.shuffled[this.currQuestion]].answer.length; i++)
        {
            var color = '#FF0000';
            if(this.allData.games[this.gameIndex].levels[this.currLevel].queries[this.shuffled[this.currQuestion]].answer[i])
            {
                color = '#22AA22';
            }
            if(i==0)
            {
                var style = {
                    fill: color,
                    stroke: "#FFFFFF",
                    strokeThickness: 6
                };
                this.answer1.setStyle(style);
            }
            else if(i==1)
            {
                var style = {
                    fill: color,
                    stroke: "#FFFFFF",
                    strokeThickness: 5
                };
                this.answer2.setStyle(style);
            }
            else if(i==2)
            {
                var style = {
                    fill: color,
                    stroke: "#FFFFFF",
                    strokeThickness: 5
                };
                this.answer3.setStyle(style);
            }
            else if(i==3)
            {
                var style = {
                    fill: color,
                    stroke: "#FFFFFF",
                    strokeThickness: 5
                };
                this.answer4.setStyle(style);
            }
        }
        //Once player has seen correct answer reset with new question
        this.time.events.add(Phaser.Timer.SECOND * 1.5, function()
        {
            this.query.destroy();
            this.answer1.destroy();
            this.answer2.destroy();
            this.answer3.destroy();
            this.answer4.destroy();
            this.hint.destroy();
        
            this.currQuestion++;
            if(this.currQuestion != this.allData.games[this.gameIndex].levels[this.currLevel].queries.length)
            {
                this.gameOverlay.destroy();
                this.createQuestion();
            }
            else if(this.currLevel+1 != this.allData.games[this.gameIndex].levels.length)
            {          
                this.levelEnd();
            }
            else
            {
                this.gameEnd();
            }
        }, this);
  },
  //Shuffles indexes to be used to get random questions
  shuffleData: function()
  {
        //Temporary placeholders
        var len = this.allData.games[this.gameIndex].levels[this.currLevel].queries.length;
        var ret = [];
        //Note: this is a clone of queries, without cloning all values of queries become null
        var tem = Object.assign({}, this.allData.games[this.gameIndex].levels[this.currLevel].queries);
        var currIndex = 0;
        
        for(var i=0; i<len; i++)
        {
            //Chooses a random position in the list of queries
            var rand = Math.floor(Math.random() * (len-1));
            
            //When a query is used it is set to null
            //If the query at this random spot has been used and the random is within range increment to check next spot
            while(tem[rand]===null && rand < len)
            {
                rand++;
            }
            //If random value is too high reset to bottom
            if(rand >= len)
            {
                rand =0;
            }
            //Check again from bottom
            while(tem[rand]===null && rand < len)
            {
                rand++;
            }
            
            //Once found place in return array the type as type is the number digit corresponding to the queryData array
            ret[currIndex] = tem[rand].type;
            //Remove the used query
            tem[rand] = null;
            //Increment index so no overriding occurs 
            currIndex++;
        }
        //Return array of shuffled indexes
        return ret;
  },
  //If 'second chance' questions are to be used 'reload' the questions
  reloadQueries: function()
  {
      this.queryList = this.secondChances;
      this.secondChances = [];
      this.currQuery = 0;
      this.startQueries();
  },
  levelEnd: function()
  {
      this.endAnim();
      this.time.events.add(Phaser.Timer.SECOND * 6, function()
      {
        this.box.destroy();
        this.coupon.destroy();
        this.emitter.destroy();
        this.emitter2.destroy();
        this.rotate = true;  
        this.currLevel = this.currLevel + 1;
        if(this.currLevel<3)
        {
            this.shuffled = this.shuffleData();
        }
        this.currQuestion = 0;
        this.newLevel();
      }, this);
  },
  gameEnd: function()
  {
      this.endAnim();
      this.time.events.add(Phaser.Timer.SECOND * 6, function()
      {
        this.box.destroy();
        this.coupon.destroy();
        this.emitter.destroy();
        this.emitter2.destroy();
        this.rotate = true;
        document.getElementById('form1').submit();
      }, this);
  },
  endAnim: function()
  {
       //LightWave Effect
      var fragmentSrc = [
                        "precision mediump float;",
                        "uniform float     time;",
                        "uniform vec2     resolution;",
                        "#define PI 3.1415926535897932384626433832795",
                        "const float position = 0.0;",
                        "const float scale = 1.0;",
                        "const float intensity = 0.5;",
                        "float band(vec2 pos, float amplitude, float frequency) {",
                        "float wave = scale * amplitude * sin(1.0 * PI * frequency * pos.x + time) / 2.05;",
                        "float light = clamp(amplitude * frequency * 0.02, 0.001 + 0.001 / scale, 20.0) * scale / abs(wave - pos.y);",
                        "return light;",
                        "}",

                        "void main() {",
                            "vec3 color = vec3(0.24, 0.16, 0.45);",
                            "color = color == vec3(0.0)? vec3(0.45, 0.16, 0.24) : color;",
                            "vec2 pos = (gl_FragCoord.xy / resolution.xy);",
                            "pos.y += - 0.5;",
                            "float spectrum = 0.0;",
                            "const float lim = 5.0;",
                            "#define time time*0.037 + pos.x*10.",
                            "for(float i = 0.0; i < lim; i++){",
                                "spectrum += band(pos, 1.0*sin(time*0.1/PI), 1.0*sin(time*i/lim))/pow(lim, 0.25);",
                                "}",
                            "spectrum += band(pos, cos(10.7), 2.5);",
                            "spectrum += band(pos, 0.3, sin(2.0));",
                            "spectrum += band(pos, 0.05, 4.5);",
                            "spectrum += band(pos, 0.1, 7.0);",
                            "spectrum += band(pos, 0.1, 1.0);",
                            "gl_FragColor = vec4(color * spectrum, spectrum);",
                            "}"

                        ];

    this.filter = new Phaser.Filter(this, null, fragmentSrc);
    this.filter.setResolution(960, 640); 
    this.sprite = this.add.sprite();
    this.sprite.width = 960 + Trivia.offsetY;
    this.sprite.height = 640 + Trivia.offsetX;

    this.sprite.filters = [ this.filter ];
      
      
      
      Trivia.music.volume = 0.3;
      var sound = this.add.audio('levelUp');
      sound.play();
      
      this.box = this.add.sprite(200 + Trivia.offsetX, 0 + Trivia.offsetY, 'unBox');
      this.box.scale.setTo(0.4, 0.4);
      this.add.tween(this.box).to({y: 340}, 2000, Phaser.Easing.Linear.None, true);
      this.anim = this.box.animations.add('open');
      
      this.time.events.add(Phaser.Timer.SECOND, function()
      {
        this.box.animations.play('open', 20, false);
        this.anim.onComplete.add(function(box)
        {
            Trivia.music.volume = 0.3;
            var sound = this.add.audio('cheer');
            sound.play();
            
            this.coupon = this.add.sprite(box.x + Trivia.offsetX, 400 + Trivia.offsetY, this.coupons[this.currLevel]);
            this.coupon.x = box.x + (this.coupon.texture.width/4) + Trivia.offsetX;
            this.coupon.anchor.setTo(0.5, 0.5);
            this.coupon.scale.setTo(0.5, 0.5);
            this.coupon.alpha = 0;
            this.preTween = this.add.tween(this.coupon).to( { alpha: 1, x: 480 + Trivia.offsetX, y: 200 + Trivia.offsetY}, 2000, Phaser.Easing.Linear.None, true);
            this.preTween.onComplete.add(function()
            {
                this.coupon.rotation = 0;
                this.rotate = false;
            }, this);
            this.tween = this.add.tween(this.coupon.scale).to( { x: 1, y: 1}, 4000, Phaser.Easing.Linear.None, true);
              
            this.tween.onComplete.add(function()
            {
                this.emitter = this.add.emitter((this.coupon.x - (this.coupon.texture.width/2) + Trivia.offsetX), (this.coupon.y - (this.coupon.texture.height/2) + Trivia.offsetY), 2000);
                this.emitter.makeParticles('confetti', [0, 1, 2, 3, 4, 5]);
                this.emitter.setScale(2, 2);
                this.emitter.start(false, 5000, 5);
                  
                this.emitter2 = this.add.emitter(((this.coupon.x - (this.coupon.texture.width/2)+ this.coupon.texture.width + Trivia.offsetX)), (this.coupon.y - (this.coupon.texture.height/2) + Trivia.offsetY), 2000);
                this.emitter2.makeParticles('confetti', [0, 1, 2, 3, 4, 5]);
                this.emitter2.setScale(2, 2);
                this.emitter2.start(false, 5000, 5);
            }, this);
              
         }, this);
      }, this);
  },
  newLevel: function()
  {
      this.displayText = this.add.sprite(200 + Trivia.offsetX, 400 + Trivia.offsetY, this.display[this.currLevel]);
      this.displayText.anchor.setTo(0.5, 0.5);
      this.displayText.scale.setTo(0.5, 0.5);
      this.displayText.alpha = 0;
      this.add.tween(this.displayText).to( { alpha: 1, x: 480 + Trivia.offsetX, y: 200 + Trivia.offsetY}, 2000, Phaser.Easing.Linear.None, true);
      this.tween = this.add.tween(this.displayText.scale).to( { x: 1, y: 1}, 2000, Phaser.Easing.Linear.None, true);
              
      this.tween.onComplete.add(function()
      {
          this.displayText.destroy();
          if(this.gameOverlay != undefined)
          {
              this.gameOverlay.destroy();
          }
          this.createQuestion();
      }, this);
  },
  update: function()
  {
      if(this.filter!=undefined)
          this.filter.update();
      if(this.coupon != undefined && this.rotate)
          this.coupon.rotation += 0.5;
  }
};
//Sources v1: http://mocomi.com/cars-facts/
//https://quizup.net/cars/
//http://thenewswheel.com/10-fun-car-facts-you-probably-didnt-know/#Terrible-Drivers

//Sports
//https://globalnews.ca/news/3480769/sports-canadians-invented/
//http://www.canadashistory.ca/Education/Classroom-Resources/Canadian-Sports-History-Quiz
//https://www.canadiangeographic.ca/article/10-surprising-facts-about-sports-and-leisure
//http://paralympic.ca/our-history
//http://www.funtrivia.com/playquiz/quiz83182988498.html

//History
//http://toronto.citynews.ca/2007/11/09/could-you-pass-this-canadian-history-quiz/
//https://www.theglobeandmail.com/news/how-well-do-you-know-your-canadian-history-find-out-with-our-canada-dayquiz/article30710901/
//https://www.proprofs.com/quiz-school/quizshow.php?title=canadian-history-trivia&q=5&next=y
//http://www.everythingzoomer.com/quiz-canada-150/
//https://cottagelife.com/general/the-canadian-history-buff-quiz/
//https://globalnews.ca/news/3526717/canada-day-trivia-how-many-of-these-150-facts-do-you-know/
//http://www.dltk-kids.com/canada/canadian_trivia.htm
//http://www.nsnews.com/community/take-our-ultimate-canada-day-quiz-1.20857854