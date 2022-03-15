import { all, takeLatest, delay, put, fork, select, take, call } from 'redux-saga/effects';
import * as Actions from './actions';
import helpSupportData from './data.json';
import _ from 'lodash';
import { getLanguage } from '../dfg/common/selectors';

const { types: ActionTypes } = Actions;

function* fetchDepartment(action) {
    const langId = yield select(getLanguage);
    let language = langId.langId;
    const supportType = action.payload.data.type;
    let SEND_FEEDBACK = 'sendFeedback';
    let PHONE_SUPPORT = 'phoneSupport';
    let EMAIL_SUPPORT = 'emailSupport';

    if (supportType === SEND_FEEDBACK) {
        const options = helpSupportData.sendFeedback.departments.options;
        let dropdownArray = [];
        options.map((item) => {
            if (language === 1) {
                dropdownArray.push({ 'id': item.id, 'label': item.name.en_IN });
            } else if (language === 2) {
                dropdownArray.push({ 'id': item.id, 'label': item.name.ml_IN });
            } else if (language === 3) {
                dropdownArray.push({ 'id': item.id, 'label': item.name.mr_IN });
            }
        });
        yield put(Actions.setSupportData(dropdownArray));
    } else if (supportType === PHONE_SUPPORT || supportType === EMAIL_SUPPORT) {
        const support_contact = supportType === PHONE_SUPPORT ? helpSupportData.phoneSupport.app.contact : helpSupportData.emailSupport.app.contact;
        const options = supportType === PHONE_SUPPORT ? helpSupportData.phoneSupport.departments.options : helpSupportData.emailSupport.departments.options
        let dropdownArray = [];
        options.map((item) => {
            if (language === 1) {
                dropdownArray.push({ 'id': item.id, 'label': item.name.en_IN, 'contact': item.contact });
            } else if (language === 2) {
                dropdownArray.push({ 'id': item.id, 'label': item.name.ml_IN, 'contact': item.contact });
            } else if (language === 3) {
                dropdownArray.push({ 'id': item.id, 'label': item.name.mr_IN, 'contact': item.contact });
            }
        });
        yield put(Actions.setSupportData({ 'dropDownData': dropdownArray, 'support_contact': support_contact }));
    }
}

export default function* helpSupportSaga() {
    yield all([
        takeLatest(ActionTypes.FETCH_DEPARTMENT, fetchDepartment)
    ]);
}
