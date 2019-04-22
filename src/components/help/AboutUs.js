import React from 'react';

export class AboutUs extends React.Component {

  render() {

    return (
      <section id='aboutUs'>
        <div className='bwm-form'>
          <div className='row'>
            <div className='col-md-5'>
              <h1>About Us</h1>
              <p>Make your event great!</p>
            </div>
            <div className='col-md-6 ml-auto'>
              <div className='image-container'>
                <h2 className='catchphrase'>Make your event great!</h2>
                <img src={process.env.PUBLIC_URL + '/img/register-image.jpg'} alt=""/>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }
}

