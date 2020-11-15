import React from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import PropTypes from 'prop-types';

import { MovieCard } from '../movie-card/movie-card';
import { MovieView } from '../movie-view/movie-view';
import { LoginView } from '../login-view/login-view';
import { RegistrationView } from '../registration-view/registration-view';
import { DirectorView } from '../director-view/director-view';
import { GenreView } from '../genre-view/genre-view';
import { ProfileView } from '../profile-view/profile-view';
import { Link } from 'react-router-dom';

import Container from 'react-bootstrap/Container';
import { Navbar, Nav, Row, Col } from 'react-bootstrap';
import Button from 'react-bootstrap/esm/Button';

import './main-view.scss';

export class MainView extends React.Component {

  constructor() {
    super();

    this.state = {
      user: null,
      movies: [],
      selectedMovie: []
    };
  }

  getMovies(token) {
    axios.get('https://my-flix-berlin.herokuapp.com/movies', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        // Assign the result to the state
        this.setState({
          movies: response.data
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  /* Asked to remove in task 3.5
  // One of the "hooks available in a React Component
  componentDidMount() {
    axios.get('https://my-flix-berlin.herokuapp.com/movies')
      .then(response => {
        //Assign the result to the state
        this.setState({
          movies: response.data
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }*/

  componentDidMount() {
    let accessToken = localStorage.getItem('token');
    if (accessToken !== null) {
      this.setState({
        user: localStorage.getItem('user')
      });
      this.getMovies(accessToken);
    }
  }

  onLoggedIn(authData) {
    console.log(authData);
    this.setState({
      user: authData.user.Username
    });

    localStorage.setItem('token', authData.token);
    localStorage.setItem('user', authData.user.Username);
    this.getMovies(authData.token);
  }

  onLoggedOut() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.setState({
      user: null,
    });
    window.open('/', '_self');
  }

  /* Asked to remove it task 3.5
    onMovieClick(movie) {
    this.setState({
      selectedMovie: movie
    });
  }*/

  // This overrides the render () method of the superclass
  // No need to call super() though, as it does nothing by default
  render() {
    const { user, movies, selectedMovie } = this.state;

    // Before the movies have been loaded
    if (!movies) return <div className='main-view' />;
    //console.log(user)
    return (
      <Router>
        <Container>
          <div className='main-view'>

            <Navbar className="fixed-top" bg="dark" variant="dark">
              <Navbar.Brand href="#home">Navbar</Navbar.Brand>
              <Nav className="mr-auto">
                <Nav.Link as={Link} to='/'>
                  Home
                </Nav.Link>

                <Nav.Link as={Link} to={`/user/${user}`}>
                  Profile
                </Nav.Link>

                <Nav.Link as={Link} to='/register'>
                  Sign Up
                </Nav.Link>

                <Button className="button-secondary" onClick={() => this.onLoggedOut()}>
                  Logout
                </Button>

                {/*<Nav.Link as={Link} to='/login'>
                 Login
                </Nav.Link>*/}

              </Nav>
            </Navbar>
            <br />
            <br />
            <br />

            <Route exact path='/' render={() => {
              if (!user) return <LoginView onLoggedIn={user => this.onLoggedIn(user)} />;
              return movies.map(m => <MovieCard key={m._id} movie={m} />);
            }
            } />

            <Route path='/register' render={() => <RegistrationView />} />

            <Route path='/movies/:movieId' render={({ match }) =>
              <MovieView movie={movies.find(m => m._id === match.params.movieId)} />} />;

            <Route path='/directors/:name' render={({ match }) => {
              if (!movies) return <div className='main-view' />;
              return <DirectorView director={movies.find(m => m.Director.Name === match.params.name).Director} />
            }} />

            <Route path="/movies/genres/:name" render={({ match }) => {
              if (!movies) return <div className="main-view" />;
              return (
                <GenreView
                  genre={
                    movies.find((m) => m.Genre.Name === match.params.name).Genre
                  }
                />
              );
            }} />

            <Route exact path="/user" render={() => <ProfileView movies={movies} />} />
          </div>
        </Container>
      </Router>
    );
  }
}

/*asked to remove in task 3.5
MainView.propTypes = {
  movie: PropTypes.shape({
    Title: PropTypes.string,
    Description: PropTypes.string
  }),
  user: PropTypes.shape({
    Username: PropTypes.string,
  })
}; */