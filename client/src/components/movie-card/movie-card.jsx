
import React from 'react';
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import PropTypes from 'prop-types';

export class MovieCard extends React.Component {
  render() {
    // This is given to the <MovieCard/> component by the outer world
    // which, in this case, is `MainView`, as `MainView` is what’s
    // connected to your database via the movies endpoint of your API
    const { movie, onClick } = this.props;

    return (
      <Card style={{ width: '18rem' }}>
        <Card.Img variant="top" src="holder.js/100px180" />
        <Card.Body>
          <Card.Title>{movie.Title}</Card.Title>
          <Card.Text>
            {movie.Description}
          </Card.Text>
          <Button variant="primary" onClick={() => onClick(movie)} >show details</Button>
        </Card.Body>
      </Card>
    );
  }
}

MovieCard.propTypes = {
  movie: PropTypes.shape({
    Title: PropTypes.string,
    Description: PropTypes.string
  }).isRequired,
  onClick: PropTypes.func.isRequired
};