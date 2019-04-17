import React from 'react';
import ContactUsForm from './ContactUsForm';
import { Redirect } from 'react-router-dom';
import { toast } from 'react-toastify';

import * as actions from 'actions';

export class ContactUs extends React.Component {

  constructor() {
    super();

    this.state = {
      errors: [],
      redirect: false
    }

    this.contactUsRequest = this.contactUsRequest.bind(this);
  }

  contactUsRequest(userData) {
    actions.contactUsRequest(userData).then(
      contactUsSuccess => {toast.success(' We have received your question. We will respond as soon as possible')
      this.setState({redirect: true});},
      errors => this.setState({errors})
    );
  }

  render() {
    const { errors } = this.state || this.props.location.state;
    const { redirect } = this.state;

    if (redirect) {
      return <Redirect to={{pathname: '/rentals'}} />
    }

    return (
      <section id='contactUs'>
        <div className='bwm-form'>
          <div className='row'>
            <div className='col-md-5'>
              <h1>Contact Us</h1>

              <p>Please enter your email address and question. We will respond as soon as possible!</p>
              <ContactUsForm submitCb={this.contactUsRequest} errors={errors} />
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