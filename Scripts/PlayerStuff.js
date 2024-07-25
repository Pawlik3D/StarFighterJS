class Entity extends BaseNode2D
{
    hp;
    constructor(x,y,sprite,spriteStepsRatio,hp)
    {
        super(x,y,sprite,spriteStepsRatio);
        this.hp = hp;
    }
    Update(delta)
    {
        super.Update(delta);
    }
    Control()
    {
    }
    VisualUpdate(canvas)
    {
        super.VisualUpdate(canvas);
    }
    RemoveEntity()
    {
        RenderLayers[this.renderLayerID].RemoveNode(this);
    }
    DamageEntity(amount)
    {
        //console.log("this gets damaged");
        this.hp-=amount;
        if(this.hp<=0)
        {
            this.RemoveEntity();
        score++;
        let r = Math.random() * 20;
        //console.log(r);
        if(r<2)
        {
            entitySpawner.SpawnEntity(new PlusHP(0,0,hpPlusImg,1,itemCollider),RenderLayers[3],this.x,this.y);
        }
        else if (r>18)
        {
            entitySpawner.SpawnEntity(new PlusShield(0,0,shieldPlusImg,1,itemCollider),RenderLayers[3],this.x,this.y);
        }
        
        
        //tScore.innerHTML = "wynik: "+score+"________Życia:"+lives+" "+difficulty;
        }
    }
}
class BackgroundEntity extends Entity 
{
    bckSpeed;
    constructor(x,y,sprite,spriteStepsRatio,speed)
    {
        super(x,y,sprite,spriteStepsRatio);
        this.bckgSpeed = speed;
    }
    VisualUpdate(canvas)
    {
        super.VisualUpdate(canvas);
    }
    
    Update(delta)
    {
        super.Update(delta);
        if(this.y>c.width+256)
        {
            super.ChangeXY(Math.floor(Math.random()*(c.width)),-256);
        }
        else
        {
            super.ChangeXY(this.x,this.y+this.bckgSpeed*delta);
        }
    }
    exports = BackgroundEntity;
}
class Player extends Entity
{
    shieldPower;
    shieldNode;
    shieldCounter = 0;
    shieldRecharge = 0;
    constructor(x,y,sprite,spriteStepsRatio,hp)
    {
        super(x,y,sprite,spriteStepsRatio,hp);
        this.shieldPower = 4;
        this.shieldNode = new BaseNode2D(this.x,this.y,shield,3);
        this.shieldNode.hidden = true;
        entitySpawner.SpawnEntity(this.shieldNode,RenderLayers[3],this.x,this.y);
    }

