import React from 'react';
import { withRouter } from 'react-router-dom';

class FilterInput extends React.Component {

  constructor() {
    super();
  }


  handleFilter(category) {
    const { history } = this.props;


    category ? history.push(`/rentals/filter/${category}/homes`) : history.push('/rentals');
  }

  render() {
    return (
      <div className='form-inline my-2 my-lg-0'>

<div className="nav-item dropdown ">
  <a className="nav-link nav-item dropdown-toggle clickable" href="#" role="button" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
     <span className='fa fa-filter mv1'></span>
  </a>
  <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
    <button className="dropdown-item" type='submit' onClick={() => {this.handleFilter('Condo')}}>Condo</button>
    <button className="dropdown-item" type='submit' onClick={() => {this.handleFilter('House')}}>House</button>
  </div>
</div>

      </div>
    )
  }
}


export default withRouter(FilterInput)

