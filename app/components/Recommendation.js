import React from 'react'
import { connect } from 'react-redux';
import Login from './Login';
import Items from './Items';

//import Suggestions from './Suggestions;
//<Suggestions />

class Recommendation extends React.Component {
    constructor(props) {
      super(props);
    }

    render () {
      return (
        <section>
          <Login />




          <Items />
        </section>
      )
    }
}

const styles={}

const mapStateToProps = ({ user }) => ({ user });
export default connect(mapStateToProps, null) (Recommendation);