//Loads map with specific ID. CURRENTLY ONLY "0" WORKS!
//This function was cut in favor of randomly generated gameplay.
function LoadMap(id)
{
    var shipImage = new Image(128,128);
    shipImage.src = 'VisualAssets/Gameplay/PlayerShip.png';
    let playerNode = new Player(0,800,shipImage,3,10);
    switch(id)
    {
        case 0:
            playerSmallCollider = new BoxCollider(50,[1],50,30);
            playerNode.collider = playerSmallCollider;
   

            map.ClearMap();
            map.SetEvents({
            1:new SpawnEvent(playerNode,RenderLayers[2],0,750),
            /*
            2:new SpawnEvent(new Enemy(0,128,enemyShipImage,3,2,enemySmallCollider),RenderLayers[1],100,-64),
            12:new SpawnEvent(new Enemy(0,128,enemyShipImage,3,2,enemySmallCollider),RenderLayers[1],300,-64),
            22:new SpawnEvent(new Enemy(0,128,enemyShipImage,3,2,enemySmallCollider),RenderLayers[1],500,-64),
            520:new SpawnEvent(new Enemy(0,128,enemyShipImage,3,2,enemySmallCollider),RenderLayers[1],100,-64),
            740:new SpawnEvent(new Enemy(0,128,enemyShipImage,3,2,enemySmallCollider),RenderLayers[1],300,-64),
            960:new SpawnEvent(new Enemy(0,128,enemyShipImage,3,2,enemySmallCollider),RenderLayers[1],500,-64),*/
        });
            
            break;
        case 1:
            break;
    }
    
}

