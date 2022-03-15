import React, { Component } from 'react';
import ComplaintImageView from '../components/ComplaintImageView';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import * as ComplaintActions from '../actions';

class ComplaintImage extends Component {
    render() {
        return (
            <ComplaintImageView {...this.props} />
        );
    }
}

const mapStateToProps = createStructuredSelector({
});

const mapDispatchToProps = dispatch => ({
    newComplaintImage: (data) => dispatch(ComplaintActions.newComplaintImage(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(ComplaintImage);

