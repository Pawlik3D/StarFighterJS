//Class for creating a map.
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
//Base Map Event type.
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
//Map Event responsible for spawning entities.
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
    ExecuteEvent() //Spawns entity defined in the constructor.
    {
        super.ExecuteEvent();
        entitySpawner.SpawnEntity(this.node,this.layer,this.x,this.y);
    }
}
