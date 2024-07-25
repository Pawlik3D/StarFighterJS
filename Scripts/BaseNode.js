//The base class that contains all the Nodes.
class RenderLayer
{
    canvas;
    ctxcanvas;
    loadCounter;
    ready;
    nodes;
    xy;
    id;
    constructor(x,y,id)
    {
        this.loadCounter=0;
        this.canvas = document.createElement("canvas");
        this.canvas.height=y;
        this.canvas.width=x;
        this.xy = [];
        this.xy[0] = x;
        this.xy[1] = y; 
        this.ctxcanvas = this.canvas.getContext("2d");
        this.nodes = [];
        this.id = id;
    }
	//Adds node to this Render Layer.
    AddNode(node)
    {
        this.loadCounter++;
        node.SetID(this.nodes.length);
        this.nodes.push(node);
        if('sprite' in node)
        if(node.sprite!==null)
        node.sprite.OnReady = this.ReadyNode();//Makes sure the sprite is ready before performing any visual logic.
        if(node.collider!==null)
        {
            node.physicsId = physicsNodes.length;
            physicsNodes.push(node);
        }
    }
    RemoveNode(node)
    {
        if(node.nodeID <= this.nodes.length)
        {
            delete this.nodes[node.nodeID];
        }
        if(node.physicsId in physicsNodes) //Check if node has physics ID, if so deletes that too.
        {
           delete physicsNodes[node.physicsID];
        }
    }
    ReadyNode()
    {
        this.loadCounter--;
    }
    CheckIfReady() //Checks if all the nodes have declared their state as "ready".
    {
        if(this.loadCounter>0)
            return false;
        return true;
    }
    Update(delta)
    {
        if(this.CheckIfReady())
        {
            this.nodes.forEach((node)  => node.Update(delta));
        }
    }
    VisualUpdate()
    {
        this.ctxcanvas.clearRect(0, 0, this.xy[0], this.xy[1]);
        if(this.CheckIfReady())
        {
            this.nodes.forEach((node) => node.VisualUpdate(this.ctxcanvas));
        }
    }
    
    exports = RenderLayer;
}
//Base class for all Nodes.
class Node
{
    renderLayerID;
    nodeID;
    physicsID;
    constructor()
    {
        this.physicsID=-1;
    }
    SetID(newID)//Sets ID of the node.
    {
        this.nodeID = newID;
    }
    Update(delta)
    {
        
    }
    VisualUpdate(canvas)
    {
    }
    PhysicsUpdate()
    {
        
    }
}
//Class that contains visual info, allowing it to be rendered in the RenderLayer.
class BaseNode2D extends Node
{
    x;
    y;
    sprite;
    spriteStepsRatio;
    spriteSteps;
    spriteStepsTimer;
    collider;
    hidden = false;
    constructor(x,y,sprite,spriteStepsRatio)
    {
        super();
        this.collider = null;
        this.x = x;
        this.y = y;
        this.sprite = sprite;
        this.spriteSteps=0;  
        this.spriteStepsTimer = 1;
        this.spriteStepsRatio = spriteStepsRatio;
    }
    SetupCollider(collider)
    {
        this.collider = collider;
    }
    Update(delta)
    {
        super.Update(delta);
    }
    ChangeXY(x,y) //Sets the X and Y positions to the specified "x" and "y" values.
    {
        if(x!==null)
        this.x=x;
        if(y!==null)
        this.y=y;
    }
    VisualUpdate(canvas)
    {
        super.VisualUpdate();
        if(typeof this.sprite !== 'undefined'&& !this.hidden)
        {
            this.spriteStepsTimer-=0.1;
            if(this.spriteStepsTimer<0)
            {
                this.spriteStepsTimer = 1;
                this.spriteSteps++;
            }
            if(this.spriteSteps>=this.spriteStepsRatio)
            {
                this.spriteSteps=0;
            }
            let xS = this.sprite.width;
            let yS = this.sprite.height;
            canvas.drawImage(this.sprite, this.spriteSteps*(xS), 0, this.sprite.width,this.sprite.height,this.x-(xS/2),this.y-(yS/2),this.sprite.width,this.sprite.height);            
            //canvas.drawImage(this.sprite, 0, 0, this.x-(xS/2), this.y-(yS/2), 0,0);
        }
    }
    PhysicsUpdate()
    {
        
    }
    exports = BaseNode2D;
}
//Base class for colliders.
class Collider
{
    deactivated;
    distance;
    layers;
    constructor(activationRadius,layers)
    {
        this.layers = layers;
        this.distance = activationRadius;
        this.deactivated = false;
    }
    CheckCollider(mNode) //Returns all colliders that are in proximity to this one.
    {
        let colliders = [];
        for(let x=0; x<this.layers.length;x++)
        {
            //console.log(RenderLayers[x].nodes);
            RenderLayers[this.layers[x]].nodes.forEach((node)=>
            {
                //console.log(mNode);
                //console.log(mNode);
                //console.log(node.nodeID+" "+mNode.nodeID);
                if(node.renderLayerID!==mNode.renderLayerID)
                {
                    if(node.collider!==null && !node.collider.deactivated)
                {
                    let a = mNode.x - node.x;
                let b = mNode.y - node.y;

                let c = Math.sqrt( a*a + b*b );
                if(c<=this.distance+node.collider.distance)
                {
                    colliders.push(node);
                    /*
                console.log(mNode);
                console.log("bolt has this distance: "+c);
                console.log(node);*/
                }
                }
            }
            });
        }
        return colliders;
    }
    exports = Collider;
}
//2D collider, which extends as a rectangle from the centre of the node.
class BoxCollider extends Collider
{
    boundX;
    boundY;
    constructor(activationRadius,layers,boundX,boundY)
    {
        super(activationRadius,layers);
        this.boundX = boundX;
        this.boundY = boundY;
    }
    CheckCollider(mNode) //Returns all colliders that overlap this one.
    {
        let colliders = super.CheckCollider(mNode);
        let newColliders = [];
        if(colliders.length!==0)
        {
            var x = [mNode.x - this.boundX,mNode.x + this.boundX];            
            var y = [mNode.y - this.boundY,mNode.y + this.boundY];
            
            colliders.forEach((node)=>
            {
               
            var x2 = [node.x - node.collider.boundX,node.x + node.collider.boundX];            
            var y2 = [node.y - node.collider.boundY,node.y + node.collider.boundY];
            
            if(x[0]<x2[1] && x[1]>x2[0])
            {
                if(y[0]<y2[1] && y[1]>y2[0])
                { 
                newColliders.push(node) ;                   
                }
            }
                
            });
        }
        return newColliders;
    }
}