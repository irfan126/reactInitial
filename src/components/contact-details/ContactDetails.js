import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

class ContactDetails extends React.Component {

  render() {
    const { rental } = this.props;

    return (
      <div className='booking'>
        <h2 className='booking-price'>Contact Details</h2>
        <hr></hr>
        <p className='booking-note-title'>Email: {rental.emailContact}</p>
        <hr></hr>
        <p className='booking-note-text'>Phone: {rental.phone}</p>
        <hr></hr>
        <p className='booking-note-text'>Website: {rental.weblink}</p>
      </div>
    )
  }
}

export default (ContactDetails)