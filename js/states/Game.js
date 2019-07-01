var vidas = 10;
var lifeText = "";
var MrHop = MrHop || {};

//var vidasJugador = 3;
//var vidasJugadorTexto = 3;

MrHop.GameState = {

  init: function() {
    this.floorPool = this.add.group();
    this.platformPool = this.add.group();
    //corazones colector
    this.coinsPool = this.add.group();
    this.coinsPool.enableBody = true;
    //gravity
    this.game.physics.arcade.gravity.y = 1000;    
    //max jump distance
    this.maxJumpDistance = 120;
    //mover el jugador conla tecla arriba 
    this.cursors = this.game.input.keyboard.createCursorKeys();
    //corazones  
    this.myCoins = 0;
    
    //nivel de velocidad 
    this.levelSpeed = 100;
      
      
    
  },
    
  
};
