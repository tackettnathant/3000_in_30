import React from 'react';
import ReactDOM from 'react-dom';
import Main from './components/main';
import StepChallenge from './stepchallenge';
import Dashboard from './components/dashboard';
import Leaderboard from './components/leaderboard';
import * as firebase from 'firebase';

import './index.css';

import {BrowserRouter as Router, Route, Redirect} from 'react-router-dom';


const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (
    StepChallenge.isAuthenticated ? (
      <Component {...props}/>
    ) : (
      <Redirect to={{
        pathname: '/login',
        state: { from: props.location }
      }}/>
    )
  )}/>
)

class Login extends React.Component {
    constructor(props){
        super(props);
        if (firebase.apps.length===0) {
            firebase.initializeApp(StepChallenge.config);
        }
          this.state = {
            redirectToReferrer: false
          }
          var _this=this;
          firebase.auth().onAuthStateChanged(user => {
              if (user){
                  StepChallenge.isAuthenticated=true;
                  StepChallenge.isLoading=false;
                  _this.setState({redirectToReferrer:true});

                  const userRef=firebase.database().ref().child('users');
                  userRef.orderByChild("email").equalTo(user.email).on("value",function(snapshot){
                      var exists = (snapshot.val() !== null);
                      if (!exists){
                          userRef.push({email:user.email,name:user.displayName})
                      }
                  });


              }
          });
    }

  login = () => {
      StepChallenge.isLoading=true;
    StepChallenge.authenticate();
  }

  render() {

    return (
        <div>
        {
                (this.state.redirectToReferrer)?
<Redirect to="/dashboard"/>
                :
            <div className="column col-12 text-center">
{                (StepChallenge.isLoading)?
                <img alt="loading" className="centered img-responsive mainPack" src={require('./components/pushup.png')}/>
                :
                ""
            }
            </div>

        }
        </div>
    )
  }
}



ReactDOM.render(
  <Router>
  <div>
    <Route exact path="/" component={Main}></Route>
    <PrivateRoute path="/dashboard" component={Dashboard}></PrivateRoute>
    <Route path="/login" component={Login}/>
    <PrivateRoute path="/everyone" component={Leaderboard}></PrivateRoute>
</div>
  </Router>,
  document.getElementById('root')
);
