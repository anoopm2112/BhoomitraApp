import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { getLanguage } from '../selectors';
import UpdateLanguageSelectView from '../components/UpdateLanguageSelectView';
import { LANGUAGES } from '../constants';
import * as Actions from '../actions';

class UpdateLanguageSelect extends Component {

    render() {
        return (
            <UpdateLanguageSelectView {...this.props} />
        );
    }
}

const mapStateToProps = createStructuredSelector({
    language: getLanguage
});

const mapDispatchToProps = dispatch => ({
    languageSelect: (langId) => {
        const language = LANGUAGES.find(LANGUAGE => LANGUAGE.langId === langId);
        dispatch(Actions.languageSelect({ language, restart: true }));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(UpdateLanguageSelect);