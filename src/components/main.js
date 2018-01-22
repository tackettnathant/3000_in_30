import React, { Component } from 'react';
import StepChallenge from '../stepchallenge';
import * as firebase from 'firebase';
import Header from './header';
import './../css/spectre.min.css';
import '../layout.css';
import './main.css';

/*
TODO:
1. Retrieve user
2. Hide the "touch backpack" if steps>0
5. Add Link to record route

 */
class Main extends Component {
    constructor(props){
        super(props);
        if (firebase.apps.length===0) {
            firebase.initializeApp(StepChallenge.config);
        }

        this.state = {
            totalSteps:0,
            packs:null,
            settings:{
                stepsPerPack:1,
                totalPacks:3000
            },
            newUser:true,
            loading:true
        }
    }
    getCssValuePrefix()
    {
        var rtrnVal = '';//default to standard syntax
        var prefixes = ['-o-', '-ms-', '-moz-', '-webkit-'];

        // Create a temporary DOM object for testing
        var dom = document.createElement('div');

        for (var i = 0; i < prefixes.length; i++)
        {
            // Attempt to set the style
            dom.style.background = prefixes[i] + 'linear-gradient(#000000, #ffffff)';

            // Detect if the style was successfully set
            if (dom.style.background)
            {
                rtrnVal = prefixes[i];
            }
        }

        dom = null;
        return rtrnVal;
    }
    fillPack(level){
        if (document.getElementById('main_pack')) {
            var orientation = "90deg";
            var colorOne = "#FFFF00  " + level + "%";
            var colorTwo = "#E8F1F9 " + level + "%";
            document.getElementById('main_pack').style.backgroundImage = this.getCssValuePrefix() + 'linear-gradient(' + orientation + ', ' + colorOne + ', ' + colorTwo + ')';
        }
    }

    retrieveData(email) {
        //
                const stepRef=firebase.database().ref().child('steps');
                stepRef.orderByChild("email").equalTo(email).on("value",function(snap){
                    const obj = snap.val();
                    this.setState({
                        loading:false
                    });
                    if (!obj){
                        return;
                    }
                    const steps = Object.keys(obj).map(function(key){
                        return obj[key];
                    })

                    const totalSteps = steps.reduce(function(total,val){
                        total+=parseInt(val.steps,10);
                        return total;
                    },0);

                    this.setState({
                        totalSteps:totalSteps
                    })

                }.bind(this));
    }

    componentDidMount(){
        this.setState({
            loading:true
        });

        firebase.auth().onAuthStateChanged(user => {
            if (user){
                StepChallenge.isAuthenticated=true;
                this.retrieveData(firebase.auth().currentUser.email);
            }
        });




    }


    componentDidUpdate(){
        const pct = parseInt((this.state.totalSteps/this.state.settings.totalPacks)*100,10);
        this.fillPack(pct);
    }
    render() {
        return (
            <div className="container">

                <Header/>
                <div className="columns">
                    <div className="column col-12 text-center details">
                    {
                        (StepChallenge.isAuthenticated?
                        (this.state.loading?
                                    <div className="loading "></div>
                                    :
                                    (
                                        this.state.totalSteps>0?
                                            <h4>{this.state.totalSteps} of {this.state.settings.totalPacks} Pushups Complete</h4>
                                            :
                                            <h4>Record your pushups!</h4>
                                    )
                        ):""
                    )
                    }



                    </div>
                </div>
                {
                    (true && StepChallenge.isAuthenticated?
                        <div className="columns ">
                            <div className="column col-12 text-center">
                                <span className="tiny">touch the image to record pushups</span>
                            </div>
                        </div>
                        :"")
                }
                <div className="columns big-pack-row">
                    <div className="column col-1"></div>
                        <div className="column col-10 centered mainPack" id="main_pack">
                            <img alt="main_image" className="centered img-responsive mainPack" src={require('./pushup.png')} onClick={()=>this.props.history.push('/dashboard')}/>
                        </div>

                    <div className="column col-1"></div>
                </div>

            </div>
        );
    }
}

export default Main;
