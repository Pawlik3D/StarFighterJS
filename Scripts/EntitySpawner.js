class EntitySpawner extends Node
{
  randoNumber;
    enemyShipImage;    
    enemyBossShipImage;
    enemyBossCollider;
    enemySmallCollider;
    asteroidImage;
    spawnedAmount;
  constructor()
  {
      super();
      this.spawnedAmount = 0;
      this.enemySmallCollider = new BoxCollider(50,[2],50,30);      
      this.enemyBossCollider = new BoxCollider(70,[2],150,40);
      this.enemyShipImage = new Image(128,128);
      this.enemyShipImage.src = 'VisualAssets/Gameplay/EnemyShip.png';
      this.enemyBossShipImage = new Image(256,128);
      this.enemyBossShipImage.src = 'VisualAssets/Gameplay/EnemyShip2.png';
      this.asteroidImage = new Image(128,128);
      this.asteroidImage.src = 'VisualAssets/Gameplay/Asteroid.png';
  }
  //Spawns specific entity at a specific render layer and position.
  SpawnEntity(node,renderLayer,posX,posY)
  {
      node.x = posX;
      node.y = posY;
      node.renderLayerID=renderLayer.id;
      renderLayer.AddNode(node);
  }
  Update(delta)
  {
      this.RandomSpawn(delta);
  }
  RandomSpawn(delta) //The random enemy ship spawner.
  {
      difficulty+=0.1;
      if(this.stop)
          return;
      if(this.randoNumber>0)
      {
          this.randoNumber-=delta;
      }
      else
      {
          this.spawnedAmount++;
          this.randoNumber = 20+Math.floor(Math.random() * 101)-difficulty;
          if(difficulty >100)
          {
              difficulty = 100;
          }
          if(this.randoNumber<0)
          {
              this.randoNumber = 20;
          }
          let randoX = 32+Math.floor(Math.random()*(c.width-64));
          let r = Math.floor(Math.random()*2);
          if(this.spawnedAmount===30) //Spawns a boss every 30 entities.
          {
              
              this.SpawnEntity(new Boss(0,128,this.enemyBossShipImage,6,10,this.enemyBossCollider),RenderLayers[1],randoX,-64);
          }
          else
          {
            if(r<1) //Here you can add more entities later.
            {
                this.SpawnEntity(new Asteroid(0,128,this.asteroidImage,11,1,this.enemySmallCollider),RenderLayers[1],randoX,-64);
            }
            else
            {
                this.SpawnEntity(new Enemy(0,128,this.enemyShipImage,3,2,this.enemySmallCollider),RenderLayers[1],randoX,-64);
            }
          }
          if(this.spawnedAmount>35)
              {
                  this.spawnedAmount = 0;
              }
      }
  }
  RandomBackgroundSpawn(nodes)
  {
  }
}
//entitySpawner.SpawnEntity(new FireBolt(0,0,fireBoltImg,2,1),RenderLayers[1],mouseCoords[0],800);