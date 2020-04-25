import React from "react";
import "./App.css";
import { withAuthenticator, AmplifyTheme } from 'aws-amplify-react';

class App extends React.Component {
  state = {};

  render() {
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

export default withAuthenticator(App, true, [], null, theme);
