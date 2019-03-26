import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { BwmInput } from 'components/shared/form/BwmInput';
import { BwmSelect } from 'components/shared/form/BwmSelect';
import { BwmTextArea } from 'components/shared/form/BwmTextArea';
import { BwmFileUpload } from 'components/shared/form/BwmFileUpload';
import { BwmResError } from 'components/shared/form/BwmResError';
// import { required, minLength4 } from 'components/shared/form/validators';

const RentalCreateForm = props => {
  const { handleSubmit, pristine, submitting, submitCb, valid, options, errors } = props
  return (
<div className='pb3'>
    <form onSubmit={handleSubmit(submitCb)}>
<div className='row'>
<div className='col-md-6'>
    <Field
        name="title"
        type="text"
        label='Title'
        className='form-control'
        component={BwmInput}
      />
       <Field
        name="description"
        type="text"
        label='Description'
        rows='6'
        className='form-control'
        component={BwmTextArea}
      />
      <Field
        name="city"
        type="text"
        label='City'
        className='form-control'
        component={BwmInput}
      />
      <Field
        name="street"
        type="text"
        label='Street'
        className='form-control'
        component={BwmInput}
      />
      <Field
        options={options}
        name="category"
        label='Category'
        className='form-control'
        component={BwmSelect}
      />

      <Field
        name="bedrooms"
        type="number"
        label='Bedrooms'
        className='form-control'
        component={BwmInput}
      />
      <Field
        name="dailyRate"
        type="text"
        label='Daily Rate'
        className='form-control'
        symbol='$'
        component={BwmInput}
      />
      <Field
        name="shared"
        type="checkbox"
        label='Shared'
        className='form-control'
        component={BwmInput}
      />
</div>
<div className='col-md-6'>
<h1 className='page-title'>Add Images</h1>
<hr></hr>
            <Field
        name="image1"
        label='Image1'
        component={BwmFileUpload}
      />
<hr></hr>
       <Field
        name="image2"
        label='Image2'
        component={BwmFileUpload}
      />
<hr></hr>          
       <Field
        name="image3"
        label='Image3'
        component={BwmFileUpload}
      />
<hr></hr>
      <Field
        name="image4"
        label='Image4'
        component={BwmFileUpload}
      />
<hr></hr>
      <Field
        name="image5"
        label='Image5'
        component={BwmFileUpload}
      />
<hr></hr>
</div>
</div>
      <button className='btn btn-bwm btn-form' type="submit" disabled={!valid || pristine || submitting}>
        Create Rental
      </button>
      <BwmResError errors={errors} />
    </form>
</div>
  )
}
//https://s3.eu-west-2.amazonaws.com/bwm-image-dev/1553036875365
export default reduxForm({
  form: 'rentalCreateForm',
  initialValues: { shared: false, category: 'apartment', image: 'none'}
})(RentalCreateForm)
