import React from 'react';
import { RentalList } from './RentalList';
import { connect } from 'react-redux';

import { toUpperCase } from 'helpers';
import * as actions from 'actions';


class RentalFilterListing extends React.Component {

  constructor() {
    super();

    this.state = {
      searchedCategory: ''
    }
  }

  componentWillMount() {
    this.searchRentalsByCategory();
  }

  componentDidUpdate(prevProps) {
    const currentUrlParam = this.props.match.params.category;
    const prevUrlParam = prevProps.match.params.category;

    if (currentUrlParam !== prevUrlParam) {
      this.searchRentalsByCategory();
    }
  }

  searchRentalsByCategory() {
    const searchedCategory = this.props.match.params.category;
    this.setState({searchedCategory});

    this.props.dispatch(actions.fetchFilter(searchedCategory));
  }

  renderTitle() {
    const { errors, data } = this.props.rentals;
    const { searchedCategory } = this.state;
    let title = '';

    if (errors.length > 0) {
      title = errors[0].detail;
    }

    if(data.length > 0) {
      title = `Your Home in Category of ${toUpperCase(searchedCategory)}`;
    }

    return <h1 className="page-title">{title}</h1>
  }

  render() {
    return (
      <section id="rentalListing">
        {this.renderTitle()}
        <RentalList rentals={this.props.rentals.data} />
      </section>
    )
  }
}

function mapStateToProps(state) {
  return {
    rentals: state.rentals
  }
}

export default connect(mapStateToProps)(RentalFilterListing)
