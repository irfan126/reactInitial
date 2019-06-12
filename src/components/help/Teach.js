import React from 'react';
import { Link } from 'react-router-dom';

export class Teach extends React.Component {

  render() {

    return (
      <section id='teach'>
        <div className='bwm-form'>
          <div className='row'>
            <div className='col-md-5'>
              <h1>Become an Instructor</h1>
              <p>Share your knowledge, experience and skills to inspire others.</p>

                            <p>If you have expertise or a background in a particular field, create a course to help others learn.
                            It could be as simple cooking a partiuclar cuisine or learning to knit.</p>

                                                        <p>If you have any further question please contact us.</p>
                                        <div className='alert alert-warning'>
                          If you want advertise your course please Register.
            <Link style={{'marginLeft': '10px'}} className='btn btn-bwm' to='/register'>Register</Link>
          </div>
            </div>
            <div className='col-md-6 ml-auto'>
              <div className='image-container'>
                <h2 className='catchphrase'>Whether you want to learn how to bake a cake or knit a scarf find an instructor to get you started!</h2>

                <img src={process.env.PUBLIC_URL + '/img/register-image.jpg'} alt=""/>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }
}