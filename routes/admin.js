import express from "express";
import {
  getUserByAdminEmail,
  createAdmin,
  createNewTask,
  getAdminOpenTasks,
  getAdminClosedTasks,
  getTaskById,
  updateTaskById,
  deleteTaskById,
  getAdminAllTasks,
  getAdminTasksWithStatus,
  getAdminTasksWithBlocks,
  getAdminTasksWithNearCompletion
} from "./helper.js";
import { generateHashedPassword } from "../index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { authorizedUser } from "../middleware/auth.js";

const router = express.Router();

router.post("/signup", async function (request, response) {
  const { FirstName, LastName, Email, Password } = request.body;
  const userFromDB = await getUserByAdminEmail(Email);

  if (userFromDB) {
    response.status(400).send({ message: "Username already exists" });
  } else {
    const hashedPassword = await generateHashedPassword(Password);
    const result = await createAdmin({
      FirstName: FirstName,
      LastName: LastName,
      Email: Email,
      Password: hashedPassword,
    });
    response.send({ message: "successful Signup" });
  }
});

router.post("/login", async function (request, response) {
  const { Email, Password } = request.body;
  const userFromDB = await getUserByAdminEmail(Email);

  if (!userFromDB) {
    response.status(400).send({ message: "Invalid Credential" });
    return;
  } else {
    // check password
    const storedPassword = userFromDB.Password;
    const isPasswordMatch = await bcrypt.compare(Password, storedPassword);
    if (isPasswordMatch) {
      const secret = process.env.SECRET_KEY;
      const payload = {
        Email: Email,
      };

      let token = jwt.sign(payload, secret, { expiresIn: "1h" });
      let userData = {
        id: userFromDB._id,
        FirstName: userFromDB.FirstName,
        LastName: userFromDB.LastName,
        Email: userFromDB.Email,
        type: "admin",
      };
      response
        .status(200)
        .send({ code: 0, message: "ok", data: token, user: userData });
    } else {
      response.status(400).send({ message: "Invalid Credential" });
      return;
    }
  }
});




router.post("/newTask", authorizedUser, async function (request, response) {
  const {
    taskName,
    assigneeEmail,
    taskDetail,
    taskEndDate,
  } = request.body;

  const data = {
    taskName: taskName,
    assigneeEmail: assigneeEmail,
    taskDetail: taskDetail,
    taskEndDate: taskEndDate,
    createdAt: new Date(),
    taskStatus: "yet to start",
    blockingPoint:"",
    solution:"",
    obstacle:[],
  };
  //db.movies.insertMany(data);
  const result = await createNewTask(data);
  response.send(result);
});



router.get("/openTasks", authorizedUser, async function (request, response) {
  //db.movies.find({});

  const events = await getAdminOpenTasks();
  response.send(events);
});

router.get("/closedTasks", authorizedUser, async function (request, response) {
  //db.movies.find({});

  const events = await getAdminClosedTasks();
  response.send(events);
});


router.get(
  "/dashboardDetail",
  authorizedUser,
  async function (request, response) {

    const tasks = await getAdminAllTasks();
    let totalTasks=tasks.length;

    const opntasks = await getAdminOpenTasks();
    let openTasks=opntasks.length;

    const clsdtasks = await getAdminClosedTasks();
    let closedTasks=clsdtasks.length;
    
    const ntStarted = await getAdminTasksWithStatus("yet to start");
    let notStarted=ntStarted.length;

    const requirement = await getAdminTasksWithStatus("Requirement Analysis");
    let reqTasks=requirement.length;

    const documentation = await getAdminTasksWithStatus("Documentation");
    let docTasks=documentation.length;

    const coding = await getAdminTasksWithStatus("Coding");
    let codingTasks=coding.length;

    const testing = await getAdminTasksWithStatus("Testing");
    let testingTasks=testing.length;

    let inProgress= reqTasks + docTasks + codingTasks + testingTasks;
     
    let bp=await getAdminTasksWithBlocks();
    let bpTasks=bp.length;

    
    let comDate=await getAdminTasksWithNearCompletion();
    let criticalTasks=comDate.length;



     const dashDetail = {
      totalTasks: totalTasks,
      openTasks:openTasks,
      closedTasks:closedTasks,
      notStarted:notStarted,
      reqTasks:reqTasks,
      docTasks:docTasks,
      codingTasks:codingTasks,
      testingTasks:testingTasks,
      inProgress:inProgress,
      bpTasks:bpTasks,
      criticalTasks:criticalTasks
    };
    response.send(dashDetail);
  }
);

router.get("/task/:id", authorizedUser, async function (request, response) {
  const { id } = request.params;
  // const movie=movies.find((mv)=>mv.id===id);
  const task = await getTaskById(id);
  task
    ? response.send(task)
    : response.status(404).send({ msg: "task not found" });
});
router.get("/criticalTasks", authorizedUser, async function (request, response) {
  const task = await getAdminTasksWithNearCompletion();
  task
    ? response.send(task)
    : response.status(404).send({ msg: "task not found" });
});



router.put("/task/:id", authorizedUser, async function (request, response) {
  const { id } = request.params;
  const data = request.body;
  const result = await updateTaskById(id, data);
  response.send(result);
});

router.delete("/task/:id", authorizedUser, async function (request, response) {
  const { id } = request.params;
  const result = await deleteTaskById(id);
  result.deletedCount > 0
    ? response.send({ msg: "event deleted successfully" })
    : response.status(404).send({ msg: "event not found" });
});






export const adminRouter = router;
