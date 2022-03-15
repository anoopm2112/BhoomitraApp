import React, { Component } from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from 'reselect';
import AddItemStockInView from '../components/AddItemStockInView';
import * as Actions from '../actions';
import { getMcfItemNames, getItemSubCatogories } from '../selectors';

class AddItemStockIn extends Component {
    render() {
        return <AddItemStockInView {...this.props} />;
    }
}

const mapStateToProps = createStructuredSelector({
    mcfItemNames: getMcfItemNames,
    itemSubCategories: getItemSubCatogories
});

const mapDispatchToProps = dispatch => ({
    getMcfItemName: () => dispatch(Actions.getMcfItemName()),
    addStockInItem: (data) => dispatch(Actions.addStockInItem(data)),
    getItemSubCategories: (data) => dispatch(Actions.getItemSubCategories(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(AddItemStockIn);
