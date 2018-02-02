var Trivia = Trivia || {};

//loading the game assets
Trivia.PreloadState = {
  preload: function() {
    //show loading screen
    this.stage.backgroundColor = "#000000";
    this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'bar');
    this.preloadBar.anchor.setTo(0.5);
    this.preloadBar.scale.setTo(1, 1);
    this.load.setPreloadSprite(this.preloadBar);
		this.preloadResources();
	},
	preloadResources: function() {
		var pack = {
    'image': [
        ['background', 'assets/images/background.png'],
        ['story', 'assets/images/instructions.png'],
        ['overlay1', 'assets/images/questions-background.png'],
        ['overlay2', 'assets/images/questions-background-level2.png'],
        ['overlay3', 'assets/images/questions-background-level3.png'],
        ['title', 'assets/images/landing_title.png'],
        ['top', 'assets/images/landing_topText.png'],
		['bottom1', 'assets/images/landing_bottom1.png'],
		['bottom2', 'assets/images/landing_bottom2.png'],
		['bottom3', 'assets/images/landing_bottom3.png'],
		['threeLevels', 'assets/images/threelevels.png'],
		['blackbox', 'assets/images/blackBox.png'],
		['hint', 'assets/images/hint.png'],
        ['start', 'assets/images/start_button.png'],
		['coupon1', 'assets/images/coupon1.jpg'],
		['coupon2', 'assets/images/coupon2.jpg'],
		['coupon3', 'assets/images/coupon3.jpg'],
		['level1', 'assets/images/levelone.png'],
		['level2', 'assets/images/leveltwo.png'],
		['level3', 'assets/images/levelthree.png'],
		['hockey', 'assets/images/hockey_label.png'],
        ['history', 'assets/images/history_label.png'],
        ['music', 'assets/images/music_label.png'],
        ['lightning', 'assets/images/lightning.png']
	],
	'spritesheet': [
		['unBox', 'assets/images/box_spritesheet.png', 500, 500, 5],
        ['spinBox', 'assets/images/spinBox.png', 242, 210, 9],
        ['spinBoxInit', 'assets/images/spinBox_purple.png', 242, 210, 9],
		['confetti', 'assets/images/confetti.png', 16, 3, 6],
		['boxBroken', 'assets/images/boxBroken.png', 27, 18, 2]
	],
	'audio': [
		['blackbox0', ['assets/audio/blackbox0.mp3', 'assets/audio/blackbox0.mp4', 'assets/audio/blackbox0.ogg']],
		['sports', ['assets/audio/sports.mp3', 'assets/audio/sports.mp4', 'assets/audio/sports.ogg']],
        ['music', ['assets/audio/music.mp3', 'assets/audio/music.mp4', 'assets/audio/music.ogg']],
        //['history', ['assets/audio/history.mp3', 'assets/audio/history.mp4', 'assets/audio/history.ogg']],
        ['applause', ['assets/audio/applause.mp3', 'assets/audio/applause.mp4', 'assets/audio/applause.ogg']],
        ['buzzer', ['assets/audio/buzzer.mp3', 'assets/audio/buzzer.mp4', 'assets/audio/buzzer.ogg']],
		['riff', ['assets/audio/riff.mp3', 'assets/audio/riff.mp4', 'assets/audio/riff.ogg']],
        ['elephant', ['assets/audio/elephant.mp3', 'assets/audio/elephant.mp4', 'assets/audio/elephant.ogg']],
        ['crow', ['assets/audio/crow.mp3', 'assets/audio/crow.mp4', 'assets/audio/crow.ogg']],
        ['levelUp', ['assets/audio/levelUp.mp3', 'assets/audio/levelUp.mp4', 'assets/audio/levelUp.ogg']],
        ['cheer', ['assets/audio/cheer.mp3', 'assets/audio/cheer.mp4', 'assets/audio/cheer.ogg']]
	],
    'text': [
        ['queryData', 'assets/data/queryData.json']
    ]
};
		for(var method in pack) {
			pack[method].forEach(function(args) {
				var loader = this.load[method];
				loader && loader.apply(this.load, args);
			}, this);
		}
	},
	create: function() {
		this.state.start('Story');
	}
};   
    //Data
    //Contains queries which have a question, an arry of available answers (the text answers to be displayed), an answer array that holds the boolean values corresponding to the available answers index, and a type property to indicate it's index
    //Note: 25 character indent
