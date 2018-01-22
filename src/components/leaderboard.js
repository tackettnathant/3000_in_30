import React, { Component } from 'react';
import * as firebase from 'firebase';
import StepChallenge from '../stepchallenge';
import Navbar from './navbar';
import Header from './header';
import '../css/spectre.min.css';
import '../layout.css';
import './leaderboard.css';


class Leaderboard extends Component {
    constructor(props){
        super(props);
        if (firebase.apps.length===0) {
            firebase.initializeApp(StepChallenge.config);
        }
        this.state = {
            settings:{
                stepsPerPack:60000,
                totalPacks:350
            },
            leaders:[],
            userDetails:{}
        }
    }
	componentDidMount(){

        const userRef=firebase.database().ref().child('users');
        userRef.on("value",function(snap) {
            const obj = snap.val();

            const users = Object.keys(obj).map(function(key){
                return obj[key];
            });


            const userDetails = users.reduce(function(all,user){
                all[user.email]=user;
                return all;
            },{});

            this.setState({
                userDetails:userDetails
            })
            const stepRef=firebase.database().ref().child('steps');
            stepRef.on("value",function(snap){
                const obj = snap.val();
                if (!obj){
                    this.setState({
                        leaders:[]
                    });
                    return;
                }
                const steps = Object.keys(obj).map(function(key){
                    return obj[key];
                })

                const totalSteps = steps.reduce(function(all,val){
                    if (!all.hasOwnProperty(val.email)){
                        all[val.email]=0;
                    }
                    all[val.email]+=parseInt(val.steps,10);
                    return all;
                },{});


                let leaders = Object.keys(totalSteps).map(function(key){
                    return {email:key,
                        formattedSteps:totalSteps[key].toLocaleString(),
                        steps:totalSteps[key],
                        name:userDetails[key]?userDetails[key].name:key
                    };
                })

                leaders.sort(function(a,b){
                    var nameA = a.name.toUpperCase(); // ignore upper and lowercase
                    var nameB = b.name.toUpperCase(); // ignore upper and lowercase
                    if (nameA < nameB) {
                      return -1;
                    }
                    if (nameA > nameB) {
                      return 1;
                    }

                    // names must be equal
                    return 0;
                })

                for (let i=0;i<leaders.length;i++){
                    leaders[i].rank=(i+1);
                }
                this.setState({
                    leaders:leaders
                });

            }.bind(this));
        }.bind(this));



    }

    daysSince( date) {   //Get 1 day in milliseconds
        var one_day=1000*60*60*24;
        var firstDate=new Date(2018,0,17);    // Convert both dates to milliseconds
        var date1_ms = firstDate.getTime();
        var date2_ms = date.getTime();    // Calculate the difference in milliseconds
        var difference_ms = date2_ms - date1_ms;        // Convert back to days and return
        return Math.round(difference_ms/one_day);
    }
	render() {

        return (
            <div className="container">
                <Header/>
                <Navbar active={"/everyone"}/>
                <div className="columns">
                    <div className="column col-12 text-center" >
                    <h4>ALL THE PUSHUPS!</h4>
                    </div>
                </div>
                <div className="columns">
                <div className="column col-12 text-center" >
                    <table className="table table-striped" >
                        <thead>
                            <tr><td>Name</td><td>Push-ups</td></tr>
                        </thead>
                        <tbody>
                            {
                                this.state.leaders.map((l)=><tr><td>{l.name}</td><td>{l.formattedSteps}</td></tr>)
                            }
                        </tbody>
                    </table>

                </div>
            </div>

            </div>
        );
    }
}


export default Leaderboard;
