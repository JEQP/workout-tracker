# Workout Tracker

This is a web app which allows people to track their workouts. They can add multiple exercises to the workout, and record the name, type, weight, sets, reps, and duration of each exercise, and distance if the exercise is cardio.

On loading the page it detects their most recent workout, to which they can add exercises, or they can choose to create a new workout. The stats page allows them to view the combined weight of multiple resistance exercises and workouts, as well as the total duration of all exercises.  

### Main responsibilities:
For this project I created a Mongo database using a Mongoose schema, and handled the API and HTML routes using Express. 
API routes include find, findByIdAndUpdate, create, and remove. 

Deployed URL: [http://agile-thicket-87690.herokuapp.com/](http://agile-thicket-87690.herokuapp.com/)

### Landing Page
![Landing Page](https://github.com/JEQP/workout-tracker/blob/master/start.jpg)

### Add Excerises
![Add Exercises](https://github.com/JEQP/workout-tracker/blob/master/add.jpg)

### Display Stats
![Stats](https://github.com/JEQP/workout-tracker/blob/master/stats.jpg)