    Update(delta)
    {
        super.Update(delta);
        this.Control(delta);
    }
    Control(delta)
    {
        if(this.shieldPower!==4)
        {
            this.shieldRecharge+=delta;
            if(this.shieldRecharge>=369)
            {
                this.shieldRecharge = 0;
                this.shieldPower++;
                ui.UpdateUI(this);
            }
        }
        if(this.shieldCounter>0)
        {
            this.shieldCounter--;
            this.shieldNode.ChangeXY(this.x,this.y);
            if(this.shieldCounter<=0)
            {
                this.shieldNode.hidden = true;
            }
        }
        super.ChangeXY(mouseCoords[0],this.y);
        //console.log(this.x+" "+this.y);
    }
    VisualUpdate(canvas)
    {
        super.VisualUpdate(canvas);
    }
    GetDrop()
    {
        ui.UpdateUI(this);
    }
    DamageEntity(amount)
    {
        if(this.shieldRecharge>0)
        {
            this.shieldRecharge = 0;
        }
        if(this.shieldPower>0|| this.shieldCounter>0)
        {
            if(this.shieldCounter===0)
            {
            sfxAudio2.src = 'Audio/SFX/sfx_18b.ogg';
            sfxAudio2.play();
            this.shieldNode.hidden = false;
            this.shieldCounter = 120;
            this.shieldPower--;
            }
            
        }
        else
        {   
        this.hp-=amount;
        if(this.hp<=0)
        {
            window.localStorage.setItem("score",score);
            window.location.href = "Loss.HTML";
        }
        var possibleHitSounds = ["ShipHit.mp3","ShipHit2.mp3","ShipHit3.mp3"];
        sfxAudio2.src = 'Audio/SFX/'+possibleHitSounds[Math.floor(Math.random() * 3)];
        sfxAudio2.play();
        lives = this.hp;
        }
        ui.UpdateUI(this);
        //tScore.innerHTML = "wynik: "+score+"________Życia:"+lives;
    }
    exports = Player;
}
class FireBolt extends Entity
{
    direction;
    canDamage;
    constructor(x,y,sprite,spriteStepsRatio,direction)
    {
        super(x,y,sprite,spriteStepsRatio,1);
        this.canDamage = true;
        this.direction = direction;
    }
    Update(delta)
    {
        super.Update(delta);
        this.Control(delta);
    }
    Control(delta)
    {
        super.ChangeXY(this.x,this.y-this.direction*delta);
        if(this.y<=0)
        {
            this.canDamage = false;
        }
        else 
        {
            this.canDamage = true;
        }
        
        if(this.y<=-100||this.y>=916)
            this.RemoveEntity();
    }
    VisualUpdate(canvas)
    {
        super.VisualUpdate(canvas);
    }
    PhysicsUpdate()
    {
        super.PhysicsUpdate();
        if(this.canDamage)
        {
            let colliders = this.collider.CheckCollider(this);
            colliders.forEach((col)=>{
                this.canDamage= false;
                col.DamageEntity(1);
                entitySpawner.SpawnEntity(new FireBall(0,0,smallExplosionImg,3,1),RenderLayers[3],this.x,this.y);
                this.RemoveEntity();
            });
        if(colliders.length!==0)
        {
            
            
            /*
            console.log("welp this is,... something ");
            console.log(this.collider.CheckCollider(this));
        
                 *
             */}
        }
        
    }
    exports = FireBolt;
}
class PlusDrop extends Entity
{
    canInteract;
    constructor(x,y,sprite,spriteStepsRatio,collider)
    {
        super(x,y,sprite,spriteStepsRatio);
        this.collider = collider;
        this.canInteract = true;
    }
    Update(delta)
    {
        super.Update(delta);
        this.Control(delta);
    }
    Control(delta)
    {
        super.ChangeXY(this.x,this.y+2*delta);
        if(this.y<=-100||this.y>=916)
            this.RemoveEntity();
    }
    VisualUpdate(canvas)
    {
        super.VisualUpdate(canvas);
    }
    PhysicsUpdate()
    {
        super.PhysicsUpdate();
        if(this.canInteract)
        {
            let colliders = this.collider.CheckCollider(this);
            colliders.forEach((col)=>{
                this.canInteract= false;
                if(col instanceof Player)
                {
                    this.Buff(col);
                    this.RemoveEntity();
                }
            });
        }
    }
    Buff(node)
    {
        
    }
}
class PlusHP extends PlusDrop
{
    Buff(node)
    {
        if(node.hp<10)
        {
            node.hp++;
            node.GetDrop();
        }
    }
}
class PlusShield extends PlusDrop
{
    Buff(node)
    {
        if(node.shieldPower<4)
        {
            node.shieldRecharge = 0;
            node.shieldPower++;
            node.GetDrop();
        }
    }
}
class FireBall extends Entity
{
    internalTimer;
    constructor(x,y,sprite,spriteStepsRatio,hp)
    {
        super(x,y,sprite,spriteStepsRatio,hp);
        this.internalTimer = 30;
    }
    Update(delta)
    {
        super.Update(delta);
        this.Control(delta);
    }
    Control(delta)
    {
        this.internalTimer-=delta;
        if(this.internalTimer<=0)
        {
            this.RemoveEntity();
        }
    }
    VisualUpdate(canvas)
    {
        super.VisualUpdate(canvas);
    }
    exports = FireBall;
}
class EnemyMovingOneDirection extends Entity
{
    
}
class Enemy extends Entity
{
    internalTimer = 60;
    movementTimerX = 0;   
    movementTimerY = 0;
    ammo = 4;
    constructor(x,y,sprite,spriteStepsRatio,hp,collider)
    {
        super(x,y,sprite,spriteStepsRatio,hp);
        this.internalTimer = 30;
        this.collider = collider;
    }
    Fire()
    {
        let eBolt = new FireBolt(0,0,fireBoltEnemyImg,3,-4);
        eBolt.collider = EnemyfireBoltCollider;
        entitySpawner.SpawnEntity(eBolt,RenderLayers[3],this.x,this.y+60);
    }
    Update(delta)
    {
        super.Update(delta);
        this.Control(delta);
    }
    Control(delta)
    {
        if(this.y>=c.height+64)
        {
            this.RemoveEntity();
        }
        this.internalTimer-=delta;
        if(this.ammo===0)
        {
            this.ammo = 4;
        }
        if(this.internalTimer<=0 &&this.ammo>0)
        {
            this.ammo-=delta;
            this.Fire();
            this.internalTimer =100;
            if(this.ammo===0)
            {
                this.internalTimer = 200;
            }
        }
        this.movementTimerX+=0.1*delta;        
        this.movementTimerY+=0.05*delta;

        super.ChangeXY(this.x+ Math.sin(this.movementTimerX*0.3),this.y+ Math.sin(this.movementTimerY)+2);
    }
    
