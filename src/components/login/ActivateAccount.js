import React from 'react';
import ActivateAccForm from './ActivateAccForm';
import { Redirect } from 'react-router-dom';

import * as actions from 'actions';

export class ActivateAccount extends React.Component {

  constructor() {
    super();

    this.state = {
      errors: [],
      redirect: false,
      redirectActive: false
    }

    this.activateAccReset = this.activateAccReset.bind(this);
  }

  componentDidMount() {
    console.log(this.props.match.params.token);
    if (this.props.match.params.token) {
      actions.activateAcc(this.props.match.params.token).then(
        activateAccSuccess => this.setState({redirectActive: true}),
        errors => this.setState({errors, redirectActive: false})
      );
    }
  }

  activateAccReset(userData) {
    actions.activateAccReset(userData).then(
      activateAccResetSuccess => this.setState({redirect: true}),
      errors => this.setState({errors})
    );
  
  }

  render() {
    const { errors, redirect,redirectActive } = this.state;
    if (redirectActive) { return <Redirect to={{pathname: '/login', state: { activeAccount: true }}} /> }
    if (redirect) { return <Redirect to={{pathname: '/login', state: { successRegister: true }}} /> }

    return (
      <section id='passwordReset'>
        <div className='bwm-form'>
          <div className='row'>
            <div className='col-md-5'>
              <h1>New Account Activation link</h1>
              <p>Please enter the Email address you registered with!</p>
              <ActivateAccForm submitCb={this.activateAccReset} errors={errors} />
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