import React from 'react';
import GoogleLogin from 'react-google-login';
import axios from 'axios';

export default class Log extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false
    };

    if(props.googleToken) {
      this.state = {
        gid: props.googleToken.data.sub,
        email: props.googleToken.data.email,
        givenName: props.googleToken.data.given_name,
        familyName: props.googleToken.data.family_name,
        imageUrl: props.googleToken.data.picture,
        loggedIn: true 
      };
    }
    // This binding is necessary to make `this` work in the callback
  }

  responseGoogle(response){
    this.setState({
      gid: response.profileObj.googleId,
      email: response.profileObj.email,
      givenName: response.profileObj.givenName,
      familyName: response.profileObj.familyName,
      imageUrl: response.profileObj.imageUrl,
      loggedIn: true
      });

    console.log(response);
    axios.get(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${response.tokenId}`)
    .then((googleToken) => {
      var jwt = googleToken;
      this.loginUser(jwt);
      return googleToken;
    })
    .then((googleToken) => {
      console.log('Promises, promises', googleToken);
      axios.post('/users', JSON.stringify(googleToken));
    });
  }

  loginUser(jwt) {
    // We save the JWT in localStorage to keep the user authenticated. We’ll learn more about this later.
    localStorage.setItem("jwt", JSON.stringify(jwt));
    // Send the action to all stores through the Dispatcher
  }

  logoutUser() {
    localStorage.removeItem("jwt");
    this.setState({
      loggedIn: false
    });

  }

  render() {
    return (
      <div>
        <GoogleLogin
        clientId="791653946192-gial2vpbjr0pdtg6k90a9jrfja3c5mgl.apps.googleusercontent.com"
        buttonText={!(this.state.loggedIn) ? 'Login' : 'Hi, ' + this.state.givenName} 
        onSuccess={this.responseGoogle.bind(this)}
        onFailure={this.responseGoogle}
        />
        <div className='signout'> {this.state.loggedIn ? `Not ${this.state.givenName}?` : '' }</div>
        <a className='pseudolink signout' onClick={this.logoutUser.bind(this)}> {this.state.loggedIn ? `Click here to sign out.` : '' }</a>
      </div> 
    );
  }
}
