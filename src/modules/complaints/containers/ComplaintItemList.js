import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import ComplaintItemListView from '../components/ComplaintItemListView';
import * as ComplaintActions from '../actions';
import * as DfgActions from '../../dfg/actions';
import { getComplaintItemList, getComplaintIcons } from '../selectors';
import { getQueued, getProgress, getProcessed, getFailed } from '../../dfg/selectors';
import { getAnimationData } from '../../settings/selectors';

class ComplaintItemList extends Component {
    render() {
        return (
            <ComplaintItemListView {...this.props} />
        );
    }
}

const mapStateToProps = createStructuredSelector({
    complaintItemList: getComplaintItemList,
    queued: getQueued,
    progress: getProgress,
    processed: getProcessed,
    failed: getFailed,
    icons: getComplaintIcons,
    animationData: getAnimationData
});

const mapDispatchToProps = dispatch => ({
    startComplaintExecution: (data) => dispatch(ComplaintActions.startComplaintExecution(data)),
    generateComplaintExecutionSurveyDataMap: (data) => dispatch(ComplaintActions.generateComplaintExecutionSurveyDataMap(data)),
    doResume: () => dispatch(DfgActions.doResume()),
    dontResume: () => dispatch(DfgActions.dontResume()),
    resetComplaintExecutionSurveyDataMap: (data) => dispatch(ComplaintActions.resetComplaintExecutionSurveyDataMap(data)),
    loadComplaintIcons: () => dispatch(ComplaintActions.loadComplaintIcons()),
    unsetProcessed: (data) => dispatch(DfgActions.unsetProcessed(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ComplaintItemList);