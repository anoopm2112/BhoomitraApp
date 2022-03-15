import React, { Component } from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from 'reselect';
import AddItemView from '../components/AddItemView';
import * as Actions from '../actions';
import { getMcfItemNames, getMcfItemTypes, getRate, getItemSubCatogories } from '../selectors';

class AddItem extends Component {
    render() {
        return <AddItemView {...this.props} />;
    }
}

const mapStateToProps = createStructuredSelector({
    mcfItemNames: getMcfItemNames,
    mcfItemTypes: getMcfItemTypes,
    rate: getRate,
    itemSubCategories: getItemSubCatogories
});

const mapDispatchToProps = dispatch => ({
    getMcfItemTypes: () => dispatch(Actions.getMcfItemTypes()),
    getMcfItemName: () => dispatch(Actions.getMcfItemName()),
    addSaleItem: (data) => dispatch(Actions.addSaleItem(data)),
    getRate: (data) => dispatch(Actions.getRate(data)),
    resetRate: () => dispatch(Actions.resetRate()),
    getItemSubCategories: (data) => dispatch(Actions.getItemSubCategories(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(AddItem);
