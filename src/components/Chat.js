import React from 'react';
import { Link } from 'react-router';
import Log from './Log';
import Word from './Word';
import Message from './Message';
import {Grid, Row, Column} from 'react-cellblock';
import 'whatwg-fetch'


export default class Chat extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      input: '',
      messages: []
    };
  }

  handleClick(){
    //i want to post to database when clicked
    fetch('http://127.0.0.1:3000/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'bob',
        msgtext: this.state.input,
      })
    })
    .then(function(resp){
      console.log("post success")
    })
    .catch(function(err){
      console.log("error handlclick post", err)
    })

    this.renderMessages.bind(this)();
  }

  handleChange(e){
    this.setState({input: e.target.value})
  }

  renderMessages(){
    fetch('http://127.0.0.1:3000/messages')
    .then(resp => {
      return resp.json()
    })
    .then(json => {     
      this.setState({messages: json})
    })
  }

  render() {
    var style = {
      border: 'solid #777',
      padding: '3px 3px',
      'background-color': 'rgba(144, 148, 156, 0.28)'
    }

    return(
      <Grid>
        <Column width="3/5">
          Search Results!
        </Column>
        <Column width="2/5">
          <h4>Chat</h4>
            <input type="text" name="message" id="message" onChange={this.handleChange.bind(this)}/>
            <button value="submit" onClick={this.handleClick.bind(this)}>Submit</button>
          <div id="chats" style={style}>
            {this.state.messages.map((message, i) => {
              return <Message message={message} key={i}/>;
            })}
          </div>
        </Column>
      </Grid>
    );
  }
}