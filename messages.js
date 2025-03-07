class GeometryRequest {
    constructor(ID,color,designer,placementPlane,parentID) {
        this.type = "GeometryRequest";
        this.ID = ID;
        // this.meshBox = meshBox;
        this.color = color;
        this.designer = designer;
        this.placementPlane = placementPlane;
        this.parentID = parentID;
    }

    toJson() {
        return JSON.stringify(this);
    }

    static fromJson(json) {
        const obj = JSON.parse(json);
        return new GeometryRequest(obj.ID,obj.color,obj.designer,obj.placementPlane,obj.parentID);
    }
}

class GeometryMessage {
    constructor(ID,color,designer,placementPlane,parentID,quaternion,position) {
        this.type = "GeometryMessage";
        this.ID = ID;
        // this.meshBox = meshBox;
        this.color = color;
        this.designer = designer;
        this.placementPlane = placementPlane;
        this.parentID = parentID;
        this.q_x = quaternion._x;
        this.q_y = quaternion._y;
        this.q_z = quaternion._z;
        this.q_w = quaternion._w;
        this.p_x = position.x;
        this.p_y = position.y;
        this.p_z = position.z;
    }

    toString() {
        return `ID: ${this.ID}, With Mesh`;
    }

    toJson() {
        return JSON.stringify(this);
    }

    static fromJson(json) {
        const obj = JSON.parse(json);
        const message = new GeometryMessage(obj.ID,obj.color,obj.designer,obj.placementPlane,obj.parentID,obj.quaternion,obj.position);
        return message;
    }
}

class UpdateAllMessageRequest {
    constructor(){
        this.type = "UpdateAllMessageRequest";
    }

    toJson() {
        return JSON.stringify(this);
    }
}

class AskForStickIDs{
    constructor(){
        this.type = "AskForStickIDs";
    }

    toJson() {
        return JSON.stringify(this);
    }
}

class RequestSticks{
    constructor(IDs){
        this.IDs = IDs;
        this.type = "RequestSticks";
    }

    toJson() {
        return JSON.stringify(this);
    }

    fromJson(json) {
        const obj = JSON.parse(json);
        return new RequestSticks(obj.IDs);
    }
}

class UpdateSticks{

    // list of GeometryMessage objects
    constructor(sticks){
        this.sticks = sticks;
        this.type = "UpdateSticks";
    }

    toJson() {
        return JSON.stringify(this);
    }

    fromJson(json) {
        const obj = JSON.parse(json);
        return new UpdateSticks(obj.sticks);
    }

}

export { GeometryRequest, GeometryMessage, UpdateAllMessageRequest, AskForStickIDs, RequestSticks, UpdateSticks };