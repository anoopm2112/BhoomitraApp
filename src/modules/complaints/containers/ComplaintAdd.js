import React, { Component } from 'react';
import ComplaintAddView from '../components/ComplaintAddView';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import * as ComplaintActions from '../actions';
import { getNewComplaint, getComplaints } from '../selectors';

class ComplaintAdd extends Component {
    render() {
        return (
            <ComplaintAddView {...this.props} />
        );
    }
}

const mapStateToProps = createStructuredSelector({
    newComplaint: getNewComplaint,
    complaints: getComplaints
});

const mapDispatchToProps = dispatch => ({
    fetchComplaints: (data) => dispatch(ComplaintActions.fetchComplaints(data)),
    navigateToComplaintImage: () => dispatch(ComplaintActions.navigateToComplaintImage()),
    deleteComplaintImage: () => dispatch(ComplaintActions.deleteComplaintImage()),
    schedule: (data) => dispatch(ComplaintActions.schedule(data)),
    addComplaint: (data) => dispatch(ComplaintActions.addComplaint(data)),
    customerComplaints: () => dispatch(ComplaintActions.customerComplaints()),

});

export default connect(mapStateToProps, mapDispatchToProps)(ComplaintAdd);

