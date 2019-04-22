import React from 'react';
import PasswordResetForm from './PasswordResetForm';
import { Redirect } from 'react-router-dom';

import * as actions from 'actions';

export class PasswordReset extends React.Component {

  constructor() {
    super();

    this.state = {
      errors: [],
      redirect: false
    }

    this.userPasswordReset = this.userPasswordReset.bind(this);
  }

  userPasswordReset(userData) {
    actions.passwordReset(userData).then(
      passwordResetSuccess => this.setState({redirect: true}),
      errors => this.setState({errors})
    );
  }

  render() {
    const { errors } = this.state || this.props.location.state;
    const { redirect } = this.state;

    if (redirect) {
      return <Redirect to={{pathname: '/login', state: { successPasswordReset: true }}} />
    }

    return (
      <section id='passwordReset'>
        <div className='bwm-form'>
          <div className='row'>
            <div className='col-md-5'>
              <h1>Reset your password</h1>

              <p>Please enter the Email address you registered with!</p>
              <PasswordResetForm submitCb={this.userPasswordReset} errors={errors} />
            </div>
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
