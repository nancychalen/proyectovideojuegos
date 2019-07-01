var MrHop = MrHop || {};

MrHop.Platform = function(game, floorPool, numTiles, x, y, speed, coinsPool) {
  Phaser.Group.call(this, game);
  
  this.tileSize = 40;
  this.game = game;
  this.enableBody = true;
  this.floorPool = floorPool;
  this.coinsPool = coinsPool;
  
  this.prepare(numTiles, x, y, speed);  
};

MrHop.Platform.prototype = Object.create(Phaser.Group.prototype);
MrHop.Platform.prototype.constructor = MrHop.Platform;

MrHop.Platform.prototype.prepare = function(numTiles, x, y, speed) {
  
  //make alive
  this.alive = true;  
  
  var i = 0;
  while(i < numTiles){
    
    var floorTile = this.floorPool.getFirstExists(false);
    
    if(!floorTile) {
      floorTile = new Phaser.Sprite(this.game, x + i * this.tileSize, y, 'floor');
    }
    else {
      floorTile.reset(x + i * this.tileSize, y);
    }
      
    this.add(floorTile);    
    i++;
  }
  
  //set physics properties
  this.setAll('body.immovable', true);
  this.setAll('body.allowGravity', false);
  this.setAll('body.velocity.x', speed);
  
  this.addCoins(speed);
  
};

};
