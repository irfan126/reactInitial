import React from 'react';

export class AboutUs extends React.Component {

  render() {

    return (
      <section id='aboutUs'>
        <div className='bwm-form'>
          <div className='row'>
            <div className='col-md-5'>
              <h1>About Us</h1>
              <p>Inexpensive courses for beginners, try a new skill or become an instructor.</p>
              <p>Our aim is to help people learn new skill in a face to face</p>
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

