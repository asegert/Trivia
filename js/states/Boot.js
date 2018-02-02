var Trivia = Trivia || {};

Trivia.BootState = {
  init: function() {
    //loading screen will have a white background
    this.stage.backgroundColor = '#fff';

    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

    //have the game centered horizontally
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
  },
  preload: function() {
    //assets we'll use in the loading screen
    this.load.image('bar', 'assets/images/bar.png');
  },
  create: function () {
        this.state.start('Preload');
    }
};