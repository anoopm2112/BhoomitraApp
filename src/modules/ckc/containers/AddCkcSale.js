import React, { Component } from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from 'reselect';
import AddCkcSaleView from '../components/AddCkcSaleView';
import * as Actions from '../actions';
import * as McfActions from '../../mcf/actions';
import { getUserInfo } from '../../user/selectors';
import { getLanguage } from '../../language/selectors';
import { getMcfItemTypes, getMcfItemNames, getMcfAssociations, getRate, getSaleItems } from '../../mcf/selectors';
import { getCkcDoDownsName } from '../selectors';

class AddCkcSale extends Component {
    render() {
        return <AddCkcSaleView {...this.props} />;
    }
}

const mapStateToProps = createStructuredSelector({
    language: getLanguage,
    userInfo: getUserInfo,
    mcfItemNames: getMcfItemNames,
    mcfItemTypes: getMcfItemTypes,
    mcfAssociations: getMcfAssociations,
    rate: getRate,
    goDownsName: getCkcDoDownsName,
    saleItems: getSaleItems
});

const mapDispatchToProps = dispatch => ({
    getAssociations: (data) => dispatch(McfActions.getAssociations(data)),
    addCkcSale: (data) => dispatch(Actions.addCkcSale(data)),
    getGoDown: (data) => dispatch(Actions.getGoDown(data)),
    resetRate: () => dispatch(McfActions.resetRate()),
    navigateToAddItem: (data) => dispatch(McfActions.navigateToAddItem(data)),
    setSaleItemData: (data) => dispatch(McfActions.setSaleItemData(data)),
    removeSaleItem: (data) => dispatch(McfActions.removeSaleItem(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(AddCkcSale);
