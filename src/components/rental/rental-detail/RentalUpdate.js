import React from 'react';
import { connect } from 'react-redux';
import RentalMap from './RentalMap';

import { UserGuard } from '../../shared/auth/UserGuard';
import { RentalAssets } from './RentalAssets';
import { toUpperCase } from 'helpers';

import { EditableInput } from '../../shared/editable/EditableInput';
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
<p className='mv0 blue'>Advert Active:</p>
                    <label className={`rental-label rental-type ${rental.category}`}> Is advert active: </label>
                    <EditableSelect entity={rental}
                                    entityField={'adActive'}
                                    className={`rental-type ${rental.category} v-mid`}
                                    updateEntity={this.updateRental}
                                    options={[true, false]}
                                    containerStyle={{'display': 'inline-block'}}
                                    errors={errors}
                                    resetErrors={this.resetRentalErrors} />
<hr className='mv2'></hr>

<p className='mv0 blue'>Title:</p>
                    <EditableInput entity={rental}
                                   entityField={'title'}
                                   className={'rental-title v-mid f3'}
                                   updateEntity={this.updateRental}
                                   errors={errors}
                                   resetErrors={this.resetRentalErrors}  />
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
                                    options={['apartment', 'house', 'condo']}
                                    errors={errors}
                                    resetErrors={this.resetRentalErrors} />
<hr className='mv2'></hr>

<p className='mv0 blue'>Shared:</p>
                    <label className={`rental-label rental-type ${rental.category}`}> Shared </label>
                    <EditableSelect entity={rental}
                                    entityField={'shared'}
                                    className={`rental-type ${rental.category} v-mid`}
                                    updateEntity={this.updateRental}
                                    options={[true, false]}
                                    containerStyle={{'display': 'inline-block'}}
                                    errors={errors}
                                    resetErrors={this.resetRentalErrors} />
<hr className='mv2'></hr>

<p className='mv0 blue'>Bedrooms:</p>
                    <div className='rental-room-info'>
                      <span><i className='fa fa-building'></i>
                        <EditableInput entity={rental}
                                   entityField={'bedrooms'}
                                   className={'rental-bedrooms v-mid'}
                                   containerStyle={{'display': 'inline-block'}}
                                   updateEntity={this.updateRental}
                                   errors={errors}
                                   resetErrors={this.resetRentalErrors}  /> bedrooms</span>
                      <span><i className='fa fa-user'></i> {rental.bedrooms + 4} guests</span>
                      <span><i className='fa fa-bed'></i> {rental.bedrooms + 2} beds</span>
                    </div>

<hr className='mv2'></hr>

<p className='mv0 blue'>Address:</p>
      <BwmResError errors={errors} />
<p className='mv0 f6 blue'>City:</p>
                    <EditableInput entity={rental}
                                   entityField={'city'}
                                   className={'rental-city v-mid'}
                                   updateEntity={this.updateRental}
                                   errors={errors}
                                   formatPipe={[toUpperCase]}
                                   resetErrors={this.resetRentalErrors} />
<p className='mv0 f6 blue'>Street:</p>
                    <EditableInput entity={rental}
                                   entityField={'street'}
                                   className={'rental-street mv6 v-mid'}
                                   updateEntity={this.updateRental}
                                   errors={errors}
                                   resetErrors={this.resetRentalErrors} />

<hr className='mv2'></hr>

                <div className='col-md-6'>

                  <RentalMap location={`${rental.city}, ${rental.street}`} />

                </div>

                    <hr></hr>
                    <RentalAssets />
                  </div>

              </div>
            </div>
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
