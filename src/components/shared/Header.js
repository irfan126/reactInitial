import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import RentalSearchInput from 'components/rental/RentalSearchInput';
import FilterInput from 'components/rental/FilterInput';

class Header extends React.Component {

  constructor() {
    super();

    this.handleLogout = this.handleLogout.bind(this);
  }

  handleLogout() {
    this.props.logout();
    this.props.history.push('/rentals');
  }

  renderAuthButtons(isAuth) {
    if (isAuth) {
      return(
            <React.Fragment>
                <a className='nav-item nav-link clickable' onClick={this.handleLogout}>Logout</a>
                <Link className='nav-item nav-link' to='/aboutUs'>About Us</Link>
                <Link className='nav-item nav-link' to='/contactUs'>Contact Us</Link>
            </React.Fragment>
            )
    }

    return (
        <React.Fragment>
          <Link className='nav-item nav-link' to='/login'>Login <span className='sr-only'>(current)</span></Link>
          <Link className='nav-item nav-link' to='/teach'>Teach</Link>
          <Link className='nav-item nav-link' to='/register'>Register</Link>
          <Link className='nav-item nav-link' to='/aboutUs'>About Us</Link>
          <Link className='nav-item nav-link' to='/contactUs'>Contact Us</Link>
        </React.Fragment>
      )
  }

  renderOwnerSection(isAuth) {
    if (isAuth) {
      return (
        <div className="nav-item dropdown">
          <a className="nav-link nav-item dropdown-toggle clickable" href="#" role="button" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            Owner Section
          </a>
          <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
            <Link className="dropdown-item" to="/rentals/new">Create Course</Link>
            <Link className="dropdown-item" to="/rentals/manage">Manage Course</Link>
           {/*  <Link className="dropdown-item" to="/bookings/manage">Manage Bookings</Link>*/}
          </div>
        </div>
      )
    }
  }

  render() {
    const {username, isAuth} = this.props.auth;


    return (
      <nav className='navbar navbar-dark navbar-expand-lg'>
        <div className='container'>
          <Link className='navbar-brand' to='/rentals'>BookWithMe
            <img src={process.env.PUBLIC_URL + '/img/react-logo.svg'} alt=""/>
          </Link>

          <button className='navbar-toggler mv1' type='button' data-toggle='collapse' data-target='#navbarNavAltMarkup2' aria-controls='navbarNavAltMarkup' aria-expanded='false' aria-label='Toggle navigation'>
                      <span className='fa fa-filter mv1'></span>
          </button>



          <button className='navbar-toggler mv1' type='button' data-toggle='collapse' data-target='#navbarNavAltMarkup1' aria-controls='navbarNavAltMarkup' aria-expanded='false' aria-label='Toggle navigation'>
                      <span className='fa fa-search mv1'></span>
          </button>
          <button className='navbar-toggler mv1' type='button' data-toggle='collapse' data-target='#navbarNavAltMarkup' aria-controls='navbarNavAltMarkup' aria-expanded='false' aria-label='Toggle navigation'>
            <span className='fa fa-bars mv1'  ></span>
          </button>

                    <div className='collapse navbar-collapse' id='navbarNavAltMarkup2'>
            <div className='navbar-nav ml-auto'>
                                <FilterInput />
            </div>
          </div>
          <div className='collapse navbar-collapse' id='navbarNavAltMarkup1'>
            <div className='navbar-nav ml-auto'>
                                <RentalSearchInput />
            </div>
          </div>


          <div className='collapse navbar-collapse' id='navbarNavAltMarkup'>
            <div className='navbar-nav ml-auto'>

              { isAuth &&
                <a className='nav-item nav-link'>{username}</a>
              }
              {this.renderOwnerSection(isAuth)}
              {this.renderAuthButtons(isAuth)}
            </div>
          </div>
        </div>
      </nav>
    )
  }
}

function mapStateToProps(state) {
  return {
    auth: state.auth
  }
}

export default withRouter(connect(mapStateToProps)(Header));
