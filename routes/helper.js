
import { client } from "../index.js";
import { ObjectId } from "mongodb";
import moment from "moment";


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
export async function getAdminOpenTasks() {
  return await client.db("online-kanban-app").collection("task").find({taskStatus: {$ne: "Closed"}}).toArray();
}
export async function getAdminAllTasks() {
  return await client.db("online-kanban-app").collection("task").find({}).toArray();
}
export async function getUserOpenTasks(email) {
  return await client.db("online-kanban-app").collection("task").find({
    $and: [{
      assigneeEmail: email
    },
      {taskStatus: {$ne: "Closed"}}  
    ]
  }).toArray();
}
export async function getUserAllTasks(email) {
  return await client.db("online-kanban-app").collection("task").find({assigneeEmail: email}).toArray();
}
export async function getAdminClosedTasks() {
  return await client.db("online-kanban-app").collection("task").find({taskStatus: "Closed"}).toArray();
}
export async function getAdminTasksWithStatus(status) {
  return await client.db("online-kanban-app").collection("task").find({taskStatus: status}).toArray();
}

export async function getAdminTasksWithNearCompletion() {
  let date=moment().add(5, 'days').toDate().toISOString();
  let toda=moment().toDate().toISOString();
  return await client.db("online-kanban-app").collection("task").find({
    $and: [
      {taskStatus: {$ne: "Closed"}},
      {
        taskEndDate: {$gte:toda,$lt:date}
      }
    ]
  }).toArray();
}


export async function getAdminTasksWithBlocks() {
  return await client.db("online-kanban-app").collection("task").find({
    $and: [
      {taskStatus: {$ne: "Closed"}},
      {
        blockingPoint: {"$ne": ""}
      }
    ]
  }).toArray();
}


export async function getUserClosedTasks(email) {
  return await client.db("online-kanban-app").collection("task").find({
    $and: [{
      assigneeEmail: email
    },
      {taskStatus:"Closed"} 
    ]
  }).toArray();
}

export async function getUserTasksWithBlocks(email) {
  return await client.db("online-kanban-app").collection("task").find({
    $and: [
      {
        assigneeEmail: email
      },
      {taskStatus: {$ne: "Closed"}},
      {
        blockingPoint: {"$ne": ""}
      }
    ]
  }).toArray();
}


export async function getUserTasksWithNearCompletion(email) {
  let date=moment().add(5, 'days').toDate().toISOString();
  let toda=moment().toDate().toISOString();
  return await client.db("online-kanban-app").collection("task").find({
    $and: [
      {
        assigneeEmail: email
      },
      {taskStatus: {$ne: "Closed"}},
      {
        taskEndDate: {$gte:toda,$lt:date}
      }
    ]
  }).toArray();
}
export async function getTaskById(id) {
  return await client.db("online-kanban-app").collection("task").findOne({ _id: ObjectId(id) });
}

export async function updateTaskById(id, data) {
  return await client.db("online-kanban-app").collection("task").updateOne({ _id: ObjectId(id) }, { $set: data });
}

export async function deleteTaskById(id) {
  return await client.db("online-kanban-app").collection("task").deleteOne({ _id: ObjectId(id) });
}
