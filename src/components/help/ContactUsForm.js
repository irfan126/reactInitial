import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { BwmInput } from 'components/shared/form/BwmInput';
import { BwmTextArea } from 'components/shared/form/BwmTextArea';
import { BwmResError } from 'components/shared/form/BwmResError';

const ContactUsForm = props => {
  const { handleSubmit, pristine, submitting, submitCb, valid, errors } = props
  return (
    <form onSubmit={handleSubmit(submitCb)}>
      <Field
        name="email"
        type="email"
        label='Email'
        className='form-control'
        component={BwmInput}
        />
       <Field
        name="question"
        type="text"
        label='Question'
        rows='6'
        className='form-control'
        component={BwmTextArea}
      />      
      <button className='btn btn-bwm btn-form mv1' type="submit" disabled={!valid || pristine || submitting}>
        Submit
      </button>
      <BwmResError errors={errors} />
    </form>
  )
}

const validate = values => {
  const errors = {};

  if (!values.email) {
    errors.email = 'Please enter an email address!';
  }

  return errors;
}

export default reduxForm({
  form: 'contactUsForm',
  validate
})(ContactUsForm)