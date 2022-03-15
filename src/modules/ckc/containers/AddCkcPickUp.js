import React, { Component } from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from 'reselect';
import AddCkcPickUpView from '../components/AddCkcPickUpView';
import * as Actions from '../actions';
import * as McfActions from '../../mcf/actions';
import { getLanguage } from '../../language/selectors';
import { getUserInfo } from '../../user/selectors';
import { getStockInItems } from '../../mcf/selectors';
import { getCkcLsgiType, getCkcLsgiName, getCkcMcfRrfName, getCkcDoDownsName } from '../selectors';

class AddCkcPickUp extends Component {
    render() {
        return <AddCkcPickUpView {...this.props} />;
    }
}

const mapStateToProps = createStructuredSelector({
    language: getLanguage,
    userInfo: getUserInfo,
    lsgiType: getCkcLsgiType,
    lsgiName: getCkcLsgiName,
    mcfRrfName: getCkcMcfRrfName,
    goDownsName: getCkcDoDownsName,
    stockInItems: getStockInItems
});

const mapDispatchToProps = dispatch => ({
    getCkcLsgiType: () => dispatch(Actions.getCkcLsgiType()),
    getCkcLsgiName: (data) => dispatch(Actions.getCkcLsgiName(data)),
    getMcfRrfName: (data) => dispatch(Actions.getMcfRrfName(data)),
    getGoDown: (data) => dispatch(Actions.getGoDown(data)),
    savePickUp: (data) => dispatch(Actions.savePickUp(data)),
    resetLsgiName: () => dispatch(Actions.resetLsgiName()),
    resetMcfRrfName: () => dispatch(Actions.resetMcfRrfName()),
    navigateToAddItemCkcPickUp: (data) => dispatch(Actions.navigateToAddItemCkcPickUp(data)),
    setStockInItemData: (data) => dispatch(McfActions.setStockInItemData(data)),
    removeItem: (data) => dispatch(McfActions.removeItem(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(AddCkcPickUp);
