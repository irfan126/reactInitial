import React from 'react';
import ResetPasswordForm from './ResetPasswordForm';
import PasswordResetForm from './PasswordResetForm';
import { Redirect } from 'react-router-dom';

import * as actions from 'actions';

export class ResetPassword extends React.Component {

  constructor() {
    super();

    this.state = {
      errors: [],
      redirect: false,
      tokenSuccess: false,
      responseToken:[]
    }


    this.userPasswordReset = this.userPasswordReset.bind(this);
       this.updatePassword = this.updatePassword.bind(this);
  }

  componentDidMount() {
    actions.resetPassword(this.props.match.params.token).then(
      passwordResetSuccess => this.setState({responseToken: passwordResetSuccess.resetPasswordToken, tokenSuccess: true}),
      errors => this.setState({errors, redirect: false})
    );

  }

  userPasswordReset(userData) {
    actions.passwordReset(userData).then(
      passwordResetSuccess => this.setState({redirect: true}),
      errors => this.setState({errors})
    );
  
  }

    updatePassword(userData) {
    actions.updatePassword(userData).then(
      passwordResetSuccess => this.setState({redirect: true}),
      errors => this.setState({errors})
    );
  
  }

  render() {
    const { errors, redirect, tokenSuccess, responseToken } = this.state;

    if (redirect) {
      return <Redirect to={{pathname: '/login', state: { successPasswordReset: true }}} />
    }

    return (
      <section id='passwordReset'>
        <div className='bwm-form'>
          <div className='row'>
          {tokenSuccess &&
            <div className='col-md-5'>
              <h1>Update your password </h1>
              <p>Please enter a new password!</p>
              <ResetPasswordForm submitCb={this.updatePassword} errors={errors} initialValues={{resetPasswordToken: responseToken}}/>
            </div>
          }
          {!tokenSuccess &&
            <div className='col-md-5'>
              <h1>Reset your password</h1>

              <p>Please enter the Email address you registered with!</p>
              <PasswordResetForm submitCb={this.userPasswordReset} errors={errors} />
            </div>
          }
            <div className='col-md-6 ml-auto'>
              <div className='image-container'>
                <h2 className='catchphrase'>As our member you have access to most awesome places in the world.</h2>
                <img src={process.env.PUBLIC_URL + '/img/register-image.jpg'} alt=""/>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }
}