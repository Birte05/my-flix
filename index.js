const express = require('express');
  bodyParser = require('body-parser');
  uuid = require('uuid');
  morgan = require('morgan');

const app = express();

// Middleware //
app.use(bodyParser.json()); // JSON Parsing
app.use(morgan('common')); // logging with Morgan
app.use(express.static('public')); //retrieves files from public folder
app.use('/client', express.static(path.join(__dirname, 'client', 'dist'))); // add this code right after the line app.use(express.static("public"));. task 3.6 prep for hosting

app.get('/client/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

// In-Memory Data bodyParser

// Movies
let Movies = [
  { MovieID: 1,
    Title: 'Das Geisterhaus',
    Description: 'Im Zentrum dieses in der Zeitspanne der 1920er bis 1970er Jahre in Chile spielenden Filmes steht Esteban Trueba, ein Mann aus einfachsten Verhältnissen, der durch harte Arbeit als Goldgräber und Farmer zu Vermögen und Macht kommt, als Großgrundbesitzer die Arbeiterbewegung bekämpft und auch familiär Härte und Unerbittlichkeit entwickelt, bis er, durch den Verlust der ihm liebsten Menschen vereinsamt und erschüttert durch die politischen Umwälzungen der 1960er und 1970er Jahre, geläutert wird.',
    Genre: 'Drama',
    Name: 'Bille August'
  },
  {
    MovieID: 2,
    Title: 'Die unendliche Geschichte',
    Description: 'Der zehnjährige Bastian Balthasar Bux wird regelmäßig von seinen Klassenkameraden schikaniert. Auf der Flucht vor ihnen rettet er sich eines Tages in ein Antiquariat, wo er dem alten Buchhändler Karl Konrad Koreander begegnet. Dieser liest in einem geheimnisvollen Buch, vor dem er Bastian jedoch eindringlich warnt. Bastian kann nicht widerstehen und stiehlt das Buch, um es auf dem Dachboden seiner Schule (wo er sich versteckt) zu lesen. Das Buch heißt „Die Unendliche Geschichte“ und handelt von einer geheimnisvollen Welt namens Phantásien.',
    Genre: 'Fantasy',
    Name: 'Wolfgang Petersen'
  },
  {
    MovieID: 3,
    Title: 'Inception',
    Description:  'Das US-Militär entwickelte das sogenannte Traum-Sharing, ein Verfahren zur Beeinflussung des Traumes eines nichtsahnenden Opfers. Angreifer können nicht nur Mitwirkende des Traumes sein, sondern können auch die Traumwelt erschaffen und kontrollieren. Aufbauend auf dieser Möglichkeit zur gemeinsamen Traumbegehung entwickelten Dominick Cobb und seine Frau Mal das Konzept vom Traum im Traum. Charakteristisch ist, dass die Zeit für den Träumenden im Traum erheblich schneller vergeht. Die Realität um ihn herum erscheint dem Träumenden daher langsamer. Dieser Eindruck verstärkt sich mit jeder weiteren Traumebene.',
    Genre: 'Fantasy',
    Name: 'Christopher Nolan'
  },
  {
    MovieID: 4,
    Title: 'Forrest Gump',
    Description: 'Die Rahmenhandlung beginnt damit, dass Forrest Gump auf einer Bank an einer Bushaltestelle in Savannah im Bundesstaat Georgia sitzt. Dort erzählt er mehreren Personen in Episoden sein bisheriges Leben: Kurz vor seiner Einschulung wird bei Gump ein Intelligenzquotient von nur 75 festgestellt. Außerdem muss er wegen eines Wirbelsäulenleidens Beinschienen tragen. Dies macht ihn zu einem leichten Opfer für Hänseleien seiner Altersgenossen. Als er wieder einmal verspottet und angegriffen wird, verliert er im Weglaufen seine Beinschienen und entdeckt so, dass er ein sehr schneller Läufer ist. Mut machen ihm seine Mutter, die sich vom Spott ihrer Umwelt nicht beeindrucken lässt und entschlossen ist, ihm eine gute Ausbildung zu ermöglichen, sowie seine Freundschaft mit der gleichaltrigen Jenny Curran, die stets zu ihm hält.',
    Genre: 'Drama',
    Name: 'Robert Zemeckis'
  },
    {
    MovieID: 5,
    Title: 'Tenet',
    Description: 'Ein Agent wird rekrutiert, um einen besonderen Auftrag auszuführen. Er soll den 3. Weltkrieg verhindern. Diesmal ist jedoch keine nukleare Bedrohung der Grund. Es muss eine Person gestoppt werden, die die Fähigkeit besitzt, die Zeit zu manipulieren.',
    Genre: 'Action',
    Name: 'Christopher Nolan'
    },
    {
    MovieID: 6,
    Title: 'Nachtzug nach Lissabon',
    Description: 'Raimund Gregorius ist ein in die Jahre gekommener Gymnasiallehrer für alte Sprachen in Bern, der – seit über fünf Jahren geschieden – allein in seiner mit Büchern vollgestopften, dunklen Etagenwohnung lebt, unter Schlaflosigkeit leidet und jeden Morgen schon vor dem Frühstück Schach mit sich selbst spielt. An einem regnerischen Morgen rettet er auf seinem Weg zur Schule eine junge Portugiesin.',
    Genre: 'Drama',
    Name: 'Bille August'
    },
    {
    MovieID: 7,
    Title: 'Coffee and Cigarettes',
    Description: 'In ähnlicher Umgebung führen eine Reihe von Personen, darunter viele aus Jarmuschs engerem Umfeld, skurrile Smalltalks bei Kaffee und Zigaretten. Die 11 Episoden entstanden zu verschiedenen Zeitpunkten, die früheste mit Roberto Benigni stammt aus dem Jahr 1986.',
    Genre: 'Biopic',
    Name: 'Jim Jarmusch'
    },
    {
    MovieID: 8,
    Title: 'Avatar',
    Description: 'Im Jahr 2154 sind die Rohstoffe der Erde erschöpft. Der Konzern Resources Development Administration baut auf dem erdähnlichen, fernen Mond Pandora im Alpha-Centauri-System den begehrten Rohstoff Unobtainium ab und gerät dabei in Konflikt mit einer humanoiden Spezies namens Na’vi, die sich gegen die Zerstörung ihrer Umwelt verteidigt. Pandora ist von erdähnlichen Lebensformen besiedelt (grüne Pflanzen und an irdische Säugetiere erinnernde Tiere), hat aber eine Atmosphäre, die für Menschen tödlich ist.',
    Genre: 'Action',
    Name: 'James Cameron'
    },
    {
    MovieID: 9,
    Title: 'Lost in Translation',
    Description: 'Der alternde US-amerikanische Filmstar Bob Harris reist für eine Woche nach Tokio, um dort seine schwindende Popularität für eine Whisky-Werbung zur Verfügung zu stellen. Im selben Hotel wohnt die Amerikanerin Charlotte, die junge Ehefrau eines flippigen Boulevard-Fotografen. Dieser wurde vom Verlag der Illustrierten, bei welcher er arbeitet, für eine mehrtägige Auftragsarbeit nach Japan geschickt.',
    Genre: 'Drama',
    Name: 'Sophia Coppola'
    },
    {
    MovieID: 10,
    Title: 'Nirgendwo in Afrika',
    Description: 'Die jüdische Familie Redlich flüchtet im Jahr 1938 mit einer kleinen Tochter vor dem NS-Regime aus dem Deutschen Reich nach Kenia. Der ehemalige Rechtsanwalt Walter Redlich arbeitet dort als Verwalter auf einer kümmerlichen Farm eines Briten. Seine Frau Jettel kann sich nur schwer an das Leben in dem ganz anderen Land gewöhnen. Sie hat große Schwierigkeiten mit den Fremdsprachen und der fremden kulturellen Umgebung.',
    Genre: 'Drama',
    Name: 'Caroline Link'
    },
];



// GETs the list of data about All movies, in Task 3.5 add jwt auth to this endpoint
app.get('/movies', (req, res) => {
    Movies.find()
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});
// GETs the data about a single movie, by title
app.get('/movies/:Title', (req, res) => {
      Movies.findOne({ Title: req.params.Title })
      .then((movie) => {
        res.json(movie);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

// GETs the data about a director, by name
app.get('/movies/Director/:Name', (req, res) => {
      Movies.findOne({ Name: req.params.Name })
      .then((movies) => {
        res.json(
              'Name: ' +
              movies.Director.Name +
              'Bio: '+
              movies.Director.Bio +
              'Birth Year: '+
              movies.Director.Birth +
              'Death Year: '+
              movies.Director.Death
          );
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

// GETs the data about Genre name and description by movie title
app.get('/movies/Genre/:Title',  (req, res) => {
      Movies.findOne({ Title: req.params.Title })
      .then((movie) => {
        res
          .status(201)
          .json(
            'The genre of this movie is: ' +
              movie.Genre.Name +
              '. ' +
              movie.Genre.Description
              );
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

// Start users scripts here//

// Register new user
app.post('/users',
  // validation logic here for request
  [
    check('Username', 'Username is required').isLength({ min: 8 }),
    check(
      'Username',
      'Username contains non alphanummeric characters - please add.'
    ).isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail(),
  ],
  (req, res) => {
    //check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOne({ Username: req.body.Username })
      .then((user) => {
        if (user) {
          return res.status(400).send(req.body.Username + 'already exists');
        } else {
          Users.create({
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
            .then((user) => {
              res.status(201).json(user);
            })
            .catch((error) => {
              console.error(error);
              res.status(500).send('Error: ' + error);
            });
  };

// UPDATE a user's info in JSON format by username

app.put('/users/:Username', [
    check('Username', 'Username is required').isLength({ min: 8 }),
    check(
      'Username',
      'Username lacks non-alphanummeric characters - please add.'
    ).isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email is required').isEmail(),
  ],
  (req, res) => {

    //check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = Users.hashPassword(req.body.Password);

    Users.findOneAndUpdate(
     { Username: req.params.Username },
     {
       $set: {
         Username: req.body.Username,
         Password: hashedPassword,
         Email: req.body.Email,
          Birthday: req.body.Birthday,
        }
     },
     { new: true }, //Makes sure updated document is returned
      (err, updatedUser) => {
        if (err) {
          console.error(err);
          res.status(500).send('Error: ' + err);
       } else {
         res.json(updatedUser);
       }
     }
   );
  }
);

// ADD a movie to a user's list of favorites
app.post('/users/:Username/Movies/:_id',  (req, res) => {
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      { $push: { Favorites: req.params._id } },
      { new: true }, // This line makes sure that the updated document is returned
      (err, updatedUser) => {
        if (err) {
          console.error(err);
          res.status(500).send('Error: ' + err);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);

// DELETE a favorite movie from the list.
app.delete('/users/:Username/Movies/:_id', (req, res) => {
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      { $pull: { Favorites: req.params._id } },
      { new: true },
      (err, updatedUser) => {
        if (err) {
          console.error(err);
          res.status(500).send('Error: ' + err);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);

//REMOVE existing users by username
app.delete('/users/:Username', (req, res) => {
    Users.findOneAndRemove({ Username: req.params.Username })
      .then((user) => {
        if (!user) {
          res.status(400).send(req.params.Username + ' was not found');
        } else {
          res.status(200).send(req.params.Username + ' was deleted.');
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: '  + err);
      });
  }
);
// listen for requests
//default textual response
/*app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});*/

// listen for requests
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});
