import React, { useState } from 'react';
import {
  Button,
  Form,
} from 'react-bootstrap';

import axios from 'axios';
import './login-view.scss';


export const LoginView = (props) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');


  const handleSubmit = () => {
    // e.preventDefault();
    console.log(username, password)

    /* Send a request to the server for authentication */
    axios.post('https://my-flix-berlin.herokuapp.com/login', {
      Username: username,
      Password: password
    })
      .then(response => {
        const data = response.data;
        props.onLoggedIn(data);
      })
      .catch(e => {
        console.log(e)
        console.log('no such user')
      });
  }

  return (
    <Form>
      <Form.Group>
        <Form.Label>Username:</Form.Label>
        <Form.Control type="text" placeholder="Enter username" value={username} onChange={e => setUsername(e.target.value)} />
      </Form.Group>

      <Form.Group>
        <Form.Label>Password:</Form.Label>
        <Form.Control type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      </Form.Group>
      <Button variant="primary" onClick={handleSubmit}>
        Submit
        </Button>
    </Form>
  )
}