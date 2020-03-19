const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const WorkoutSchema = new Schema({

    day: {
        type: Date,
        default: Date.now
    },
    exercises: [
        {
            type: String,
            trim: true,
            required: "Exercise type is required"
        },
        {
            name: String,
            trim: true,
            required: "Exercise name is required"
        },
        {
            duration: Number  
        },
        {
            weight: Number 
        },
        {
            reps: Number 
        },
        {
            
            sets: Number 
        },
        {
            duration: Number 
        },
        {
            distance: Number 
        }
    ]
  
  
  });
  
  const Workout = mongoose.model("User", WorkoutSchema);

  module.exports = Workout;