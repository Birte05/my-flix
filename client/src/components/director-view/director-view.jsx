import React from 'react';

import {
  Card,
  Container,
} from 'react-bootstrap';

import { Link } from 'react-router-dom';

export class DirectorView extends React.Component {
  constructor() {
    super();

    this.state = {};
  }

  render() {
    const { movies, director } = this.props;

    if (!director) return null;

    return (
      <div className="director-view">
        <Container>
          <Card style={{ width: '25rem' }}>
            <Card.Body>
              <Card.Title>{director.Name}</Card.Title>
              <Card.Text>Director Bio: {director.Bio}</Card.Text>
              <Card.Text>Birth Year: {director.Birth}</Card.Text>
              <Card.Text>Death Year: {director.Death}</Card.Text>
              <Link to={`/`}>
                Back
              </Link>
            </Card.Body>
          </Card>
        </Container>
      </div>
    );
  }
}