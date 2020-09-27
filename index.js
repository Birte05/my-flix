const express = require('express');
  bodyParser = require('body-parser');
  uuid = require('uuid');
  morgan = require('morgan');
  path = require('path');

const { check, validationResult } = require('express-validator');
const app = express();

// Middleware //
app.use(bodyParser.json()); // JSON Parsing
app.use(morgan('common')); // logging with Morgan
app.use(express.static('public')); //retrieves files from public folder
app.use('/client', express.static(path.join(__dirname, 'client', 'dist'))); // add this code right after the line app.use(express.static("public"));. task 3.6 prep for hosting

app.get('/client/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

// List of movies
let movies = [
  { MovieID: 1,
    title: 'Das Geisterhaus',
    Description: 'Im Zentrum dieses in der Zeitspanne der 1920er bis 1970er Jahre in Chile spielenden Filmes steht Esteban Trueba, ein Mann aus einfachsten Verhältnissen, der durch harte Arbeit als Goldgräber und Farmer zu Vermögen und Macht kommt, als Großgrundbesitzer die Arbeiterbewegung bekämpft und auch familiär Härte und Unerbittlichkeit entwickelt, bis er, durch den Verlust der ihm liebsten Menschen vereinsamt und erschüttert durch die politischen Umwälzungen der 1960er und 1970er Jahre, geläutert wird.',
    Genre: 'Drama',
    Name: 'Bille August'
  },
  {
    MovieID: 2,
    title: 'Die unendliche Geschichte',
    Description: 'Der zehnjährige Bastian Balthasar Bux wird regelmäßig von seinen Klassenkameraden schikaniert. Auf der Flucht vor ihnen rettet er sich eines Tages in ein Antiquariat, wo er dem alten Buchhändler Karl Konrad Koreander begegnet. Dieser liest in einem geheimnisvollen Buch, vor dem er Bastian jedoch eindringlich warnt. Bastian kann nicht widerstehen und stiehlt das Buch, um es auf dem Dachboden seiner Schule (wo er sich versteckt) zu lesen. Das Buch heißt „Die Unendliche Geschichte“ und handelt von einer geheimnisvollen Welt namens Phantásien.',
    Genre: 'Fantasy',
    Name: 'Wolfgang Petersen'
  },
  {
    MovieID: 3,
    title: 'Inception',
    Description:  'Das US-Militär entwickelte das sogenannte Traum-Sharing, ein Verfahren zur Beeinflussung des Traumes eines nichtsahnenden Opfers. Angreifer können nicht nur Mitwirkende des Traumes sein, sondern können auch die Traumwelt erschaffen und kontrollieren. Aufbauend auf dieser Möglichkeit zur gemeinsamen Traumbegehung entwickelten Dominick Cobb und seine Frau Mal das Konzept vom Traum im Traum. Charakteristisch ist, dass die Zeit für den Träumenden im Traum erheblich schneller vergeht. Die Realität um ihn herum erscheint dem Träumenden daher langsamer. Dieser Eindruck verstärkt sich mit jeder weiteren Traumebene.',
    Genre: 'Fantasy',
    Name: 'Christopher Nolan'
  },
  {
    MovieID: 4,
    title: 'Forrest Gump',
    Description: 'Die Rahmenhandlung beginnt damit, dass Forrest Gump auf einer Bank an einer Bushaltestelle in Savannah im Bundesstaat Georgia sitzt. Dort erzählt er mehreren Personen in Episoden sein bisheriges Leben: Kurz vor seiner Einschulung wird bei Gump ein Intelligenzquotient von nur 75 festgestellt. Außerdem muss er wegen eines Wirbelsäulenleidens Beinschienen tragen. Dies macht ihn zu einem leichten Opfer für Hänseleien seiner Altersgenossen. Als er wieder einmal verspottet und angegriffen wird, verliert er im Weglaufen seine Beinschienen und entdeckt so, dass er ein sehr schneller Läufer ist. Mut machen ihm seine Mutter, die sich vom Spott ihrer Umwelt nicht beeindrucken lässt und entschlossen ist, ihm eine gute Ausbildung zu ermöglichen, sowie seine Freundschaft mit der gleichaltrigen Jenny Curran, die stets zu ihm hält.',
    Genre: 'Drama',
    Name: 'Robert Zemeckis'
  },
    {
    MovieID: 5,
    title: 'Tenet',
    Description: 'Ein Agent wird rekrutiert, um einen besonderen Auftrag auszuführen. Er soll den 3. Weltkrieg verhindern. Diesmal ist jedoch keine nukleare Bedrohung der Grund. Es muss eine Person gestoppt werden, die die Fähigkeit besitzt, die Zeit zu manipulieren.',
    Genre: 'Action',
    Name: 'Christopher Nolan'
  },
  {
    MovieID: 6,
    title: 'Nachtzug nach Lissabon',
    Description: 'Raimund Gregorius ist ein in die Jahre gekommener Gymnasiallehrer für alte Sprachen in Bern, der – seit über fünf Jahren geschieden – allein in seiner mit Büchern vollgestopften, dunklen Etagenwohnung lebt, unter Schlaflosigkeit leidet und jeden Morgen schon vor dem Frühstück Schach mit sich selbst spielt. An einem regnerischen Morgen rettet er auf seinem Weg zur Schule eine junge Portugiesin.',
    Genre: 'Drama',
    Name: 'Bille August'
  },
  {
    MovieID: 7,
    title: 'Coffee and Cigarettes',
    Description: 'In ähnlicher Umgebung führen eine Reihe von Personen, darunter viele aus Jarmuschs engerem Umfeld, skurrile Smalltalks bei Kaffee und Zigaretten. Die 11 Episoden entstanden zu verschiedenen Zeitpunkten, die früheste mit Roberto Benigni stammt aus dem Jahr 1986.',
    Genre: 'Biopic',
    Name: 'Jim Jarmusch'
  },
  {
    MovieID: 8,
    title: 'Avatar',
    Description: 'Im Jahr 2154 sind die Rohstoffe der Erde erschöpft. Der Konzern Resources Development Administration baut auf dem erdähnlichen, fernen Mond Pandora im Alpha-Centauri-System den begehrten Rohstoff Unobtainium ab und gerät dabei in Konflikt mit einer humanoiden Spezies namens Na’vi, die sich gegen die Zerstörung ihrer Umwelt verteidigt. Pandora ist von erdähnlichen Lebensformen besiedelt (grüne Pflanzen und an irdische Säugetiere erinnernde Tiere), hat aber eine Atmosphäre, die für Menschen tödlich ist.',
    Genre: 'Action',
    Name: 'James Cameron'
  },
  {
    MovieID: 9,
    title: 'Lost in Translation',
    Description: 'Der alternde US-amerikanische Filmstar Bob Harris reist für eine Woche nach Tokio, um dort seine schwindende Popularität für eine Whisky-Werbung zur Verfügung zu stellen. Im selben Hotel wohnt die Amerikanerin Charlotte, die junge Ehefrau eines flippigen Boulevard-Fotografen. Dieser wurde vom Verlag der Illustrierten, bei welcher er arbeitet, für eine mehrtägige Auftragsarbeit nach Japan geschickt.',
    Genre: 'Drama',
    Name: 'Sophia Coppola'
  },
  {
    MovieID: 10,
    title: 'Nirgendwo in Afrika',
    Description: 'Die jüdische Familie Redlich flüchtet im Jahr 1938 mit einer kleinen Tochter vor dem NS-Regime aus dem Deutschen Reich nach Kenia. Der ehemalige Rechtsanwalt Walter Redlich arbeitet dort als Verwalter auf einer kümmerlichen Farm eines Briten. Seine Frau Jettel kann sich nur schwer an das Leben in dem ganz anderen Land gewöhnen. Sie hat große Schwierigkeiten mit den Fremdsprachen und der fremden kulturellen Umgebung.',
    Genre: 'Drama',
    Name: 'Caroline Link'
  },
];


// Return a list of ALL movies to the user
app.get('/Movies', (req, res) => {
        res.json(movies);
});

/* Return data (description, genre, director, image URL, whether it’s featured or not)
about a single movie by title to the user*/

app.get('/movies/:description', (req, res) => {
  res.json(movies.find((movie) =>
    { return movies.description === req.params.description}));
});

// Return data about a genre (description) by name/title (e.g., “Thriller”)

app.get('/movies/:genre', (req, res) => {
  res.json(movies.find((movie) =>
    { return movie.genre === req.params.genre }));
});

// Return data about a director (bio, birth year, death year) by name
app.get('/movies/:name', (req, res) => {
  res.json(movies.find((movie) =>
    { return movie.name === req.params.name }));
});

// Allow new users to register
app.post('/movies/:users', (req, res) => {
  res.send('Successful POST request for new users to register');
 });

// Allow users to update their user info (username, password, email, date of birth)
app.put('/movies/:users/:password', (req, res) => {
  res.send('Successful password update');
   });

// Allow users to add a movie to their list of favorites
app.post('/movies/:users/:favorites', (req, res) => {
  res.send('Successful POST request to add a movie to the users list of favorites');
 });

// Allow users to remove a movie from their list of favorites
app.delete('/movies/:users/:favorites', (req, res) => {
  res.send('Successful DELETE request removing a movie from the list of favorites');
   });

// Allow existing users to deregister
app.delete('/movies/:users', (req, res) => {
  res.send('Successful DELETE users');
   });

// listen for requests
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});
