import React, { Component } from 'react';
import {Link} from "react-router-dom"
import "./navbutton.css"
class Navbutton extends Component {

	render() {
        return (
                <div className={"column col-4 text-center navbar centered "+(this.props.active===this.props.route?"active":"")} >
                <Link to={this.props.route}>{this.props.text}</Link>
                </div>
        		)
    }
}

export default Navbutton;
