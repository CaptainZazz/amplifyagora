import React from "react";
import "./App.css";
import { Auth, Hub } from 'aws-amplify';
import { Authenticator, AmplifyTheme } from 'aws-amplify-react';

class App extends React.Component {
  state = {
    user: null
  };

  componentDidMount() {
    this.getUserData();
    Hub.listen('auth', this, 'onHubCapsule');
  }

  async getUserData() {
    try {
      const result = await Auth.currentAuthenticatedUser();
      console.info('App.getUserData', result);
      this.setState({ user: result || null });
    } catch (e) {
      console.warn('App.getUserData', e);
      this.setState({ user: null });
    }
  }

  onHubCapsule(capsule) {
    console.info('App.onHubCapsule', capsule);
    switch(capsule.payload.event) {
      case 'signIn': 
        this.getUserData();
        break;
        case 'signUp': 
          break;
        case 'signOut': 
          this.setState({ user: null });
          break;
      default:
        console.warn('App.onHubCapsule', 'No handled case for', capsule.payload.event);
        return;
    }
  }

  render() {
    const { user } =  this.state;
    if (!user) {
      return <Authenticator {...{theme}} />;
    }
    return <div>App</div>;
  }
}

const theme = {
  ...AmplifyTheme,
  button: {
    ...AmplifyTheme.button,
    backgroundColor: '#f90'
  },
  sectionHeader: {
    ...AmplifyTheme.sectionHeader,
    backgroundColor: "var(--squidInk)"
  },
  navBar: {
    ...AmplifyTheme.navBar,
    backgroundColor: "#ffc0cb"
  }
}

export default App;
