import React from 'react';
import { connect } from 'react-redux';
import { RentalDetailInfo } from './RentalDetailInfo';
import RentalMap from './RentalMap';
//import Booking from 'components/booking/Booking';
import ContactDetails from 'components/contact-details/ContactDetails';

import "react-responsive-carousel/lib/styles/carousel.css";
import { Carousel } from 'react-responsive-carousel';

import * as actions from 'actions';

class RentalDetail extends React.Component {

  componentWillMount() {
    // Dispatch action
    const rentalId = this.props.match.params.id;

    this.props.dispatch(actions.fetchRentalById(rentalId));
  }
  render() {
    const { rental } = this.props;

    if (rental._id) {
      return (
        <section id='rentalDetails'>
          <div className='upper-section'>
            <div className='row'>
              <div className='col-md-6'>
              <Carousel showArrows={true} showThumbs={false} autoPlay={false} dynamicHeight={false}>
                <div>


                    {(rental.image1 === 'none') && <div className="cbs-Item" style={{"background-image": "url('https://s3.eu-west-2.amazonaws.com/bwm-image-dev/1553036875365')"}}></div>}       
                    {!(rental.image1 === 'none') && <div className="cbs-Item" style={{"background-image": `url(${rental.image1})`}}></div> }
                </div>
                <div>
                    {(rental.image2 === 'none') && <div className="cbs-Item" style={{"background-image": "url('https://s3.eu-west-2.amazonaws.com/bwm-image-dev/1553036875365')"}}></div>}       
                    {!(rental.image2 === 'none') && <div className="cbs-Item" style={{"background-image": `url(${rental.image2})`}}></div> }
                </div>
                <div>
                    {(rental.image3 === 'none') && <div className="cbs-Item" style={{"background-image": "url('https://s3.eu-west-2.amazonaws.com/bwm-image-dev/1553036875365')"}}></div>}       
                    {!(rental.image3 === 'none') && <div className="cbs-Item" style={{"background-image": `url(${rental.image3})`}}></div> }
                </div>
                <div>
                    {(rental.image4 === 'none') && <div className="cbs-Item" style={{"background-image": "url('https://s3.eu-west-2.amazonaws.com/bwm-image-dev/1553036875365')"}}></div>}       
                    {!(rental.image4 === 'none') && <div className="cbs-Item" style={{"background-image": `url(${rental.image4})`}}></div> }
                </div>
                <div>
                    {(rental.image5 === 'none') && <div className="cbs-Item" style={{"background-image": "url('https://s3.eu-west-2.amazonaws.com/bwm-image-dev/1553036875365')"}}></div>}       
                    {!(rental.image5 === 'none') && <div className="cbs-Item" style={{"background-image": `url(${rental.image5})`}}></div> }
                </div>
            </Carousel>
              </div>
              <div className='col-md-6 mv1'>
                <RentalMap location={`${rental.postcode}, ${rental.street}`} />
              </div>
            </div>
          </div>

          <div className='details-section'>
            <div className='row'>
              <div className='col-md-8'>
                <RentalDetailInfo rental={rental} />
              </div>
              <div className='col-md-4 mb3'>

               {/* <Booking rental={rental} />*/}
                <ContactDetails rental={rental} />
             </div>
            </div>
          </div>
        </section>
      )
    } else {
      return (
        <h1> Loading... </h1>
        )
    }
  }
}


function mapStateToProps(state) {
  return {
    rental: state.rental.data,
    errors: state.rental.errors
  }
}

export default connect(mapStateToProps)(RentalDetail)
