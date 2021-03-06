import React from 'react';
import RentalCreateForm from './RentalCreateForm';
import { Redirect } from 'react-router-dom';

import * as actions from 'actions';

export class RentalCreate extends React.Component {

  constructor() {
    super();

    this.state = {
      errors: [],
      redirect: false
    }

    this.rentalCateogies = ['DIY and Gardening', 'Food and Drink', 'Hair and Beauty', 'Health and Fitness', 'Hobbies and Craft', 'Photography', 'Other'];
   // this.noImageLink = "https://s3.eu-west-2.amazonaws.com/bwm-image-dev/1553026864391";
    this.createRental = this.createRental.bind(this);
  }

  createRental(rentalData) {
    actions.createRental(rentalData).then(
      (rental) => this.setState({redirect: true}),
      (errors) => this.setState({errors}))
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to={{pathname:'/rentals'}}/>
    }

    return (
      <section id='newRental'>
        <div className='bwm-form'>
          <div className='col'>
              <h1 className='page-title'>Create Rental</h1>
              <RentalCreateForm submitCb={this.createRental}
                                options={this.rentalCateogies}
                                errors={this.state.errors}/>
          </div>
        </div>
      </section>
    )
  }
}
