import React, { Component } from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from 'reselect';
import AddMcfStockTransferView from '../components/AddMcfStockTransferView';
import * as Actions from '../actions';
import { getMcfFacilityType, getMcfAssociations, getMcfItemNames, getStockInItems } from '../selectors';
import { getUserInfo } from '../../user/selectors';

class AddMcfStockTransfer extends Component {
    render() {
        return <AddMcfStockTransferView {...this.props} />;
    }
}

const mapStateToProps = createStructuredSelector({
    mcfFacilityType: getMcfFacilityType,
    mcfAssociations: getMcfAssociations,
    userInfo: getUserInfo,
    stockInItems: getStockInItems
});

const mapDispatchToProps = dispatch => ({
    getMcfStockTransferTo: (data) => dispatch(Actions.getMcfStockTransferTo(data)),
    getAssociations: (data) => dispatch(Actions.getAssociations(data)),
    addMcfStockTransfer: (data) => dispatch(Actions.addMcfStockTransfer(data)),
    navigateToAddItemStockIn: (data) => dispatch(Actions.navigateToAddItemStockIn(data)),
    setStockInItemData: (data) => dispatch(Actions.setStockInItemData(data)),
    removeItem: (data) => dispatch(Actions.removeItem(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(AddMcfStockTransfer);
