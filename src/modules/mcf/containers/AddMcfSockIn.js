import React, { Component } from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from 'reselect';
import AddMcfStockInView from '../components/AddMcfStockInView';
import * as Actions from '../actions';
import { getMcfItemNames, getMcfAssociations, getStockInItems } from '../selectors';
import { getUserInfo } from '../../user/selectors';

class AddMcfStockIn extends Component {
    render() {
        return <AddMcfStockInView {...this.props} />;
    }
}

const mapStateToProps = createStructuredSelector({
    mcfItemNames: getMcfItemNames,
    mcfAssociations: getMcfAssociations,
    userInfo: getUserInfo,
    stockInItems: getStockInItems
});

const mapDispatchToProps = dispatch => ({
    addMcfStockIn: (data) => dispatch(Actions.addMcfStockIn(data)),
    getMcfItemName: () => dispatch(Actions.getMcfItemName()),
    getAssociations: (data) => dispatch(Actions.getAssociations(data)),
    navigateToAddItemStockIn: (data) => dispatch(Actions.navigateToAddItemStockIn(data)),
    setStockInItemData: (data) => dispatch(Actions.setStockInItemData(data)),
    removeItem: (data) => dispatch(Actions.removeItem(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(AddMcfStockIn);