    ChangeXY(x,y)
    {
        if(x!==null)
        {
           if(x<0) 
           {
               x = 32;
           }
           if(x>c.width)
           {
               x = c.width-32;
           }
            this.x=x;
        }
        if(y!==null)
        this.y=y;
    }
}
class Boss extends Enemy
{
    internalTimer = 80;
    ammo = 2;
    active;
    destroyedSprite;
    constructor(x,y,sprite,spriteStepsRatio,hp,collider)
    {
        super(x,y,sprite,spriteStepsRatio,hp);
        this.internalTimer = 80;
        this.collider = collider;
        this.active = true;
        this.destroyedSprite = new Image(256,128);
        this.destroyedSprite.src = 'VisualAssets/Gameplay/EnemyShip2Defeated.png';
    }
    Fire()
    {
        let eBolt = new FireBolt(0,0,fireBoltEnemyImg,3,-4);
        eBolt.collider = EnemyfireBoltCollider;
        let eBolt2 = new FireBolt(0,0,fireBoltEnemyImg,3,-4);
        eBolt2.collider = EnemyfireBoltCollider;
        let eBolt3 = new FireBolt(0,0,fireBoltEnemyImg,3,-4);
        eBolt3.collider = EnemyfireBoltCollider;
        entitySpawner.SpawnEntity(eBolt,RenderLayers[3],this.x-120,this.y+30);
        entitySpawner.SpawnEntity(eBolt2,RenderLayers[3],this.x+120,this.y+30);        
        entitySpawner.SpawnEntity(eBolt3,RenderLayers[3],this.x,this.y+30);

    }
    Update(delta)
    {
        super.Update(delta);
        this.Control(delta);
    }
    Control(delta)
    {
        if(this.y>=c.height+64)
        {
            this.RemoveEntity();
        }
        this.internalTimer-=delta;
        if(this.ammo===0)
        {
            this.ammo = 2;
        }
        if(this.internalTimer<=0 &&this.ammo>0 && this.active)
        {
            this.ammo--;
            
            this.Fire();
            this.internalTimer =100;
            if(this.ammo===0)
            {
                this.internalTimer = 200;
            }
        }
        if(this.active)
        this.movementTimerX+=0.01*delta;
        else
            this.movementTimerX = 0;
        super.ChangeXY(this.x+ Math.sin(this.movementTimerX*1),this.y+0.2);
    }
    
