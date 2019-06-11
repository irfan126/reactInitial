import React from 'react';
import LoginForm from './LoginForm';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import * as actions from 'actions';

class Login extends React.Component {

  constructor() {
    super();

    this.state = {
      displayAcitvationLink: false
    }

    this.loginUser = this.loginUser.bind(this);
  }

  loginUser(userData) {
    this.props.dispatch(actions.login(userData));
  }

  render() {
    const { isAuth, errors} = this.props.auth;
    const { successRegister } = this.props.location.state || false;
    const { activeAccount } = this.props.location.state || false;
    const { successPasswordReset } = this.props.location.state || false;


    if (isAuth) {
      return <Redirect to={{pathname: '/rentals'}} />
    }

    return (
      <section id="login">
        <div className="bwm-form">
          <div className="row">
            <div className="col-md-5">
              <h1>Login</h1>
              {
                successRegister &&
                  <div className='alert alert-success'>
                    <p> To complete registration, please follow the activation link sent to your email address.  </p>
                  </div>
              }
              {
                activeAccount &&
                  <div className='alert alert-success'>
                    <p> Registration complete, please login with your credentials.  </p>
                  </div>
              }
              {
                successPasswordReset &&
                  <div className='alert alert-success'>
                    <p> Please follow the link sent to your email address to reset your password! </p>
                  </div>
              }
              <LoginForm submitCb={this.loginUser} errors={errors}/>
              <Link className='btn btn-warning mv3' to={{pathname: `/passwordreset`}}> Reset my password! </Link>
            </div>
            <div className="col-md-6 ml-auto">
              <div className="image-container">
                <h2 className="catchphrase">Awesome beginners courses in reach of few clicks.</h2>
                <img src={process.env.PUBLIC_URL + '/img/login-image.jpg'} alt=""/>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }
}

function mapStateToProps(state) {
  return {
    auth: state.auth
  }
}

export default connect(mapStateToProps)(Login)


