import React, { Component } from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from 'reselect';
import AddRrfStockInView from '../components/AddRrfStockInView';
import * as Actions from '../actions';
import * as McfActions from '../../mcf/actions';
import * as CkcActions from '../../ckc/actions';
import { getMcfItemNames, getMcfAssociations, getStockInItems } from '../../mcf/selectors';
import { getUserInfo } from '../../user/selectors';

class AddRrfStockIn extends Component {
    render() {
        return <AddRrfStockInView {...this.props} />;
    }
}

const mapStateToProps = createStructuredSelector({
    mcfItemNames: getMcfItemNames,
    mcfAssociations: getMcfAssociations,
    userInfo: getUserInfo,
    stockInItems: getStockInItems
});

const mapDispatchToProps = dispatch => ({
    addRrfStockIn: (data) => dispatch(Actions.addRrfStockIn(data)),
    getMcfItemName: () => dispatch(McfActions.getMcfItemName()),
    getAssociations: (data) => dispatch(McfActions.getAssociations(data)),
    navigateToAddItemStockIn: (data) => dispatch(McfActions.navigateToAddItemStockIn(data)),
    navigateToAddItemCkcPickUp: () => dispatch(CkcActions.navigateToAddItemCkcPickUp()),
    setStockInItemData: (data) => dispatch(McfActions.setStockInItemData(data)),
    removeItem: (data) => dispatch(McfActions.removeItem(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(AddRrfStockIn);