    ChangeXY(x,y)
    {
        if(x!==null)
        {
           if(x<0) 
           {
               x = 32;
           }
           if(x>c.width)
           {
               x = c.width-32;
           }
            this.x=x;
        }
        if(y!==null)
        this.y=y;
    }
    DamageEntity(amount)
    {
        //console.log("this gets damaged");
        this.hp-=amount;
        if(this.hp<=0)
        {
            
            this.sprite = this.destroyedSprite;
            this.spriteStepsRatio = 1;
            this.collider = null;
            this.active = false;
            
            entitySpawner.SpawnEntity(new FireBall(0,0,smallExplosionImg,3,1),RenderLayers[3],this.x-30,this.y+5);            
            entitySpawner.SpawnEntity(new FireBall(0,0,smallExplosionImg,3,1),RenderLayers[3],this.x+30,this.y-5);
            entitySpawner.SpawnEntity(new FireBall(0,0,smallExplosionImg,3,1),RenderLayers[3],this.x,this.y);

            //this.RemoveEntity();
        score+=5;
        let r = Math.random() * 20;
        //console.log(r);
        if(r<2)
        {
            entitySpawner.SpawnEntity(new PlusHP(0,0,hpPlusImg,1,itemCollider),RenderLayers[3],this.x,this.y);
        }
        else if (r>18)
        {
            entitySpawner.SpawnEntity(new PlusShield(0,0,shieldPlusImg,1,itemCollider),RenderLayers[3],this.x,this.y);
        }
        
        
        //tScore.innerHTML = "wynik: "+score+"________Życia:"+lives+" "+difficulty;
        }
    }
}
class Asteroid extends Enemy
{
    canDamage;
    constructor(x,y,sprite,spriteStepsRatio,hp,collider)
    {
        super(x,y,sprite,spriteStepsRatio,hp,collider);
        this.canDamage = true;
        
    }
    Update(delta)
    {
        super.Update(delta);
        this.Control(delta);
    }
    Control(delta)
    {
        super.ChangeXY(this.x,this.y+2*delta);
        if(this.y<=-100||this.y>=916)
            this.RemoveEntity();
    }
    VisualUpdate(canvas)
    {
        super.VisualUpdate(canvas);
    }
    PhysicsUpdate()
    {
        super.PhysicsUpdate();
        if(this.canDamage)
        {
            let colliders = this.collider.CheckCollider(this);
            colliders.forEach((col)=>{
                this.canDamage= false;
                col.DamageEntity(1);
                entitySpawner.SpawnEntity(new FireBall(0,0,smallExplosionImg,3,1),RenderLayers[3],this.x,this.y);
                this.RemoveEntity();
            });
        }
        
    }
}
class UIElement extends BaseNode2D
{
    
}
class UI
{
    hpMeter;
    healthNotches;
    shieldNotches;
    constructor()
    {
        let uiHealth = new Image(82,41);
        uiHealth.src = 'VisualAssets/Gameplay/UI/HealthNotch.png';
        let uiMeter = new Image(128,512);
        this.healthNotches =[];
        this.shieldNotches =[];
        for(let i = 0; i < 10; i++)
        {
            let hN = new UIElement(0,0,uiHealth,1);
            this.healthNotches[i] = hN;
            entitySpawner.SpawnEntity(this.healthNotches[i],RenderLayers[4],41,c.height-58-(41*(i+1)));
        }
        uiMeter.src = 'VisualAssets/Gameplay/UI/Meters.png';
        this.hpMeter = new UIElement(0,0,uiMeter,1);
        entitySpawner.SpawnEntity(this.hpMeter,RenderLayers[4],64,c.height-256);
        let uiShields = [new Image(64,64),new Image(64,64),new Image(64,64),new Image(64,64)];
        for(let i =0; i <4; i++)
        {
            uiShields[i].src = 'VisualAssets/Gameplay/UI/Shield'+(i+1)+'.png';
            let sN = new UIElement(0,0,uiShields[i],1);
            this.shieldNotches[i] = sN;
            entitySpawner.SpawnEntity(this.shieldNotches[i],RenderLayers[4],32,c.height-32);
        }
    }
    UpdateUI(player)
    {
        //health
        for(let i= 0;i<10;i++)
        {
            this.healthNotches[i].hidden = (i>=player.hp);
        }
        //Shield
        for(let i= 0;i<4;i++)
        {
            this.shieldNotches[i].hidden = (i>=player.shieldPower);
        }
    }
    UpdateScore()
    {
        let ctx = RenderLayers[4].ctxcanvas;
        ctx.font = "48px serif";
        ctx.fillStyle = "white";
        ctx.fillText("Hello world", 100, 150);
    }
}