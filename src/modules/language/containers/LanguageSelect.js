import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { getLanguage } from '../selectors';
import LanguageSelectView from '../components/LanguageSelectView';
import { LANGUAGES } from '../constants';
import * as Actions from '../actions';

class LanguageSelect extends Component {

    render() {
        return (
            <LanguageSelectView {...this.props} />
        );
    }

}

const mapStateToProps = createStructuredSelector({
    language: getLanguage
});

const mapDispatchToProps = dispatch => ({
    languageSelect: (langId) => {
        const language = LANGUAGES.find(LANGUAGE => LANGUAGE.langId === langId);
        dispatch(Actions.languageSelect({ language, reinitialize: true }));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(LanguageSelect);
