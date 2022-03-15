import React, { Component } from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from 'reselect';
import AddMcfSaleView from '../components/AddMcfSaleView';
import * as Actions from '../actions';
import { getUserInfo } from '../../user/selectors';
import { getMcfItemTypes, getMcfItemNames, getMcfAssociations, getRate, getSaleItems } from '../selectors';

class AddMcfSale extends Component {
    render() {
        return <AddMcfSaleView {...this.props} />;
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
    getAssociations: (data) => dispatch(Actions.getAssociations(data)),
    addMcfSale: (data) => dispatch(Actions.addMcfSale(data)),
    resetRate: () => dispatch(Actions.resetRate()),
    navigateToAddItem: (data) => dispatch(Actions.navigateToAddItem(data)),
    setSaleItemData: (data) => dispatch(Actions.setSaleItemData(data)),
    removeSaleItem: (data) => dispatch(Actions.removeSaleItem(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(AddMcfSale);
