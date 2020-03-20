require('dotenv').config();
const express = require("express");
const mongojs = require("mongojs");
const logger = require("morgan"); // seems to log entries "log multiple exercises on a given day"
const path = require("path");
const mongoose = require("mongoose");

const app = express();
const Workout = require("./models/workoutModel.js");


mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });


app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

// don't know if databaseURL needs this or just workoutTracker
const databaseUrl = "mongodb://localhost/workoutTracker";
const collections = ["workouts"];

// mongojs (connectionString, collections(analogous to table))
const db = mongojs(databaseUrl, collections);

db.on("error", error => {
  console.log("Database Error:", error);
});

// HTML ROUTES

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/public/index.html"));
});

// exercise page
app.get("/exercise", (req, res) => {
  res.sendFile(path.join(__dirname + "/public/exercise.html"));
});

// stats page
app.get("/stats", (req, res) => {
  res.sendFile(path.join(__dirname + "/public/stats.html"));
});

// one database, with entries of workouts. The exercises go in an array of objects in the workeout entries.

// API ROUTES

// for getlastworkout() in api.js
app.get("/api/workouts", (req, res) => {
  db.workouts.find({}, (error, data) => {
    if (error) {
      res.send(error);
    } else {
      res.send(data);
    }
  });
});




// for addexercise()

// This is creating a new workout, and not adding the data in the body. 
app.put("/api/workouts/:id", (req, res) => {
  console.log("api body: " + JSON.stringify(req.body));
  console.log("body is " + typeof req.body);
  // var body = JSON.stringify(req.body);

  // // body = body.split("{")[1];
  // // body = body.split("}")[0];
  // // body = "["+body+"]";
  // console.log(body);
  Workout.findByIdAndUpdate( req.params.id, 
    { $push: {exercises: req.body}},
    {new: true, runValidators: true})
    .then(Workout => {
      res.json(Workout);
    })
    .catch(err => {
      res.json(err);
    });
  
});


// for createWorkout() mongo creates a new collection when one is referenced (maybe use insert instead of create)

app.post("/api/workouts", ({ body }, res) => {
  console.log("create workout body: " + JSON.stringify(body));
  Workout.create(body)
    .then(dbWorkout => {
      console.log("deWorkout: " + JSON.stringify(dbWorkout));
      res.json(dbWorkout);
    })
    .catch(err => {
      res.json(err);
    });
});


// for getworkoutsinrange()

app.get("/api/workouts/range", (req, res) => {
  db.workouts.find({}, (error, data) => {
    if (error) {
      res.send(error);
    } else {
      res.send(data);
    }
  });
});

app.delete("/api/workouts", (req, res) => {
  db.Workout.remove({}, (error, response) => {
    if (error) {
      res.send(error);
    } else {
      res.send(response);
    }
  });
});



app.listen(3000, () => {
  console.log("App running on port 3000!");
});
