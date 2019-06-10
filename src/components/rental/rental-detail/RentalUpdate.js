import React from 'react';
import { connect } from 'react-redux';
import RentalMap from './RentalMap';

import { UserGuard } from '../../shared/auth/UserGuard';
import { toUpperCase } from 'helpers';

import { EditableInput } from '../../shared/editable/EditableInput';
import  EditableAddress  from '../../shared/editable/EditableAddress';
import { EditableText } from '../../shared/editable/EditableText';
import { EditableSelect } from '../../shared/editable/EditableSelect';
import { EditableImage } from '../../shared/editable/EditableImage';
import { BwmResError } from '../../shared/form/BwmResError';

import * as actions from 'actions';

class RentalUpdate extends React.Component {

  constructor() {
    super();

    this.state = {
      isAllowed: false,
      isFetching: true
    }

    this.updateRental = this.updateRental.bind(this);
    this.resetRentalErrors = this.resetRentalErrors.bind(this);
    this.verifyRentalOwner = this.verifyRentalOwner.bind(this);
  }

  componentWillMount() {
    // Dispatch action
    const rentalId = this.props.match.params.id;

    this.props.dispatch(actions.fetchRentalById(rentalId));
  }

  componentDidMount() {
    this.verifyRentalOwner();
  }

  updateRental(rentalData) {
    const {rental: {_id}, dispatch } = this.props;

    dispatch(actions.updateRental(_id, rentalData));
  }

  resetRentalErrors() {
    this.props.dispatch(actions.resetRentalErrors());
  }

  verifyRentalOwner() {
    const rentalId = this.props.match.params.id;
    this.setState({isFetching: true});

    return actions.verifyRentalOwner(rentalId).then(
      () => {
        this.setState({isAllowed: true, isFetching: false})
      },
      () => {
        this.setState({isAllowed: false, isFetching: false})
      });
  }

  render() {
    const { rental, errors } = this.props;
    const { isFetching, isAllowed } = this.state;

    if (rental._id) {
      return (
        <UserGuard isAllowed={isAllowed} isFetching={isFetching}>
          <section id='rentalDetails'>

<h1 className='page-title mv1'>Edit Rental</h1>
<hr className='mv2'></hr>
<div className='row'>

<div className='col-md-6'>
            <div className='details-section'>
              <div className='col'>
                  <div className='rental'>
<p className='mv0 blue'>Is Advert Active:</p>
                    <EditableSelect entity={rental}
                                    entityField={'adActive'}
                                    className={`rental-type ${rental.category} v-mid`}
                                    updateEntity={this.updateRental}
                                    options={[true, false]}
                                    errors={errors}
                                    resetErrors={this.resetRentalErrors} />
<hr className='mv2'></hr>

<p className='mv0 blue'>Title:</p>
                    <EditableInput entity={rental}
                                   entityField={'title'}
                                   className={'v-mid'}
                                   updateEntity={this.updateRental}
                                   errors={errors}
                                   resetErrors={this.resetRentalErrors}  />
<hr className='mv2'></hr>

<p className='mv0 blue'>Course Price:</p>
                    <EditableInput entity={rental}
                                    entityField={'dailyRate'}
        type="number"
        pattern="[0-9]*" 
                                    className={`rental-type ${rental.dailyRate} v-mid`}
                                    updateEntity={this.updateRental}
                                    errors={errors}
                                    resetErrors={this.resetRentalErrors} />
<hr className='mv2'></hr>

<p className='mv0 blue'>Description:</p>
                    <EditableText  entity={rental}
                                   entityField={'description'}
                                   className={'rental-description v-mid'}
                                   updateEntity={this.updateRental}
                                   rows={6}
                                   cols={50}
                                   errors={errors}
                                   resetErrors={this.resetRentalErrors}  />
<hr className='mv2'></hr>

<p className='mv0 blue'>Category:</p>
                    <EditableSelect entity={rental}
                                    entityField={'category'}
                                    className={`rental-type ${rental.category} v-mid`}
                                    updateEntity={this.updateRental}
                                    options={['DIY and Gardening', 'Food and Drink',
                                     'Hair and Beauty', 'Health and Fitness', 'Hobbies and Craft', 'Photography', 'Other']}
                                    errors={errors}
                                    resetErrors={this.resetRentalErrors} />
<hr className='mv2'></hr>

<p className='mv0 blue'>Course Location:</p>
<BwmResError errors={errors} />
                            <p className='mv0 f6 blue'>Street:</p>
                            <h2 className='rental-city mt1'>{toUpperCase(rental.street)}</h2>

                            <p className='mv0 f6 blue'>Postcode:</p>
                            <h2 className='rental-city mt1'>{toUpperCase(rental.postcode)}</h2>

                            <EditableAddress submitCb={this.updateRental}
                            resetErrors={this.resetRentalErrors} />


<hr className='mv2'></hr>

                <div className='col-md-6'>

                  <RentalMap location={`${rental.postcode}, ${rental.street}`} />

                </div>

<hr className='mv2'></hr>
<p className='mv0 blue'>Contact Details:</p>

<p className='mv0 f6 blue'>Contact Email:</p>

                    <EditableInput entity={rental}
                                   entityField={'emailContact'}
                                   className={'rental-city mt1'}
                                   updateEntity={this.updateRental}
                                   errors={errors}
                                   resetErrors={this.resetRentalErrors}  />

<p className='mv0 f6 blue'>Contact telephone number:</p>
                    <EditableInput entity={rental}
                                   entityField={'phone'}
                                   className={'rental-city mt1'}
                                   updateEntity={this.updateRental}
                                   errors={errors}
                                   resetErrors={this.resetRentalErrors}  />

<p className='mv0 f6 blue'>Weblink:</p>
                    <EditableInput entity={rental}
                                   entityField={'weblink'}
                                   className={'rental-city mt1'}
                                   updateEntity={this.updateRental}
                                   errors={errors}
                                   resetErrors={this.resetRentalErrors}  />
                  </div>
              </div>
            </div>
            <hr className='mv2'></hr>
</div>

<div className='col-md-6'>
            <div className='container-fluid'>
              <div className='col'>
                <div className='col-md-6'>

<p className='mv0 blue'>Images:</p>
                  <EditableImage entity={rental}
                                 entityField={'image1'}
                                 errors={errors}
                                 updateEntity={this.updateRental}>
                  </EditableImage> 
<hr className='mv0 pa0'></hr>
                  <EditableImage entity={rental}
                                 entityField={'image2'}
                                 errors={errors}
                                 updateEntity={this.updateRental}>
                  </EditableImage>
<hr className='mv0 pa0'></hr>
                  <EditableImage entity={rental}
                                 entityField={'image3'}
                                 errors={errors}
                                 updateEntity={this.updateRental}>
                  </EditableImage>
<hr className='mv0 pa0'></hr>
                  <EditableImage entity={rental}
                                 entityField={'image4'}
                                 errors={errors}
                                 updateEntity={this.updateRental}>
                  </EditableImage>
<hr className='mv0 pa0'></hr>
                  <EditableImage entity={rental}
                                 entityField={'image5'}
                                 errors={errors}
                                 updateEntity={this.updateRental}>
                  </EditableImage>
          
                </div>

              </div>
            </div>
</div>

</div>


<hr className='mv2'></hr>
<h1 className='page-title mv1'>Edit Rental End</h1>
          </section>
        </UserGuard>
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

export default connect(mapStateToProps)(RentalUpdate)
