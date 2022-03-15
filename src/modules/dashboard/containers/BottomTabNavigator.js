import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import BottomTabNavigatorView from '../components/BottomTabNavigatorView';
import { getSurveyTemplateFetchStatus } from '../../dfg/selectors';

class BottomTabNavigator extends Component {
    render() {
        return (
            <BottomTabNavigatorView {...this.props} />
        );
    }
}

const mapStateToProps = createStructuredSelector({
    surveyTemplateFetchStatus: getSurveyTemplateFetchStatus
});

export default connect(mapStateToProps, null)(BottomTabNavigator);




