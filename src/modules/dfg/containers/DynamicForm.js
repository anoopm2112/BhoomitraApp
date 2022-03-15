import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withFormik } from 'formik';
import * as yup from 'yup';
import DynamicFormView from '../components/DynamicFormView';
import * as Actions from '../actions';
import { actions } from '../../../common';
import { getRender } from '../selectors';
import { VALIDATION_TYPES } from '../constants';
import { getAppTourData, getAppQrScannerModal } from '../../dashboard/selectors';
import * as DashboardActions from '../../dashboard/actions';
import { getLanguage } from '../../language/selectors';
import { getAnimationData } from '../../settings/selectors';

const { navigation: { navigateBack } } = actions;

class DynamicForm extends Component {

    componentDidMount() {
        this.props.startSurvey();
    }

    render() {
        return (
            <DynamicFormView {...this.props} />
        );
    }

}

const mapStateToProps = createStructuredSelector({
    renderData: getRender,
    tourData: getAppTourData,
    qrScannerModal: getAppQrScannerModal,
    language: getLanguage,
    animationData: getAnimationData
});

const mapDispatchToProps = dispatch => ({
    navigateBack: () => dispatch(navigateBack()),
    startSurvey: () => dispatch(Actions.startSurvey()),
    resetSurvey: () => dispatch(Actions.resetSurvey()),
    clearMessages: () => dispatch(Actions.clearMessages()),
    processConnectedQuestions: (data) => dispatch(Actions.processConnectedQuestions(data)),
    clearConnectedQuestionsToShow: () => dispatch(Actions.clearConnectedQuestionsToShow()),
    setInfoMessage: (data) => dispatch(Actions.setInfoMessage(data)),
    setErrorMessage: (data) => dispatch(Actions.setErrorMessage(data)),
    nextButton: (values) => dispatch(Actions.nextButton(values)),
    previousButton: () => dispatch(Actions.previousButton()),
    setDataSource: (data) => dispatch(Actions.setDataSource(data)),
    setScanQrCodeAppTour: (data) => dispatch(DashboardActions.setScanQrCodeAppTour(data)),
    setFinishSurveyBtn: (data) => dispatch(Actions.setFinishSurveyBtn(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withFormik({
    enableReinitialize: true,
    mapPropsToValues: (props) => props.renderData.previousAnswers,
    validationSchema: (props) => {
        const { validationSchema: { defaultQuestions, connectedQuestions }, connectedQuestionsToShow = [] } = props.renderData;
        const validationSchema = { ...defaultQuestions };
        Object.keys(connectedQuestions).forEach(connectedQuestion => {
            if (connectedQuestionsToShow.includes(connectedQuestion)) {
                validationSchema[connectedQuestion] = connectedQuestions[connectedQuestion];
            }
        });
        return yup.object().shape(validationSchema);
    },
    handleSubmit: (values, { props, setFieldError }) => {
        // Handle validations for Yup excluded question here
        let hasAdditionalErrors = false;
        const { renderData: { yupExcludedQuestions, questionsWithFilterCriteria, connectedQuestionsToShow = [] } } = props;
        if (yupExcludedQuestions) {
            Object.keys(yupExcludedQuestions).forEach(questionId => {
                const item = yupExcludedQuestions[questionId];
                const { isConnectedQuestion, validations = [], options } = item;
                if (isConnectedQuestion && !connectedQuestionsToShow.includes(questionId)) {
                    return;
                }
                validations.forEach(validation => {
                    switch (validation.type) {
                        case VALIDATION_TYPES.IS_MANDATORY:
                            if (values[questionId] === undefined) {
                                setFieldError(questionId, validation.errorMsg);
                                hasAdditionalErrors = true;
                                break;
                            }
                            // Question which can take multiple values as answer (eg. checkbox)
                            // needs more checking
                            if (Array.isArray(values[questionId])) {
                                const result = _.intersectionWith(options, values[questionId], (o, id) => o.id === id);
                                const compactedValues = _.compact(values[questionId]);
                                if (!compactedValues.length || !result.length) {
                                    setFieldError(questionId, validation.errorMsg);
                                    hasAdditionalErrors = true;
                                }
                            }
                            break;
                    }
                });
            });
        }
        !hasAdditionalErrors && props.nextButton(values);
    },
    displayName: 'DynamicForm'
})(DynamicForm));