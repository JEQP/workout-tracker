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
const databaseUrl = "workoutTracker";
const collections = ["workouts"];

// mongojs (connectionString, collections(analogous to table))
const db = mongojs(databaseUrl, collections);

db.on("error", error => {
  console.log("Database Error:", error);
});

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
// app.post("/submit", ({ body }, res) => {
//   db.Note.create(body)
//     .then(({ _id }) => db.User.findOneAndUpdate({}, { $push: { notes: _id } }, { new: true }))
//     .then(dbUser => {
//       res.json(dbUser);
//     })
//     .catch(err => {
//       res.json(err);
//     });
// });
// http://localhost:3000/api/workouts/5e72b46131c6372d4536dbc1
app.post("api/workouts/:id", (req, res) => {

  db.collection("workouts").insertOne(
    {
      "_id": ObjectID(req.params.id)
    },
    {
      $set: {
        day: new Date().setDate(new Date().getDate()),
        exercises: [
          {
            type: req.body.type,
            name: req.body.name,
            duration: req.body.duration,
            weight: req.body.weight,
            reps: req.body.reps,
            sets: req.body.sets,
            distance: req.body.distanc
          }
        ]
      }
    }
  )
});

// app.post("api/workouts/:id", (req, res) => {
//   db.collection("workouts").updateOne(
//     {
//       "_id": ObjectID(req.params.id)
//     },
//     {
//       $set: {
//         day: new Date().setDate(new Date().getDate()),
//         exercises: [
//           {
//             type: req.body.type,
//             name: req.body.name,
//             duration: req.body.duration,
//             weight: req.body.weight,
//             reps: req.body.reps,
//             sets: req.body.sets,
//             distance: req.body.distance
//           }
//         ]
//       }
//     }
//   )
// });

// app.post("api/workouts/:id", (req, res) => {
//   console.log("body: " + JSON.stringify(req.body));
//   db.workouts.insertOne(
//     {
//       "_id": ObjectID(req.params.id)
//     },
//     {
//       $set: {
//         type: req.body.type,
//         name: req.body.name,
//         duration: req.body.duration,
//         weight: req.body.duration,
//         reps: req.body.reps,
//         sets: req.body.sets,
//         distance: req.body.distance
//       }
//     },
//     (error, data) => {
//       if (error) {
//         res.send(error);
//       } else {
//         res.send(data);
//       }
//     }
//   );
// });



// for createWorkout() mongo creates a new collection when one is referenced (maybe use insert instead of create)

app.post("/api/workouts", ({ body }, res) => {
  console.log("body: " + JSON.stringify(body));
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
// below was copied from other exercises. Fix it.

db.on("error", error => {
  console.log("Database Error:", error);
});



app.post("/submit", (req, res) => {
  console.log(req.body);

  db.notes.insert(req.body, (error, data) => {
    if (error) {
      res.send(error);
    } else {
      res.send(data);
    }
  });
});

app.get("/all", (req, res) => {
  db.notes.find({}, (error, data) => {
    if (error) {
      res.send(error);
    } else {
      res.json(data);
    }
  });
});

app.get("/find/:id", (req, res) => {
  db.notes.findOne(
    {
      _id: mongojs.ObjectId(req.params.id)
    },
    (error, data) => {
      if (error) {
        res.send(error);
      } else {
        res.send(data);
      }
    }
  );
});

app.post("/update/:id", (req, res) => {
  db.notes.update(
    {
      _id: mongojs.ObjectId(req.params.id)
    },
    {
      $set: {
        title: req.body.title,
        note: req.body.note,
        modified: Date.now()
      }
    },
    (error, data) => {
      if (error) {
        res.send(error);
      } else {
        res.send(data);
      }
    }
  );
});

app.delete("/delete/:id", (req, res) => {
  db.notes.remove(
    {
      _id: mongojs.ObjectID(req.params.id)
    },
    (error, data) => {
      if (error) {
        res.send(error);
      } else {
        res.send(data);
      }
    }
  );
});

app.delete("/clearall", (req, res) => {
  db.notes.remove({}, (error, response) => {
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
