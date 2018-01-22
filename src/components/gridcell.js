import React, { Component } from 'react';
import * as firebase from 'firebase';
import StepChallenge from '../stepchallenge';
import './grid-cell.css';
class GridCell extends Component {
    constructor(props){
        super(props);
        if (firebase.apps.length===0) {
            firebase.initializeApp(StepChallenge.config);
        }
        this.state = {
            day:props.day,
            inputMode:false,
            add_pushups:""
        }
    }

    recordPushups() {
        this.setState({inputMode:false});
        if (!this.state.add_pushups) {
            return;
        }
        const stepRef=firebase.database().ref().child('steps');
        stepRef.push({
            email:firebase.auth().currentUser.email,
            steps:this.state.add_pushups.replace(/[^\d-]/,""),
            date:this.state.day.date.replace(/-/g,"")
        },function(error){
            if (error){
                alert("oh snap");
                //todo
            } else {
                this.setState({
                    add_pushups:""
                })
                document.getElementById("totalSteps").className+=" notify ";
                setTimeout(function(){
                    document.getElementById("totalSteps").className=document.getElementById("totalSteps").className.replace(/notify/,'');
                },1000)
            }
        }.bind(this))
    }
    updatePushups(e){
        this.setState({
            add_pushups:e.target.value?e.target.value.replace(/[^\d,-]/g,''):""
        })
    }
    formatDate(date){
        return date.substr(4,2)+"/"+date.substr(6.2);
    }
    render(){
        return (


                <div className="column col-2 grid-cell nopadding">{this.formatDate(this.state.day.date)}
                {
                    (this.state.inputMode)?
                    <div>
                    <input value={this.state.add_pushups} onChange={this.updatePushups.bind(this)}/><br/>
                    <img alt="add" src={require('./add.png')} className="add" onClick={this.recordPushups.bind(this)}/>
                    </div>
                    :""
                }
                {
                    (!this.state.inputMode)?
                    <div  onClick={()=>{this.setState({inputMode:true});}}>
                        <img alt="day" src={require('./pushup_small.png')} className={(this.state.day.pushups>=100?"done":"not-done")+" smallpushup"}/>
                        <br/>
                    {this.state.day.pushups}
                    </div>
                    :""

                }
                </div>



        )
    }

}
export default GridCell
