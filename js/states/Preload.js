var MrHop = MrHop || {};

//loading the game assets
MrHop.PreloadState = {
  preload: function() {
    //show loading screen
    this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'preloadbar');
    this.preloadBar.anchor.setTo(0.5);
    this.preloadBar.scale.setTo(3);

    this.load.setPreloadSprite(this.preloadBar);

    //load game assets    
    this.load.image('playerDead', 'assets/images/player_dead.png');
    this.load.image('floor', 'assets/images/floor.png');
    this.load.image('water', 'assets/images/water.png');
    this.load.image('coin', 'assets/images/coin.png');
    this.load.image('background', 'assets/images/background.png');
    this.load.image('background2', 'assets/images/background2.jpg');
    this.load.spritesheet('player', 'assets/images/player_spritesheet.png', 59, 67, 2);
      this.load.spritesheet('enemy1', 'assets/images/enemigos1.png', 35, 70, 4,1);
      this.load.spritesheet('enemy2', 'assets/images/enemigos2.png', 32, 27, 4,1);
       this.load.spritesheet('enemy3', 'assets/images/enemigos3.png', 66, 130, 3,1);
    this.load.audio('coin', ['assets/audio/coin.mp3', 'assets/audio/coin.ogg']);
       this.load.text('level', 'assets/data/level.json');

  },
  create: function() {
    this.state.start('Game');
  }
};