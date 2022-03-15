import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { getUserRoles } from '../../user/selectors';
import SettingsView from '../components/SettingsView';
import { getUserInfo } from '../../user/selectors';
import { getSurveyTemplateFetchStatus } from '../../dfg/selectors';
import * as SettingsActions from '../actions';
import { syncInprogressData } from '../../dfg/actions';
import { syncPaymentData } from '../../service/actions';
import I18n from '../../../common/i18n';
import { infoToast } from '../../../common/utils/toastUtil';
import { getAnimationData } from '../selectors';

class Settings extends React.Component {
    render() {
        return (
            <SettingsView {...this.props} />
        );
    }
}

const mapStateToProps = createStructuredSelector({
    userInfo: getUserInfo,
    surveyTemplateFetchStatus: getSurveyTemplateFetchStatus,
    userRoles: getUserRoles,
    animationData: getAnimationData
});

const mapDispatchToProps = dispatch => ({
    navigateTo: (route, screen) => dispatch(SettingsActions.navigateTo(route, screen)),
    forceSync: () => {
        infoToast(I18n.t('bg_sync_onprogress'));
        dispatch(syncInprogressData());
        dispatch(syncPaymentData());
    },
    forceUpdate: () => dispatch(SettingsActions.forceUpdate()),
    componentAnimation: (data) => dispatch(SettingsActions.componentAnimation(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
