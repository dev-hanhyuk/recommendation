import React from 'react';
import { connect } from 'react-redux';
import { userLogin } from '_actions/login';


class Login extends React.Component {
    constructor(props) {
      super(props);
      this.state = { email: '', password: '' };
    }

    handleChangeEmail = (e) => {
      e.preventDefault();
      this.setState({ email: e.target.value });
    }

    handleChangePassword = (e) => {
      e.preventDefault();
      this.setState({ password: e.target.value });
    }

    handleSubmit = (e) => {
      e.preventDefault();
      this.props.userLogin(this.state.email, this.state.password);
    }

    generateForm = () => {
      return (
        <form onSubmit={this.handleSubmit}>
          <input placeholder='email' type='text' onChange={this.handleChangeEmail}/>
          <input placeholder='password' type='password' onChange={this.handleChangePassword}/>
          <button type='submit'>Login</button>
        </form>
      )
    }

    render () {
      const { user } = this.props;
      return (
        <section>
          { user.id && user ? <h1>welcome, {user.email}!</h1> : this.generateForm()}
        </section>
      )
    }
}

const styles={}

const mapStateToProps = ({ user }) => ({ user });
export default connect(mapStateToProps, { userLogin })(Login);