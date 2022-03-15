import React, { Component } from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from 'reselect';
import AddRrfSaleView from '../components/AddRrfSaleView';
import * as Actions from '../actions';
import * as McfActions from '../../mcf/actions';
import { getUserInfo } from '../../user/selectors';
import { getMcfItemTypes, getMcfItemNames, getMcfAssociations, getRate, getSaleItems } from '../../mcf/selectors';

class AddRrfSale extends Component {
    render() {
        return <AddRrfSaleView {...this.props} />;
    }
}

const mapStateToProps = createStructuredSelector({
    userInfo: getUserInfo,
    mcfItemNames: getMcfItemNames,
    mcfItemTypes: getMcfItemTypes,
    mcfAssociations: getMcfAssociations,
    rate: getRate,
    saleItems: getSaleItems
});

const mapDispatchToProps = dispatch => ({
    getAssociations: (data) => dispatch(McfActions.getAssociations(data)),
    addRrfSale: (data) => dispatch(Actions.addRrfSale(data)),
    resetRate: () => dispatch(McfActions.resetRate()),
    navigateToAddItem: (data) => dispatch(McfActions.navigateToAddItem(data)),
    setSaleItemData: (data) => dispatch(McfActions.setSaleItemData(data)),
    removeSaleItem: (data) => dispatch(McfActions.removeSaleItem(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(AddRrfSale);
