const express = require('express'),
      morgan = require('morgan');
const app = express();

//Middleware
app.use(express.static('public'));
app.use(morgan('common'));

let topMovies = [
  {
    title: 'Das Geisterhaus',
    author: 'Bille August'
  },
  {
    title: 'Die unendliche Geschichte',
    author: 'Michael Ende'
  }
  {
    title: 'Inception',
    author: 'Christopher Nolan'
  },
  {
    title: 'Forrest Gump',
    author: 'Roger Zemeckis'
  },
  {
    title: 'König der Löwen',
    author: 'Roger Allers'
  },{
    title: 'Big Lebowski',
    author: 'Ethan Coen'
  },
  {
    title: 'Leon der Profi',
    author: 'Luc Besson'
  },
  {
    title: 'Seven',
    author: 'David Fincher'
  },
  {
    title: 'Lola rennt',
    author: 'Tom Tykwer'
  },
  {
    title: 'Das Leben des Brian',
    author: 'Terry Jones'
  }
];

// GET requests
app.get('/', (req, res) => {
  res.send('Welcome to my-flix!');
});

app.get('/documentation', (req, res) => {
  res.sendFile('public/documentation.html', { root: __public });
});

app.get('/movies', (req, res) => {
  res.json(topMovies);
});

//default textual response
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// listen for requests
app.listen(8080, () =>
  console.log('Your app is listening on port 8080.');
);
