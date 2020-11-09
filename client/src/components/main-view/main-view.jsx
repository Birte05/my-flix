import React from 'react';
import axios from 'axios';
import { LoginView } from "../login-view/login-view";
import { RegistrationView } from "../registration-view/registration-view";
import { MovieCard } from '../movie-card/movie-card';
import { MovieView } from '../movie-view/movie-view';
import { Button } from "react-bootstrap";
import PropTypes from 'prop-types';

export class MainView extends React.Component {

  constructor() {
    super();

    this.state = {
      user: null,
      movie: null,
      selectedMovie: null
    };
  }

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
  }

  /* Task 3.5
  componentDidMount() {
    let accessToken = localStorage.getItem('token');
    if (accessToken !== null) {
      this.setState({
        user: localStorage.getItem('user')
      });
      this.getMovies(accessToken);
    }
  } */

  // creates a new getMovies method 
  /* getMovies(token) {
  axios.get('https://my-flix-berlin.herokuapp.com/movies', {
    headers: { Authorization: `Bearer ${token}`}
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

  /* Part of task 3.5
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
  }*/

  onMovieClick(movie) {
    this.setState({
      selectedMovie: movie
    });
  }

  // This overrides the render () method of the superclass
  // NO need to call super() though, as it does nothing by default
  render() {
    // If the state isn't initialized, this will throw on runtime
    // before the data is initially loaded
    const { user, movies, selectedMovie } = this.state;
    // Add registration view to login page using react router
    if (!user) return <LoginView onLoggedIn={user => this.onLoggedIn(user)} />;

    // Before the movies have been loaded
    if (!movies) return <div className="main-view" />;

    return (
      <div className="main-view">
        {selectedMovie
          ? <MovieView movie={selectedMovie} />
          : movies.map(movie => (
            <MovieCard key={movie._id} movie={movie} onClick={movie => this.onMovieClick(movie)} />
          ))
        }
      </div>
    );
  }
}

MainView.propTypes = {
  movie: PropTypes.shape({
    Title: PropTypes.string,
    Description: PropTypes.string
  }),
  user: PropTypes.shape({
    Username: PropTypes.string,
  })
};