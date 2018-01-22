import React, { Component } from 'react';
import Navbutton from './navbutton';
class Navbar extends Component {
    render() {
        return (
                <div className="columns">
                <Navbutton route={"/"} text={"Home"} active={this.props.active} />
                <Navbutton route={"/dashboard"} text={"Record Pushups"} active={this.props.active} />
                <Navbutton route={"/everyone"} text={"Everyone"} active={this.props.active}/>
                </div>

        		)
    }
}

export default Navbar;
