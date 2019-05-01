import React from 'react';
import { withRouter } from 'react-router-dom';

class RentalSearchInput extends React.Component {

  constructor() {
    super();

    this.searchInput = React.createRef();
  }

  handleKeyPress(event) {
    if (event.key === 'Enter') {
      this.handleSearch();
    }
  }

  handleSearch() {
    const { history } = this.props;
    const city = this.searchInput.current.value;

    city ? history.push(`/rentals/${city}/homes`) : history.push('/rentals');
  }

  handleFilter(category) {
    const { history } = this.props;


    category ? history.push(`/rentals/filter/${category}/homes`) : history.push('/rentals');
  }

  render() {
    return (
      <div className='form-inline my-2 my-lg-0'>



<div className='form-inline  my-2 my-lg-0'>
        <input onKeyPress={(event) => { this.handleKeyPress(event)}}
               ref={this.searchInput}
               className='form-control mr-sm-2 bwm-search'
               type='search'
               placeholder='Try "New York"'
               aria-label='Search'></input>
        <button onClick={() => {this.handleSearch()}}
                className='btn btn-outline-success my-2 my-sm-0 btn-bwm-search'
                type='submit'>Search</button>
</div>
<div className="nav-item dropdown ">
  <a className="nav-link nav-item dropdown-toggle clickable" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
    Filter
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


export default withRouter(RentalSearchInput)
