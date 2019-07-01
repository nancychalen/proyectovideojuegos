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
    
    create: function(){
   
    //movimiento de fondo
    this.background = this.add.tileSprite(0, 0, this.game.world.width, this.game.world.height, 'background');
    this.background.tileScale.y = 2;
    this.background.autoScroll(-this.levelSpeed/2, 0);
    this.game.world.sendToBack(this.background);
            
    //create the player
    this.player = this.add.sprite(50, 140, 'player');
    this.player.anchor.setTo(0.5);
    this.player.animations.add('running', [0, 1, 0],9, true);
    this.game.physics.arcade.enable(this.player);
    
    //cambiar el cuadroo demilitadpor 
    this.player.body.setSize(10, 60, 0, 0);
    this.player.play('running');
    
    //codigfo de plataforma 
    this.currentPlatform = new MrHop.Platform(this.game, this.floorPool, 11, 0, 200, -this.levelSpeed, this.coinsPool);
    this.platformPool.add(this.currentPlatform);
    
    //coin sound
    this.coinSound = this.add.audio('coin');
    
    this.loadLevel();
    
    //moving water
    this.water = this.add.tileSprite(0, this.game.world.height - 30, this.game.world.width, 30, 'water');
    this.water.autoScroll(-this.levelSpeed/2, 0);
    
    //mostrar nuemor de corazones 
    var style = {font: '30px Arial', fill: '#fff'};
    this.coinsCountLabel = this.add.text(10, 20, '0', style);
      /*
    var style = {font: '30px Arial', fill: '#fff'};
    this.life = this.add.text(10, 20, '0', style);
      */
      
      
       this.levelData = JSON.parse(this.game.cache.getText('level'));
      
      //var styleL = {font: '16px Arial', fill: '#fff'};
    // this.lifeText = game.add.text(50, 20, "vidas", style);
    //this.lifeText.fixedToCamera = true;
      
      
    this.enemys = this.add.group();
    this.enemys.enableBody = true;
     
       var enemy1;
    this.levelData.enemy1.forEach(function(element){
      enemy1 = this.enemys.create(element.x, element.y, 'enemy1');
      enemy1.animations.add('enemy1', [0, 1], 4, true);
        enemy1.scale.setTo(1.5, 1.5);
      enemy1.play('enemy1');
    enemy1.body.velocity.x = -30;
    }, this);

      this.enemys.setAll('body.allowGravity', false);
      
    
//    this.heart = this.add.sprite(this.levelData.playerStart.x, this.levelData.playerStart.y, 'heart', 1);
//    this.heart.anchor.setTo(-7.5,14.3);   
//    this.heart.fixedToCamera = true;
//    var styleL = {font: '16px Arial', fill: '#fff'};
//    lifeText = game.add.text(342, 11, vidas, styleL);
//    lifeText.fixedToCamera = true;
},   
  
    update: function() {    
    if(this.player.alive) {
      this.platformPool.forEachAlive(function(platform, index){
        this.game.physics.arcade.collide(this.player, platform);
                this.game.physics.arcade.collide(this.player, this.enemys, this.eliminarenemigo,null,this);


        //check if a platform needs to be killed
        if(platform.length && platform.children[platform.length-1].right < 0) {
          platform.kill();
        }    
      }, this);   

      this.game.physics.arcade.overlap(this.player, this.coinsPool, this.collectCoin, null, this);

      if(this.player.body.touching.down) {
        this.player.body.velocity.x = this.levelSpeed;
      }
      else {
        this.player.body.velocity.x = 0;
      }

      if(this.cursors.up.isDown || this.game.input.activePointer.isDown) {
        this.playerJump();
      }
      else if(this.cursors.up.isUp || this.game.input.activePointer.isUp) {
        this.isJumping = false;
      }

      if(this.currentPlatform.length && this.currentPlatform.children[this.currentPlatform.length-1].right < this.game.world.width) {
        this.createPlatform();
      }
      
      //check if the player needs to die
      if(this.player.top >= this.game.world.height || this.player.left <= 0) {
        this.gameOver();
      }
      if(this.myCoins==3){
          this.game.world.remove(this.background);
          this.game.world.remove(this.water);
          this.game.state.start('SecondLevel');
         
      }
      //kill coins that leave the screen
      this.coinsPool.forEachAlive(function(coin){
		  if(coin.right <= 0) {
			  coin.kill();
		  }
	  }, this);
    }
     
  },
    
    playerJump: function(){
    if(this.player.body.touching.down) {
      //starting point of the jump
      this.startJumpY = this.player.y;
      
      //keep track of the fact that it is jumping
      this.isJumping = true;
      this.jumpPeaked = false;
      
      this.player.body.velocity.y = -300;
    }
    else if(this.isJumping && !this.jumpPeaked) {
      var distanceJumped = this.startJumpY - this.player.y;
      
      if(distanceJumped <= this.maxJumpDistance) {
        this.player.body.velocity.y = -300;
      }
      else {
        this.jumpPeaked = true;
      }
    } 
  },
    
    
    
     loadLevel: function(){
          
    this.createPlatform();
  },
    
  createPlatform: function(){
    var nextPlatformData = this.generateRandomPlatform();
    
    if(nextPlatformData) {
      
      this.currentPlatform = this.platformPool.getFirstDead();
      
      if(!this.currentPlatform) {
        this.currentPlatform = new MrHop.Platform(this.game, this.floorPool, nextPlatformData.numTiles, this.game.world.width + nextPlatformData.separation, nextPlatformData.y, -this.levelSpeed, this.coinsPool);   
      }
      else {
        this.currentPlatform.prepare(nextPlatformData.numTiles, this.game.world.width + nextPlatformData.separation, nextPlatformData.y, -this.levelSpeed);   
      }

      this.platformPool.add(this.currentPlatform);

    }
  },
    
     generateRandomPlatform: function() {
    
    var data = {};
    
    //distance from the previous platform
    var minSeparation = 60;
    var maxSeparation = 100;
    data.separation = minSeparation + Math.random() * (maxSeparation - minSeparation);
    
    //y in regards to the previous platform
    var minDifY = -120;
    var maxDifY = 120;    
    
    data.y = this.currentPlatform.children[0].y + minDifY + Math.random() * (maxDifY - minDifY);
    data.y = Math.max(150, data.y);
    data.y = Math.min(this.game.world.height - 50, data.y);
        
    //numberde coraoznes 
    var minTiles = 1;
    var maxTiles = 5;
    data.numTiles = minTiles + Math.random() * (maxTiles - minTiles);
      
    return data;
      
     
  },  
     
};
