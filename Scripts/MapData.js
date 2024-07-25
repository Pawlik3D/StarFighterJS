class Map
{
    events;
    constructor()
    {
        this.events = {};
    }
    AddEvent(time, event)
    {
        this.events[time] = event;
    }
    SetEvents(events)
    {
        this.events = events;
    }
    ExecuteEvent(time)
    {
        
        if(time in this.events)
        {
            console.log("timer "+time);            
            //console.log("event "+this.events[time]);

            this.events[time].ExecuteEvent();
        }
    }
    ClearMap()
    {
        this.events = {};
    }
}
class MapEvent
{
    constructor()
    {
    }
    ExecuteEvent()
    {
    }
    exports = MapEvent;
}
class SpawnEvent extends MapEvent
{
    node;
    layer;
    x;
    y;
    constructor(node,layer,x,y)
    {
        super();
        this.x = x;
        this.y = y;
        this.node = node;
        this.layer = layer;
    }
    ExecuteEvent()
    {
        super.ExecuteEvent();
        entitySpawner.SpawnEntity(this.node,this.layer,this.x,this.y);
    }
}
