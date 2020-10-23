import React from 'react';
import axios from 'axios';

class MainView extends React.Component {
  constructor() {
    //Call the superclass constructor
    // so React can initialize it
    super();

    //Initialize the state to an empty object so we can destructure it later
    this.state = {};
  }

  // One of the "hooks available in a React Component
  componentDidMount() {
    axios.get('https://git.heroku.com/my-flix-berlin.git')
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
  // This overrides the render () method of the superclass
  // NO need to call super() though, as it does nothing by default
  render() {
    // If the state isn't initialized, this willthrow on runtime
    // before the data is initially loaded
    const { movies } = this.state;

    // Before the movies have been loaded
    if (!movies) return <div className="main-view" />;

    return (
      <div className="main-view">
        {movies.map(movie => (
          <MovieCard key={movie._id} movie={movie} />
        ))}
      </div>
    );
  }
}