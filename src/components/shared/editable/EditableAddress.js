import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { BwmInput } from 'components/shared/form/BwmInput';
import { BwmResError } from 'components/shared/form/BwmResError';
import { required } from 'components/shared/form/validators';

const EditableAddress = props => {
  const { handleSubmit, pristine, submitting, submitCb, valid, resetErrors } = props
  return (
<div className='pb3'>
    <form onSubmit={handleSubmit(submitCb)}>
<div className='row'>
<div className='col-md-6'>
    
      <Field
        name="street"
        type="text"
        label='Street'
        className='form-control'
        component={BwmInput}
        validate={[required]}
      />
      <Field
        name="postcode"
        type="text"
        label='Postcode'
        className='form-control'
        component={BwmInput}
        validate={[required]}
      />
</div>

</div>      
      <BwmResError errors={resetErrors} />
      <button className='btn btn-bwm btn-form' type="submit" disabled={!valid || pristine || submitting}>
        Update Address
      </button>
    </form>
</div>
  )
}
//https://s3.eu-west-2.amazonaws.com/bwm-image-dev/1553036875365
export default reduxForm({
  form: 'editableAddress'
})(EditableAddress)