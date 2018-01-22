import React, { Component } from 'react';
import '../css/spectre.min.css';
import '../layout.css';
import './header.css';
import * as firebase from 'firebase';
import StepChallenge from '../stepchallenge';
class Header extends Component {
    constructor(props){
        super(props);
        if (firebase.apps.length===0) {
            firebase.initializeApp(StepChallenge.config);
        }

        console.log(firebase.auth().currentUser);
        this.state = {
            user: firebase.auth().currentUser
        }
    }
    render(){
        return(
            <div className="columns">
                <div className="column col-12 text-center headerRow" >
                    {
                        (firebase.auth().currentUser && firebase.auth().currentUser.photoURL)?
                        <img src={firebase.auth().currentUser.photoURL} className="profile_pic" alt="profile_pic"/>
                        :
                        ""
                    }
                    <h5>3000 in 30 - All the pushups...</h5>
                </div>
            </div>
        );
    }
}
export default Header;
