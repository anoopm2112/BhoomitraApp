import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import ServiceItemListView from '../components/ServiceItemListView';
import { getQueued, getProgress, getProcessed, getFailed } from '../../dfg/selectors';
import { getIcons, getServiceItemList } from '../selectors';
import { getAppTourData } from '../../dashboard/selectors';
import * as DfgActions from '../../dfg/actions';
import * as DashboardActions from '../../dashboard/actions';
import * as ServiceActions from '../actions';
import { getAnimationData } from '../../settings/selectors';

class ServiceItemList extends Component {
    componentDidMount() {
        this.props.setAppTourDataStartCustomerService();
    }
    render() {
        return (
            <ServiceItemListView {...this.props} />
        );
    }
}

const mapStateToProps = createStructuredSelector({
    serviceItemList: getServiceItemList,
    queued: getQueued,
    progress: getProgress,
    processed: getProcessed,
    failed: getFailed,
    icons: getIcons,
    tourData: getAppTourData,
    animationData: getAnimationData
});

const mapDispatchToProps = dispatch => ({
    loadServiceIcons: () => dispatch(ServiceActions.loadServiceIcons()),
    generateServiceExecutionSurveyDataMap: (data) => dispatch(ServiceActions.generateServiceExecutionSurveyDataMap(data)),
    resetServiceExecutionSurveyDataMap: () => dispatch(ServiceActions.resetServiceExecutionSurveyDataMap()),
    startServiceExecution: (data) => dispatch(ServiceActions.startServiceExecution(data)),
    unsetProcessed: (data) => dispatch(DfgActions.unsetProcessed(data)),
    doResume: () => dispatch(DfgActions.doResume()),
    dontResume: () => dispatch(DfgActions.dontResume()),
    setAppTourDataStartCustomerService: () => dispatch(DashboardActions.setAppTourDataStartCustomerService()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ServiceItemList);
