const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;

const express = require("express"),
  morgan = require("morgan");

const app = express();

mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true });

// terminal logger
app.use(morgan('common'));

// static public folder
app.use(express.static('public'));

// error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});




app.get('/movies', (req, res) => {
  res.json(topMovies);
});

app.get('/movies/:title', (req, res) => {
  res.send('Successful GET request returning data on single movie');
});

app.get('/movies/genres/:title', (req, res) => {
  res.send("Successful GET request returning data about a genre of a movie by it's title");
});

app.get('/movies/directors/:name', (req, res) => {
  res.send('Successful GET request returning data about a director by name');
});

//Add a user
/* We’ll expect JSON in this format
{
  ID: Integer,
  username: String,
  password: String,
  email: String,
  birthday: Date
}*/

app.post('/users', (req, res) => {
  Users.findOne({ username: req.body.username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.username + 'already exists');
      } else {
        Users
          .create({
            username: req.body.username,
            password: req.body.uassword,
            email: req.body.email,
            birthday: req.body.birthday
          })
          .then((user) => { res.status(201).json(user) })
          .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
          })
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

// Get all users
app.get('/users', (req, res) => {
  Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Get a user by username
app.get('/users/:username', (req, res) => {
  Users.findOne({ username: req.params.username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Update a user's info, by username
/* We’ll expect JSON in this format
{
  username: String,
  (required)
  password: String,
  (required)
  email: String,
  (required)
  birthday: Date
}*/
app.put('/users/:username', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.username }, {
    $set:
    {
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      birthday: req.body.birthday
    }
  },
    { new: true }, // This line makes sure that the updated document is returned
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedUser);
      }
    });
});

// Add a movie to a user's list of favorites
app.post('/users/:username/movies/:movieID', (req, res) => {
  Users.findOneAndUpdate({ username: req.params.username }, {
    $push: { favoriteMovies: req.params.movieID }
  },
    { new: true }, // This line makes sure that the updated document is returned
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedUser);
      }
    });
});

app.delete('/users/:username/movies/:title', (req, res) => {
  res.send('Successful DELETE request allowing user to remove a movie from their favorites list');
});

app.delete('/users/:username', (req, res) => {
  res.send('Successful DELETE request allowing user to deregister');
});

// listen for requests
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});