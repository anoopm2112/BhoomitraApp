import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import ComplaintsDoneView from '../components/ComplaintsDoneView';
import { getDoneComplaints } from '../selectors';
import * as ComplaintActions from '../actions';

class ComplaintsDone extends Component {
    render() {
        return (
            <ComplaintsDoneView {...this.props} />
        );
    }
}

const mapStateToProps = createStructuredSelector({
    doneComplaints: getDoneComplaints
});

const mapDispatchToProps = dispatch => ({
    loadDoneComplaints: () => dispatch(ComplaintActions.loadDoneComplaints())
});

export default connect(mapStateToProps, mapDispatchToProps)(ComplaintsDone);