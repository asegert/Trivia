var Trivia = Trivia || {};

if(Phaser.Device.ie)
{
    if(Phaser.Device.ieVersion < 10)
    {
        document.getElementById("ieError").innerHTML = "Please upgrade your Browser <br><br> <a href = 'document.getElementById('form1').submit();'>Continue Past Game</a><br><a href = 'https://www.microsoft.com/en-ca/download/internet-explorer.aspx'>Internet Explorer</a><br><a href='https://www.google.com/chrome/browser/desktop/index.html'>Chrome</a><br><a href='https://www.mozilla.org/en-US/firefox/new/'>Firefox</a>";
    }
    else
    {
        if(window.screen.width < 960 || window.screen.height < 640)
        {
            Trivia.game = new Phaser.Game(window.screen.width, window.screen.height, Phaser.AUTO);
        }
        else
        {
            Trivia.game = new Phaser.Game(960, 640, Phaser.AUTO);
        }

        Trivia.game.state.add('Boot', Trivia.BootState); 
        Trivia.game.state.add('Preload', Trivia.PreloadState); 
        Trivia.game.state.add('Game', Trivia.GameState);
        Trivia.game.state.add('Story', Trivia.StoryState);

        Trivia.game.state.start('Boot'); 
    }
}
else
{
    if(window.screen.width < 960 || window.screen.height < 640)
    {
        Trivia.game = new Phaser.Game(window.screen.width, window.screen.height, Phaser.AUTO);
    }
    else
    {
        Trivia.game = new Phaser.Game(960, 640, Phaser.AUTO);
    }

    Trivia.game.state.add('Boot', Trivia.BootState); 
    Trivia.game.state.add('Preload', Trivia.PreloadState); 
    Trivia.game.state.add('Game', Trivia.GameState);
    Trivia.game.state.add('Story', Trivia.StoryState);

    Trivia.game.state.start('Boot');
}