import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import SurveyDoneDetailsView from '../components/SurveyDoneDetailsView';
import { getAnimationData } from '../../settings/selectors';

class SurveyDoneDetails extends Component {
    render() {
        return (
            <SurveyDoneDetailsView {...this.props} />
        );
    }
}

const mapStateToProps = createStructuredSelector({
    animationData: getAnimationData
});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(SurveyDoneDetails);