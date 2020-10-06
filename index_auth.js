/*_______________>
added ___ passport.authenticate('jwt', { session: false }), ____
in between url and callback function.
Example:
app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
_______________<*/


const express = require('express');
  bodyParser = require('body-parser');
  uuid = require('uuid');
  morgan = require('morgan');
  path = require('path');
  //Integrating monggose with a REST API
  mongoose = require('mongoose');
  Models = require('./models.js');
  Movies = Models.Movie;
  Users = Models.User;

/*______________________>
const passport = require('passport');
require('./passport');
______________________<*/

const { check, validationResult } = require('express-validator');
const app = express();

mongoose.connect('mongodb://localhost:27017/myFlixDB', {useNewUrlParser: true, useUnifiedTopology: true});

// Middleware //
app.use(bodyParser.json()); // JSON Parsing
app.use(morgan('common')); // logging with Morgan
app.use(express.static('public')); //retrieves files from public folder
app.use('/client', express.static(path.join(__dirname, 'client', 'dist'))); // add this code right after the line app.use(express.static("public"));. task 3.6 prep for hosting

/*___________________________>
let auth = require('./auth') (app); // imports the auth.js file into the project and (app) makes sure Express is available in the auth.js file as well
___________________________<*/

app.get('/client/*', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

// Homepage
app.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
        var responseText = 'Welcome to My Flix';
        res.send(responseText);
});

// Return a list of ALL movies to the user
/* We'll expect data in the following JSON Format
({
  Title: {type: Sring, required: true},
  Description: {type: String, requried: true},
  Genre: {
    Name: String,
    Description: String
  },
  Director: {
    Name: String,
    Bio: String
  },
  Actors: [String],
  ImmangePath: String,
  Featured: Boolean
}),*/

app.get('/Movies', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.find()
  .then((movies) => {
      res.status(201).json(movies);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err)
  });
});


/* Return data (description, genre, director, image URL, whether it’s featured or not)
about a single movie by title to the user*/

/*({
  Title: {type: Sring, required: true},
  Description: {type: String, requried: true},
  Genre: {
    Name: String,
    Description: String
  },
  Director: {
    Name: String,
    Bio: String
  },
  Actors: [String],
  ImmangePath: String,
  Featured: Boolean
}),*/

app.get('/movies/:Title', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({Title: req.params.Title})
  .then((movie) => {
    res.status(201).json(movie);
  })
  .catch((err) => {
    console.error(err),
    res.status(500).send('error: ' + err);
  });
});

// Return data about a genre (description) by name/title (e.g., “Thriller”)
/* We'll expect data in the following JSON Format
({
  Title: {type: Sring, required: true},
  Genre: {
    Name: String,
    Description: String
  }
}),*/

app.get('/movies/genre/:Name', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({Name: req.params.Name})
  .then((movie) => {
    res.status(201).json('The genre of this movie is: ' + movie.genre.name + '.' +
    'Description of this genre: ' + movie.Genre.Description)
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
    }
  )
});

// Return data about a director by name (bio, birth year, death year) by name
/* We'll expect data in the following JSON Format
({
  Director: {
    Name: String,
    Bio: String
  },
}),*/


app.get('/movies/Director/:name', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({'Director.Name': req.params.Name})
  .then((movies) => {
    res.status(201).json('Name: ' + movies.Director.Name + '.'
    + 'Director\'s Bio: ' + movies.Director.Bio + '.')
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

// user
//Get all user
/* We'll expect JSON in this format
{
  ID: Integer,
  Username: String,
  Passowrd: String,
  Email: String,
  Birthday: Date
}*/

app.get('/users', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.find()
  .then((users) => {
    res.status(201).json(users);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

// Allow new users to register
// Add a user
/* We'll expect JSON in this format
{
  ID: Integer,
  Username: String,
  Passowrd: String,
  Email: String,
  Birthday: Date
}*/

app.post('/users', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOne({Username: req.body.Username }) //checks whether User already exists
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + 'already exists'); //if user exists this message is returned
      } else { //if user does not yet exist, this is the command to create the new user
        Users.create({ //schema corresponds to the schema designed in the models.js file
          Username: req.body.Username, // each value is set to a value received from the request body req.body, which is the request that the user sends.
          Password: req.body.Password,
          Email: req.body.Email,
          Birthday: req.body.Birthday
        })
        .then((user) =>{res.status(201).jsaon(user)}) // after the document with user data is created, a callback takes the document you just added as a parameter. The new doc is given the name "user" and a response is sent back a response to the client
        .catch((error) => {  //error-handling function
          console.error(error);
          res.status(500).send('Error: ' + error);
        })
      }
    })
    .catch((error) => { //this catch-function catches any problems that Mongoose encounters while running the create command
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
  });

// Allow users to update their user info (username, password, email, date of birth)
/*We'll expect JSON in this format
{
  Username: String,(required)
  Password: String, (required)
  Email: String, (required)
  Birthday: Date
}*/


app.put('/users/:username', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate({Password: req.params.Username},
    {$set: {
      Username: req.body.Username,
      Password: req.body.Password,
      Email: req.body.Email,
      Birthday: req.body.Birthday,
      }},
    {new:true}, //Makes sure updated doc is returnes
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedUser);
      }
    },
  )
});
 

// Allow users to add a movie to their list of favorites
/* We'll expect data in the following JSON Format
({
  Title: {type: Sring, required: true},
}),*/

app.post('/users/:Username/Movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username},
    {$push: {FavoriteMovies:req.params.MovieID}
  },
  {new: true}, //This line makes sure that the updated doc is returned
  (err, updatedUser) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});


// Allow users to remove a movie from their list of favorites
app.delete('/users/:Username/Movies/:MovieID', passport.authenticate('jwt', { session: false }),(req, res) => {
  Users.findOneAndRemove(
    {Username: req.params.Username},
    {$pull: { Favorites: req.params.MovieID}},
    {new:true},
    (err, updatedUser) => {
      if(err) {
        console.error(err);
        res.status(201).send('Error: ' + err);
      } else {
        res.json(updatedUser);
      }
    }
  );
});

// Allow existing users to deregister
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndRemove({ username: req.params.Username})
  .then((user) => { //this callback checks wehther a document with the serched-for username exists, otherweise throws error
    if (!user) { //if user is found response 'was deleted' is sent back.
      res.status(400).send(req.params.Username + ' was deleted.');
    }
  })
  .catch((err) => { //error-handling callback.
    console.error(err);
    res.status(500).send('Error: ' +err);
  })
});



// listen for requests
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});