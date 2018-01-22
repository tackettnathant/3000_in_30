import React, { Component } from 'react';
import * as firebase from 'firebase';
import StepChallenge from '../stepchallenge';
import Navbar from './navbar';
import Header from './header';
import GridRow from './gridrow';
import '../css/spectre.min.css';
import '../layout.css';
import './dashboard.css';

class Dashboard extends Component {
    constructor(props){
        super(props);
        if (firebase.apps.length===0) {
            firebase.initializeApp(StepChallenge.config);
        }

        this.state = {
            steps:"",
            dates:this.allDates(),
            add_pushups:"",
            enter_date:this.shortDate(new Date()),
            totalSteps:0,
            packs:[],
            settings:{
                stepsPerPack:60000,
                totalPacks:350
            },
            stepHistory:[]
        }
    }

    formatDates(d){
        if (!d){
            d=new Date();
        }
        return d.getFullYear()+"-"+("0"+(d.getMonth()+1)).slice(-2)+"-"+("0"+d.getDate()).slice(-2);

    }

    formatDate(date){
        return date.substr(4,2)+"/"+date.substr(6.2);
    }

    allDates() {
        let year = 2018;
        let month = 0;
        let day = 17;

        var dates = [];
        for (let i=0;i<30;i++) {
        	let next=new Date(year,month,day+i);
            dates.push({date:this.shortDate(next),pushups:0});
        }
        return dates;
    }

    shortDate(date) {
    	var year = date.getFullYear();
      var month = date.getMonth()+1;
      var day = date.getDate();

      return ""+year+(month>10?month:"0"+month) + (day>10?day:"0"+day);
    }
    getDates(){
        var dates=[];
        for (var i=3;i<31;i++){
            var d=new Date(2017,3,i);
            dates.push(d);
        }
        return dates;
    }


    updateSteps(e){
        this.setState({
            add_pushups:e.target.value?e.target.value.replace(/[^\d,]/g,''):null
        })
    }
    updateDate(e){
        this.setState({
            enter_date:e.target.value
        })
    }

    componentDidMount(){
        const settingsRef=firebase.database().ref().child('settings');
        settingsRef.on('value',snap=>{
            if (snap.val()) {
                this.setState({
                    settings: snap.val()
                })
            }
        });

        this.retrieveData();
    }

    retrieveData() {
        const stepRef=firebase.database().ref().child('steps');
//
        stepRef.orderByChild("email").equalTo(firebase.auth().currentUser.email).on("value",function(snap){
            const obj = snap.val();

            if (!obj){
                this.setState({
                    totalSteps:0
                });
                return;
            }
            const steps = Object.keys(obj).map(function(key){
                return obj[key];
            })

            const totalSteps = steps.reduce(function(acc,val){
                return acc+parseInt(val.steps,10);
            },0);

            let recordsByDay=[];
            steps.forEach((d)=>{
                if (!recordsByDay[d.date]) {
                    recordsByDay[d.date]=0;
                }
                recordsByDay[d.date]+=parseInt(d.steps,10);
            });

            const updatedDays = this.state.dates.map((d)=>{
                if (recordsByDay[d.date]) {
                    d.pushups=recordsByDay[d.date];
                }
                return d;
            })

            this.setState({
                totalSteps:totalSteps,
                dates:updatedDays
            });

        }.bind(this));
    }
    showHistory(){
    	document.getElementById("history").className+=" active ";

    }
    hideHistory(){
    	document.getElementById("history").className=document.getElementById("history").className.replace(/active/,"");
    }

    recordPushups() {
        if (!this.state.add_pushups) {
            this.hideHistory();
            return;
        }
        const stepRef=firebase.database().ref().child('steps');
        stepRef.push({
            email:firebase.auth().currentUser.email,
            steps:this.state.add_pushups.replace(/[^\d-]/,""),
            date:this.state.enter_date
        },function(error){
            if (error){
                alert("oh snap");
                //todo
            } else {
                this.setState({
                    add_pushups:""
                })
                this.hideHistory();
                document.getElementById("totalSteps").className+=" notify ";
                setTimeout(function(){
                    document.getElementById("totalSteps").className=document.getElementById("totalSteps").className.replace(/notify/,'');
                },1000)
            }
        }.bind(this))
    }






    render() {
        var chunkSize=5;
        var groups = [], i;
        for (i = 0; i < this.state.dates.length; i += chunkSize) {
            groups.push(this.state.dates.slice(i, i + chunkSize));
        }
    	return (
            <div className="container">
                <Header/>
                <Navbar active={"/dashboard"}/>


                <div className="columns" onClick={this.showHistory.bind(this)}>
                    <div className="column col-12 text-center total-steps" >
                        <h5>Total Pushups</h5>
                        <h1 className="" id="totalSteps">{this.state.totalSteps.toLocaleString()}</h1>

                    </div>
                </div>
                <GridRow days={this.state.dates}/>

                <div className="modal" id="history">
                <div className="modal-overlay"></div>
                <div className="modal-container">
                  <div className="modal-header text-center">
                    <button className="btn btn-clear float-right" onClick={this.hideHistory.bind(this)}></button>
                    <div className="modal-title"><h3>Record Pushups</h3></div>
                  </div>
                  <div className="modal-body">
                    <div className="content">
                    <div className="columns">
      				<div className="column col-3"></div>
      				<div className="column col-6 text-center" >
                            <select value={this.state.enter_date} className="date-select" onChange={this.updateDate.bind(this)}>
                                {
                                    this.state.dates.map((d)=><option value={d.date}>{this.formatDate(d.date)}</option>)
                                }
                            </select>
      				</div>
      				<div className="column col-3"></div>
      			    </div>
                    <div className="columns">
      				<div className="column col-3"></div>
      				<div className="column col-6 text-center" >
                            <input className="form-input input-lg input-min" value={this.state.add_pushups} onChange={this.updateSteps.bind(this)}/>
                             <button className={"btn btn-lg btn-primary "+(!this.state.add_pushups?"disabled":"")} onClick={this.recordPushups.bind(this)}>Save</button>
      				</div>
      				<div className="column col-3"></div>
      			    </div>
                    </div>
                  </div>
                </div>
              </div>

                <div className="columns">
                    <div className="column col-12 text-center" >
                        <div onClick={StepChallenge.logout} className="logout">Logout</div>
                    </div>
                </div>
                </div>

        );
    }
}


export default Dashboard;
