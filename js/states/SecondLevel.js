var MrHop = MrHop || {};

MrHop.SecondLevelState = {


init: function() {
    this.floorPool = this.add.group();
    
    //pool of platforms
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
    this.levelSpeed = 200;
    
    this.RUNNING_SPEED = 180;
    this.JUMPING_SPEED = 450;
    
  },

  create: function() {
    //movimiento de fondo
    this.background = this.add.tileSprite(0, 0, this.game.world.width, this.game.world.height, 'background2');
    this.background.tileScale.y = 1.2;
    this.background.tileScale.x = 1.3;
    this.game.world.sendToBack(this.background);
            
    //create the player
    this.player = this.add.sprite(50, 140, 'player');
    this.player.anchor.setTo(0.5);
    this.player.animations.add('running', [0, 1, 0],9, true);
    this.game.physics.arcade.enable(this.player);
    this.player.customParams = {};
    this.player.body.collideWorldBounds = true;
      
       this.levelData = JSON.parse(this.game.cache.getText('level'));

      
   
      this.enemys2 = this.add.group();
        this.enemys2.enableBody = true;
      
      this.enemys3 = this.add.group();
        this.enemys3.enableBody = true;
     
//      
//  var enemy1;
//    this.levelData.enemy1.forEach(function(element){
//      enemy1 = this.enemys.create(element.x, element.y, 'enemy1');
//      enemy1.animations.add('enemy1', [0, 1], 4, true);
//        enemy1.scale.setTo(0.5, 0.5);
//      enemy1.play('enemy1');
//    enemy1.body.velocity.x = -10;
//    }, this);
      
     var enemy2;
    this.levelData.enemy2.forEach(function(element){
      enemy2 = this.enemys2.create(element.x, element.y, 'enemy2');
      enemy2.animations.add('enemy2', [0, 1,2], 2, true);
        
        enemy2.scale.setTo(1.5, 1.5);
      enemy2.play('enemy2');
        enemy2.vida = 2;
    enemy2.body.velocity.x = -30;
    }, this);
//      
      var enemy3;
    this.levelData.enemy3.forEach(function(element){
      enemy3 = this.enemys3.create(element.x, element.y, 'enemy3');
      enemy3.animations.add('enemy3', [0, 1,2], 3, true);
        
        enemy3.scale.setTo(0.5, 0.5);
      enemy3.play('enemy3');
        enemy3.vida = 5;
    enemy3.body.velocity.x = -30;
    }, this);
//      
     this.enemys2.setAll('body.allowGravity', false);
      this.enemys3.setAll('body.allowGravity', false);
      // this.enemys1.setAll('body.allowGravity', false);
       
    this.currentPlatform = new MrHop.Platform(this.game, this.floorPool, 15, 0, this.game.world.height-25, 0, this.coinsPool);   
    this.platformPool.add(this.currentPlatform);      
  },   
  
 update: function() {    
      this.platformPool.forEachAlive(function(platform, index){
        this.game.physics.arcade.collide(this.player, platform);
      }, this);  
      //this.game.physics.arcade.collide(this.player, this.enemys, this.eliminarenemigo,null,this);
       this.game.physics.arcade.collide(this.player, this.enemys2, this.eliminarenemigo,null,this);
      this.game.physics.arcade.collide(this.player, this.enemys3, this.eliminarenemigo,null,this);
      //this.game.physics.arcade.collide(this.player, this.enemys1,this.eliminarenemigo,null,this);
      this.game.physics.arcade.collide(this.player, this.coinsPool,this.sumarvida,null,this);
      this.game.physics.arcade.overlap(this.player, this.coinsPool, this.collectCoin ,null, this);

      this.player.body.velocity.x = 0;
      if(this.cursors.left.isDown || this.player.customParams.isMovingLeft) {
      this.player.body.velocity.x = -this.RUNNING_SPEED;
      this.player.scale.setTo(-0.8, 0.8);
      this.player.play('running');
    }
    else if(this.cursors.right.isDown || this.player.customParams.isMovingRight) {
      this.player.body.velocity.x = this.RUNNING_SPEED;
      this.player.scale.setTo(0.8, 0.8);
      this.player.play('running');
    }
    else {
      this.player.animations.stop();
      this.player.frame = 3;
    }

    if((this.cursors.up.isDown || this.player.customParams.mustJump) && this.player.body.touching.down) {
      this.player.body.velocity.y = -this.JUMPING_SPEED;
      this.player.customParams.mustJump = false;
        
    }
  },
    
     gameOver: function(){
    this.player.kill();    
    this.updateHighscore();
    
    //game over overlay
    this.overlay = this.add.bitmapData(this.game.width, this.game.height);
    this.overlay.ctx.fillStyle = '#000';
    this.overlay.ctx.fillRect(0, 0, this.game.width, this.game.height);
    
    //sprite for the overlay
    this.panel = this.add.sprite(0, this.game.height, this.overlay);
    this.panel.alpha = 0.55;
    
    //overlay raising tween animation
    var gameOverPanel = this.add.tween(this.panel);
    gameOverPanel.to({y: 0}, 500);
    
    //stop all movement after the overlay reaches the top
    gameOverPanel.onComplete.add(function(){
      
      var style = {font: '30px Arial', fill: '#fff'};
      this.add.text(this.game.width/2, this.game.height/2, 'GAME OVER', style).anchor.setTo(0.5);
      
      style = {font: '20px Arial', fill: '#fff'};
      this.add.text(this.game.width/2, this.game.height/2 + 50, 'High score: ' + this.highScore, style).anchor.setTo(0.5);
      
      this.add.text(this.game.width/2, this.game.height/2 + 80, 'Your score: ' + this.myCoins, style).anchor.setTo(0.5);
      
      style = {font: '10px Arial', fill: '#fff'};
      this.add.text(this.game.width/2, this.game.height/2 + 120, 'Tap to play again', style).anchor.setTo(0.5);
      
      this.game.input.onDown.addOnce(this.restart, this);
      
      
    }, this);
    
    gameOverPanel.start();
    
  },
    eliminarenemigo: function(player,enemys){
        if (enemys.body.touching.up) {
            enemys.body.bounce.set(0,1);
       //player.body.bounce.set(0,10;
        }else{
            vidas--;
        alert(vidas);
        }
        //enemys.kill();
        
        //enemys.body.bounce.set(0,1);
        //player.body.bounce.set(0,1);
        if(vidas == 0){
            vidas =5;
           this.gameOver();
        }
        
    },
  restart: function(){
    this.game.world.remove(this.background);
    this.game.world.remove(this.water);
    
    this.game.state.start('SecondLevel');
  },
    sumarvida: function(player, corazon){
    corazon.kill();
        vidas++;
  },
  updateHighscore: function(){
    this.highScore = +localStorage.getItem('highScore');
    
    //do we have a new high score
    if(this.highScore < this.myCoins){
      this.highScore = this.myCoins;
      
      //save new high score
      localStorage.setItem('highScore', this.highScore);
    }
  }   
    
};
