import React from "react";
import "./App.css";
import { Auth, Hub, API, graphqlOperation } from 'aws-amplify';
import { Authenticator, AmplifyTheme } from 'aws-amplify-react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import MarketPage from './pages/MarketPage';
import NavBar from './components/Navbar';
import {getUser} from './graphql/queries';

export const UserContext = React.createContext();

class App extends React.Component {
  state = {
    user: null
  };

  constructor() {
    super();
    console.info(this.constructor.name, 'Component', this);
  }

  componentDidMount() {
    this.getUserData();
    Hub.listen('auth', this, 'onHubCapsule');
  }

  async getUserData() {
    try {
      const cognitoUser = await Auth.currentAuthenticatedUser();
      console.info('App.getUserData cognitoUser', cognitoUser);
      this.setState({ user: cognitoUser || null });

      const user = await API.graphql(graphqlOperation(getUser, {
        id: cognitoUser.attributes.sub
      }));
      console.info('App.getUserData user', user); // TODO getUser to get users that don't exist in Dynamo yet

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

  handleSignout = async () => {
    try{
      await Auth.signOut();
    } catch(e) {
      console.error("Error signing out user", e);
    }
  }

  render() {
    const { user } =  this.state;
    if (!user) {
      return <Authenticator {...{theme}} />;
    }
    return (
      <UserContext.Provider value={{ user }}>
        <Router>
          <React.Fragment>

            {/* Navigation */}
            <NavBar user={user} handleSignout={this.handleSignout} />

            {/* Routes */}
            <div className="app-container">
              <Switch>
                <Route exact path="/" component={() => <HomePage user={user} />} />
                <Route path="/profile" component={ProfilePage} />
                <Route path="/markets/:marketId" component={({ match }) => <MarketPage user={user} marketId={match.params.marketId} />} />
                <Route component={(props) => (
                  <div>
                    <h3>Page not found</h3>
                    <pre>{JSON.stringify(props, null, '  ')}</pre>
                  </div>
                )} />
              </Switch>
            </div>

          </React.Fragment>
        </Router>
      </UserContext.Provider>
    );
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
