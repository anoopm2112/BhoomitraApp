import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import SurveyFilterView from '../components/SurveyFilterView';
import { getCompletedSurveys } from '../selectors';
import * as DfgActions from '../actions';
import { actions } from '../../../common';
import { getAnimationData } from '../../settings/selectors';

const { navigation: { navigateBack } } = actions;

class SurveyFilter extends Component {
    render() {
        return (
            <SurveyFilterView {...this.props} />
        );
    }
}

const mapStateToProps = createStructuredSelector({
    completedSurveys: getCompletedSurveys,
    animationData: getAnimationData
});

const mapDispatchToProps = dispatch => ({
    setCompletedSurveysFilter: (data) => dispatch(DfgActions.setCompletedSurveysFilter(data)),
    fetchCompletedSurveyFilterDropDownData: (data) => dispatch(DfgActions.fetchCompletedSurveyFilterDropDownData(data)),
    setCompletedSurveysFilterDropDownData: (data) => dispatch(DfgActions.setCompletedSurveysFilterDropDownData(data)),
    clearCompleteSurveyFilter: () => dispatch(DfgActions.clearCompleteSurveyFilter()),
    navigateBack: () => dispatch(navigateBack()),
});

export default connect(mapStateToProps, mapDispatchToProps)(SurveyFilter);