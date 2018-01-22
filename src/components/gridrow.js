import React, { Component } from 'react';
import GridCell from './gridcell';
class GridRow extends Component {
    constructor(props){
        super(props);

        this.state = {
            days:props.days
        }
    }
    render(){
        return (
            <div className="columns">

                {
                this.state.days.map(
                    (day)=>
                    <GridCell day={day}/>

                )
            }

            </div>
        )
    }

}
export default GridRow
