import React from 'react';
import { toUpperCase } from 'helpers';

export function RentalDetailInfo(props) {
  const rental = props.rental;

  return (
      <div className='rental col'>
        <h2 className={`rental-type ${rental.category}`}>{rental.category}</h2>
        <h2 className='rental-city'>{toUpperCase(rental.city)}</h2>
        <div className="rental-owner">
          <img src="https://api.adorable.io/avatars/285/abott@adorable.png" alt="owner"/>
          <span>{rental.user && rental.user.username}</span>
        </div>
        <h1 className='rental-title'>{rental.title}</h1>       
        <h3 className='booking-price'>Course Price: £{rental.dailyRate}</h3> 
        <hr></hr>
        <p className='rental-description .pre'>
          {rental.description}
        </p>
        <hr></hr>
      </div>
    )
}
