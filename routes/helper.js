
import { client } from "../index.js";
import { ObjectId } from "mongodb";


export async function getUserByName(Email) {
    //db.users.findOne({username: username });
  return await client.db("online-kanban-app").collection("user").findOne({ Email: Email });
}
export async function getUserById(id) {
  //db.users.findOne({_id: id });
  return await client.db("online-kanban-app").collection("user").findOne({ _id:ObjectId(id)});
}

export async function createUser(data) {
    //db.users.insertOne(data);
  return await client.db("online-kanban-app").collection("user").insertOne(data);
}
export async function createAdmin(data) {
  //db.users.insertOne(data);
return await client.db("online-kanban-app").collection("admin").insertOne(data);
}

export async function getUserByEmail(Email) {
    //db.users.findOne({username: username });
  return await client.db("online-kanban-app").collection("user").findOne({Email: Email});
}
export async function getUserByAdminEmail(Email) {
  //db.users.findOne({username: username });
return await client.db("online-kanban-app").collection("admin").findOne({ Email: Email });
}

export async function createNewTask(data) {
  //db.users.findOne({username: username });
  return await client.db("online-kanban-app").collection("task").insertOne(data);
}
export async function createNewWebinar(data) {
  //db.users.findOne({username: username });
  return await client.db("online-kanban-app").collection("event_webinar").insertOne(data);
}

export async function getAllWebinar() {
  return await client.db("online-kanban-app").collection("event_webinar").find({}).toArray();
}
export async function getAllEvents() {
  return await client.db("online-kanban-app").collection("task").find({}).toArray();
}

export async function getTaskById(id) {
  return await client.db("online-kanban-app").collection("task").findOne({ _id: ObjectId(id) });
}

export async function updateEventById(id, data) {
  return await client.db("online-kanban-app").collection("task").updateOne({ _id: ObjectId(id) }, { $set: data });
}

export async function deleteEventById(id) {
  return await client.db("online-kanban-app").collection("task").deleteOne({ _id: ObjectId(id) });
}
export async function deleteWebinarById(id) {
  return await client.db("online-kanban-app").collection("event_webinar").deleteOne({ _id: ObjectId(id) });
}
export async function updateEventRegistrationById(id, participantlist) {
  return await client.db("online-kanban-app").collection("task").updateOne({ _id: ObjectId(id) }, { $set:{participantlist:participantlist}  });
}
export async function getWebinarById(id) {
  return await client.db("online-kanban-app").collection("event_webinar").findOne({ _id: ObjectId(id) });
}
export async function updateWebinarById(id, data) {
  return await client.db("online-kanban-app").collection("event_webinar").updateOne({ _id: ObjectId(id) }, { $set: data });
}
export async function updateWebinarRegistrationById(id, participantlist) {
  return await client.db("online-kanban-app").collection("event_webinar").updateOne({ _id: ObjectId(id) }, { $set:{participantlist:participantlist}  });
}

export async function getAllNotRegisteredWebinar(email) {
  
const isodate = new Date().toISOString()
  // console.log(currDate,time)
  return await client.db("online-kanban-app").collection("event_webinar")
  .find(
    { "$and" : 
  [
    {participantlist:{$ne:email}} ,
     {eventDate : {$gte:isodate}}
  ]
}
).toArray();
}

export async function getAllRegisteredWebinar(email) {
  
  const isodate = new Date().toISOString()
    // console.log(currDate,time)
    return await client.db("online-kanban-app").collection("event_webinar")
    .find(
      { "$and" : 
    [
      {participantlist:{$eq:email}} ,
       {eventDate : {$gte:isodate}}
    ]
  }
  ).toArray();
  }

  export async function cancelRegistrationOfEvent(eventid,email) {
    return await client.db("online-kanban-app").collection("event_webinar").update(
      { _id: ObjectId(eventid)},
      { $pull: { participantlist: email} }
  );
  }





