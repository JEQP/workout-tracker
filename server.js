require('dotenv').config();
const express = require("express");
const mongojs = require("mongojs");
const logger = require("morgan"); 
const path = require("path");
const mongoose = require("mongoose");

const app = express();
const Workout = require("./models/workoutModel.js");

var PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });


app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

// const databaseUrl = "mongodb://localhost/workoutTracker";
const databaseUrl = process.env.MONGODB_URI;
const collections = ["workouts"];

const db = mongojs(databaseUrl, collections);

db.on("error", error => {
  console.log("Database Error:", error);
});

// HTML ROUTES

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/public/index.html"));
});

app.get("/exercise", (req, res) => {
  res.sendFile(path.join(__dirname + "/public/exercise.html"));
});

app.get("/stats", (req, res) => {
  res.sendFile(path.join(__dirname + "/public/stats.html"));
});

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

app.put("/api/workouts/:id", (req, res) => {
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


// for createWorkout() 

app.post("/api/workouts", ({ body }, res) => {
  Workout.create(body)
    .then(dbWorkout => {
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



app.listen(PORT, () => {
  console.log("App running on port 3000!");
});
