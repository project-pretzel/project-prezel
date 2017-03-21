import React from 'react';
import { Link } from 'react-router';
import Log from './Log';
import Word from './Word';
import Message from './Message';
import {Grid, Row, Column} from 'react-cellblock';
import 'whatwg-fetch';
import $ from 'jquery';


export default class Chat extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      input: '',
      messages: [],
      results: []
    };
  }

  findPath(ugly){
    var uglyArr = ugly.split('/');
    return uglyArr[uglyArr.length - 1]
  }

  handleClick(){
    var jwt = localStorage.getItem("jwt");
    var username = 'Anonymous';
    //auth token should be saved as a JSON string, but just in case
    try {
      var googleToken = JSON.parse(jwt); //pass the googleToken to the log component to parse
    } catch(e) {
      alert(e); // error in the above string (in this case, yes)!
    }

    this.state = {
      loggedIn: false
    };

    if(googleToken) {
      username = googleToken.data.given_name;
    }


    //i want to post to database when clicked
    fetch('http://127.0.0.1:3000/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        maintitle: this.findPath(this.props.location.pathname),
        username: username,
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

  renderSearch(){
    fetch('http://127.0.0.1:3000/rss')
    .then(res => {
      console.log('this is the res line 85', res)
      return res.body;
    })
    .then(json => {
      this.setState({results: json})
    })
    .catch(error => {
      console.error(error);
    })
    console.log('chat.js line 94')
    this.renderSearch.bind(this)();
  };

  render() {
    var style = {
      border: 'solid #777',
      padding: '3px 3px',
      'background-color': 'rgba(144, 148, 156, 0.28)'
    }
    //this.renderSearch();
    return(
      <Grid>
        <Column width="3/5">
          <h4>RSS feed</h4>
          <div id="results" style={style} onLoad={this.renderSearch.call(this)}>
            {this.state.results.forEach((result, i) => {
              return <Result result={result} key={i}/>;
            })}
          </div>
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
