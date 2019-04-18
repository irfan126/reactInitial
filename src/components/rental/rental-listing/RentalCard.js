import React from 'react';
import { Link } from 'react-router-dom';

export function RentalCard(props) {
  const rental = props.rental;

  return (
    <div className={`${props.colNum}`}>
      <Link className='rental-detail-link' to={`/rentals/${rental._id}`}>
        <div className='card bwm-card grow shadow-1'>
          { (rental.image1 === 'none') &&
            <img className='img-preview card-img-top ' src={'https://s3.eu-west-2.amazonaws.com/bwm-image-dev/1553036875365'} alt={rental.title}></img>
            }       
          { !(rental.image1 === 'none') &&
             <img className='img-preview card-img-top ma1' src={rental.image1} alt={rental.title}></img>
            }
          <div className='card-block ma1'>
            <h6 className={`card-subtitle ${rental.category}`}>{rental.category} &#183; {rental.city}</h6>
            <h4 className='card-title'>{rental.title}</h4>
            <p className='card-text'>£{rental.dailyRate} 
        {!(rental.perRate === 'blank') && <span className='booking-per-night'> {rental.perRate}</span>}</p>
          </div>
        </div>
      </Link>
    </div>
  )
}
