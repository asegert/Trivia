//Sets up game
var Trivia = Trivia || {};

Trivia.StoryState = {
    init: function()
    {
        Trivia.offsetX = 0;
        Trivia.offsetY = 0;
        if(!this.game.device.desktop) 
        {
            Trivia.game.scale.setGameSize(window.screen.width, window.screen.height);
            Trivia.portrait = false;
            Trivia.game.world.scale.x = window.screen.width/960;
            Trivia.game.world.scale.y = window.screen.height/640;
            Trivia.game.world.pivot.x = 0;
            Trivia.game.world.pivot.y = 0;
            Trivia.game.world.rotation = 0;
            
            if(window.screen.width > 960)
            {
                Trivia.game.world.scale.x = 1;
                Trivia.game.world.scale.y = 1;
            }
            else if(window.screen.height > window.screen.width)
            {
                Trivia.portrait = true;
                Trivia.offsetX = window.screen.width;
                Trivia.offsetY = window.screen.width-360;
                Trivia.game.world.scale.x = window.screen.width/640;
                Trivia.game.world.scale.y = window.screen.height/1200;
                Trivia.game.world.pivot.x = window.screen.width;
                Trivia.game.world.pivot.y = window.screen.height;
                Trivia.game.world.rotation = 1.57;
            }
        }
    },
    create: function()
    {
        Trivia.music = this.add.audio('blackbox0');
        Trivia.music.play();
        
        this.add.sprite(0 + Trivia.offsetX, 0 + Trivia.offsetY, 'story');
        this.add.sprite(90 + Trivia.offsetX, 20 + Trivia.offsetY, 'top');
        this.add.button(550 + Trivia.offsetX, 460 + Trivia.offsetY, 'start', function()
        {
            this.state.start('Game');
        }, this);
        
        this.createBox(90 + Trivia.offsetX, 'bottom1', 1);
        this.createBox(240 + Trivia.offsetX, 'bottom2', 2);
        this.createBox(390 + Trivia.offsetX, 'bottom3', 3);
        this.add.sprite(70 + Trivia.offsetX, 120 + Trivia.offsetY, 'title');
    },
    createBox: function(x, img, time)
    {
        var b1 = this.add.sprite(x, 490 + Trivia.offsetY, 'spinBoxInit');
        b1.anchor.setTo(0.5, 0.5);
        b1.scale.setTo(0.5, 0.5);
        var anim1 = b1.animations.add('open');
        b1.animations.play('open', 16, true);
        
        var label1 = this.add.sprite(x, 490 + Trivia.offsetY, img);
        label1.scale.setTo(0.5, 0.5);
        label1.anchor.setTo(0.5, 0.5);
        label1.alpha = 0;
        label1.angle -= 15;
        this.time.events.add(Phaser.Timer.SECOND * time, function()
        {
            this.add.tween(label1).to( { alpha: 1 }, 3000, Phaser.Easing.Linear.None, true, 0, -1);
        }, this);
        
        this.lightning = this.add.group();
        
        this.createLightning(50 + Trivia.offsetX, 150 + Trivia.offsetY, true);
        this.createLightning(950 + Trivia.offsetX, 150 + Trivia.offsetY, false);
        
         this.time.events.loop(Phaser.Timer.SECOND * 2, function()
         {
             this.electric();
         }, this);
    },
    createLightning: function(x, y, flip)
    {
        var lightning1 = this.add.sprite(x, y, 'lightning');
        //lightning1.scale.setTo(0.5, 0.5);
        lightning1.anchor.setTo(0.1, 0.1);
        lightning1.rotation +=5;
        lightning1.alpha = 0;
        lightning1.throw = true;
        if(!flip)
        {
            lightning1.scale.x *= -1;
            lightning1.rotation -=10;
            lightning1.throw = false;
        }
        this.lightning.add(lightning1);
    },
    electric: function()
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
                light.throw = false;
            }, this);
        }, this);
    },
    update: function()
    {
        if(!this.game.device.desktop && !Trivia.portrait && window.screen.height > window.screen.width) 
        {
            this.state.start('Story');
        }
        else if(!this.game.device.desktop && Trivia.portrait && window.screen.height < window.screen.width)
        {
            this.state.start('Story');
        }
    }
}