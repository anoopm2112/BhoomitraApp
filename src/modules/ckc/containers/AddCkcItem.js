import React, { Component } from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from 'reselect';
import AddCkcItemView from '../components/AddCkcItemView';
import * as McfActions from '../../mcf/actions';
import { getMcfItemNames, getMcfItemTypes, getItemSubCatogories } from '../../mcf/selectors';

class AddCkcItem extends Component {
    render() {
        return <AddCkcItemView {...this.props} />;
    }
}

const mapStateToProps = createStructuredSelector({
    mcfItemNames: getMcfItemNames,
    mcfItemTypes: getMcfItemTypes,
    itemSubCategories: getItemSubCatogories
});

const mapDispatchToProps = dispatch => ({
    getMcfItemTypes: () => dispatch(McfActions.getMcfItemTypes()),
    getMcfItemName: () => dispatch(McfActions.getMcfItemName()),
    addStockInItem: (data) => dispatch(McfActions.addStockInItem(data)),
    getItemSubCategories: (data) => dispatch(McfActions.getItemSubCategories(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(AddCkcItem);
