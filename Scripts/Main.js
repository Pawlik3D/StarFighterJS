//basic setup
var tConsole = document.getElementById("konsolka");
var c = document.getElementById('moja_kanwa');
var context = c.getContext('2d');
const RenderLayers = 
    [new RenderLayer(c.width,c.height,0),//bckg.
    new RenderLayer(c.width,c.height,1),//enemies 
    new RenderLayer(c.width,c.height,2),//player
    new RenderLayer(c.width,c.height,3),//Visual Effects projectiles
    new RenderLayer(c.width,c.height,4)//UI
];
var lives = 10;
var difficulty = 0;
const tScore = document.getElementById("score");
var score = 0;
const physicsNodes = [];
var smallExplosionImg = new Image(64,64);
smallExplosionImg.src = 'VisualAssets/Gameplay/Explosion.png';

var bckImages = [new Image(256,256),new Image(256,256),new Image(256,256),new Image(256,256)];
bckImages[0].src = 'VisualAssets/Gameplay/Background/Nebula1.png';
bckImages[1].src = 'VisualAssets/Gameplay/Background/Nebula2.png';
bckImages[2].src = 'VisualAssets/Gameplay/Background/StarCluster1.png';
bckImages[3].src = 'VisualAssets/Gameplay/Background/StarCluster2.png';

var shield = new Image(128,128);
shield.src = 'VisualAssets/Gameplay/Shield.png';
let timer = 0;
let mouseCoords = [0,0];
var itemCollider = new BoxCollider(20,[2],10,10); 
var hpPlusImg = new Image(64,64);
hpPlusImg.src = 'VisualAssets/Gameplay/HPPlus.png';
var shieldPlusImg = new Image(64,64);
shieldPlusImg.src = 'VisualAssets/Gameplay/ShieldPlus.png';

const entitySpawner = new EntitySpawner();
const map = new Map();
const ui = new UI();
LoadMap(0);
//Functions
Update();
PhysicsUpdate();
VisualUpdate();
c.addEventListener("click",FireABolt);
c.onmousedown = LowerMouse;
c.onmousemove = findMouseCoords;
c.onmouseup = RiseMouse;
var isMouseDown = false;
for(let i = 0; i < 10;i++)
{
    for(let x = 0; x<bckImages.length;x++)
{
    entitySpawner.SpawnEntity(new BackgroundEntity(0,-256,bckImages[x],1,Math.random()*2),RenderLayers[0],Math.floor(Math.random()*(c.width)),Math.floor(Math.random()*(c.height+500)));
}
}
let audio = document.getElementById("audio");


fireBoltCollider = new BoxCollider(20,[1],10,10);
EnemyfireBoltCollider = new BoxCollider(20,[2],10,10);
var fireBoltImg = new Image(32,32);
            fireBoltImg.src = 'VisualAssets/Gameplay/FireBolt.png';
var fireBoltEnemyImg = new Image(32,32);
            fireBoltEnemyImg.src = 'VisualAssets/Gameplay/FireBoltEnemy.png';
var fireRate = 10;
var possibleFireSounds = ["laser4.mp3","laser6.mp3","laser9.mp3"];
var sfxAudio = document.getElementById("sfx");
var sfxAudio2 = document.getElementById("sfx2");
//Make player shoot a firebolt.
function FireABolt()
{
    if(fireRate<=0)
    {   
        sfxAudio.src = 'Audio/SFX/'+possibleFireSounds[Math.floor(Math.random() * 3)];
        sfxAudio.play();
        fireRate = 15;
        let bolt = new FireBolt(0,0,fireBoltImg,3,4);
        bolt.collider = fireBoltCollider;
        entitySpawner.SpawnEntity(bolt,RenderLayers[3],mouseCoords[0],750);
        audio.play(); 
    }
}
function RiseMouse()
{
    isMouseDown = false;
    fireRate = 0;
}
function LowerMouse()
{
    isMouseDown = true;
}
var lastUpdate = Date.now();
function Update()
{
	//all logic goes here, FRAME DEPENDENT!!
    var now = Date.now();
    var delta = (now - lastUpdate)/10; //Calculated delta which can be used for making sure the game speed is proper on different displays.
    lastUpdate = now;
    if(document.hasFocus() )
     {
    if(fireRate!==0)
    {
        fireRate-=delta;
    }
    if(isMouseDown)
    {
         FireABolt();
    }
    timer++;
    map.ExecuteEvent(timer);
    RenderLayers.forEach((layer) => layer.Update(delta));
    entitySpawner.Update(delta/3);
    }
    //setTimeout(Update,60);
    requestAnimationFrame(Update);
}
function PhysicsUpdate()
{
	//All physics goes here. FRAME INDEPENDENT!
    //tConsole.innerHTML ="isUpdating"+timer;
    if(document.hasFocus() )
      {
        physicsNodes.forEach((node) =>
        {
            node.PhysicsUpdate();
        });
      }
    setTimeout(PhysicsUpdate,33);
}
function VisualUpdate()
{
	//Same as Update, but used only for Layers!
    context.clearRect(0, 0, c.width,c.height);
    RenderLayers.forEach((layer)=> 
    {
        
        layer.VisualUpdate();
        context.drawImage(layer.canvas,0,0);
    });
    ui.UpdateScore();
    requestAnimationFrame(VisualUpdate);
          
}
//Finds the position of the mouse.
function findMouseCoords(mouseEvent)
{
  var obj = c;
  var obj_left = 0;
  var obj_top = 0;
  var xpos;
  var ypos;
  while (obj.offsetParent)
  {
    obj_left += obj.offsetLeft;
    obj_top += obj.offsetTop;
    obj = obj.offsetParent;
  }
  if (mouseEvent)
  {
    //FireFox
    xpos = mouseEvent.pageX;
    ypos = mouseEvent.pageY;
  }
  else
  {
    //IE
    xpos = window.event.x + document.body.scrollLeft - 2;
    ypos = window.event.y + document.body.scrollTop - 2;
  }
  xpos -= obj_left;
  ypos -= obj_top;
  mouseCoords = [xpos,ypos];
}

