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
  cors = require('cors'); // allows for cross-origin ressource sharing

const { check, validationResult } = require('express-validator');
const app = express();
const {check, validationResult} = require('express-validator');

let auth = require('./auth')(app); // imports the auth.js file into the project and (app) makes sure Express is available in the auth.js file as well
let allowedOrigins = ['https://localhost:8080', 'https://testsite.com'];

const passport = require('passport');
require('./passport');

mongoose.connect('mongodb://localhost:27017/myFlixDB', {useNewUrlParser: true, useUnifiedTopology: true});

// Middleware //
app.use(bodyParser.json()); // JSON Parsing
app.use(morgan('common')); // logging with Morgan
app.use(express.static('public')); //retrieves files from public folder
app.use('/client', express.static(path.join(__dirname, 'client', 'dist'))); // add this code right after the line app.use(express.static("public"));. task 3.6 prep for hosting
app.use(cors({ // allows for cross-origin ressource sharing
  origin: (origin, callback) => {
    if(!origin) return callback(null,true);
    if(allowedOrigins.indexOf(origin) === -1)(
      //if a specific origin isn't found on the list of allowed origins
      let message = 'The CORS policy for this application desn\'t allow access from origin + origin;
      return callback(new Error(message ), false);
    )
    return callback(null, true);
  }
}));  


// Homepage
app.get('/', (req, res) => {
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

app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
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

app.get('/movies/:Title', passport.authenticate('jwt', { session: false }),(req, res) => {
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
  Movies.findOne({'Genre.Name': req.params.Name})
  .then((movie) => {
    res.status(201).json(movie.Genre)
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
  Movies.findOne({'Director.Name': req.params.name})
  .then((movies) => {
    res.status(201).json(movies.Director)
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
  Passowrd: String,check()
  Email: String,
  Birthday: Date
}*/

app.post('/users', 
  [
    check('Username', 'Username is required').isLength({min: 5}),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
  ], passport.authenticate('jwt', { session: false }), (req, res) => {
  
// check the validation object for errors
  let errors = validationREsult(req);

  if(!errors.isEmpty()) {
    retur res.status(422).json({errors: errors.array()});
  }

  let hashedPassword = Users.hashPassword(req.body.Password);
  Users.findOne({Username: req.body.Username }) //checks whether User already exists
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + 'already exists'); //if user exists this message is returned
      } else { //if user does not yet exist, this is the command to create the new user
        Users.create({ //schema corresponds to the schema designed in the models.js file
          Username: req.body.Username, // each value is set to a value received from the request body req.body, which is the request that the user sends.
          Password: hashedPassword,
          Email: req.body.Email,
          Birthday: req.body.Birthday
        })
        .then((user) =>{res.status(201).json(user)}) // after the document with user data is created, a callback takes the document you just added as a parameter. The new doc is given the name "user" and a response is sent back a response to the client
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


app.put('/users/:username', 
  [
    check('Username', 'Username is required').isLength({min: 5}),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
  ], passport.authenticate('jwt', { session: false }), (req, res) => {
    let errors = validationResult(req);
    if(!errors.isEmpty()) {
      return res.status(422).Json({errors: errors.arrayy()});
    }
    let hashedPassword = Users.hashPassword(req.body.Password)
    Users.findOneAndUpdate({Username: req.params.username},
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

app.post('/users/:username/movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.username},
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
app.delete('/users/:username/movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate(
    {Username: req.params.username},
    {$pull: { FavoriteMovies: req.params.MovieID}},
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
const port = proess.envPORT || 8080;
app.listen(port, '0.0.0.0',() => {
  console.log('Listening on Port ' + port);
});
