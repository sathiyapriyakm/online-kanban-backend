import express from "express";
import {
    getUserOpenTasks,
    getUserClosedTasks,
    updateTaskById,
    getUserAllTasks,
    getUserTasksWithBlocks,
    getUserTasksWithNearCompletion
} from "./helper.js";
import { authorizedUser } from "../middleware/auth.js";

const router = express.Router();
router.get("/tasks/open/:email", authorizedUser, async function (request, response) {
    //db.movies.find({});
    const { email } = request.params;
    const events = await getUserOpenTasks(email);
    response.send(events);
  });
  router.get("/tasks/closed/:email", authorizedUser, async function (request, response) {
    //db.movies.find({});
    const { email } = request.params;
    const events = await getUserClosedTasks(email);
    response.send(events);
  });
  router.put("/startTask/:id", authorizedUser, async function (request, response) {
    const { id } = request.params;
    const data = {
      taskStatus:"Requirement Analysis",
      startedAt: new Date(),
      progress:[{
        bg:"orange",
        status: "Requirement Analysis",
        comments:"",
        changedAt:"",
      }]
    }
    const result = await updateTaskById(id, data);
    response.send(result);
  });

  router.put("/changeStatus/:id", authorizedUser, async function (request, response) {
    const { id } = request.params;
    const {task,comment}=request.body;
    let newTaskStatus;
    let newProgress=task.progress;
    let currStage=newProgress.length;
    newProgress[currStage-1].comments=comment;
    newProgress[currStage-1].changedAt=new Date();
if(task.taskStatus==="Requirement Analysis"){
  newTaskStatus="Documentation";
  newProgress.push({
        bg:"#A2DCE7",
        status: "Documentation",
        comments:"",
        changedAt:"",
  })
}
else if(task.taskStatus==="Documentation"){
  newTaskStatus="Coding";
  newProgress.push({
        bg:"yellowgreen",
        status: "Coding",
        comments: "",
        changedAt: "",
  })
}
else if(task.taskStatus==="Coding"){
  newTaskStatus="Testing";
  newProgress.push({
        bg:"green",
        status: "Testing",
        comments: "",
        changedAt: ""
  })
}
else if(task.taskStatus==="Testing"){
  newTaskStatus="Closed";
}
const data = {
      taskStatus:newTaskStatus,
      progress:newProgress,
    }
    const result = await updateTaskById(id, data);
    response.send(result);
  });

  router.put("/saveBp/:id", authorizedUser, async function (request, response) {
    const { id } = request.params;
    const {task,blockingPoint}=request.body;
    let newObstacles=task.obstacle;
    newObstacles.push({
      bp:blockingPoint,
      soln:"",
    })
const data = {
      blockingPoint:blockingPoint,
      obstacle:newObstacles,
      solution:"",
    }
    const result = await updateTaskById(id, data);
    response.send(result);
  });

  router.put("/saveSoln/:id", authorizedUser, async function (request, response) {
    const { id } = request.params;
    const {task,solution}=request.body;
    let newObstacles=task.obstacle;
    newObstacles[newObstacles.length-1].soln=solution;
const data = {
      solution:solution,
      blockingPoint:"",
      obstacle:newObstacles,
    }
    const result = await updateTaskById(id, data);
    response.send(result);
  });

  router.get("/userDashDetail/:email",
    authorizedUser,
    async function (request, response) {

    const { email } = request.params;

    const tasks = await getUserAllTasks(email);
    let totalTasks=tasks.length;

    const opntasks = await getUserOpenTasks(email);
    let openTasks=opntasks.length;

    const clsdtasks = await getUserClosedTasks(email);
    let closedTasks=clsdtasks.length;
     
    let bp=await getUserTasksWithBlocks(email);
    let bpTasks=bp.length;

    let comDate=await getUserTasksWithNearCompletion(email);
    let criticalTasks=comDate.length;

     const dashDetail = {
      totalTasks: totalTasks,
      openTasks:openTasks,
      closedTasks:closedTasks,
      bpTasks:bpTasks,
      criticalTasks:criticalTasks
    };
  response.send(dashDetail);
    });

export const userRouter = router;