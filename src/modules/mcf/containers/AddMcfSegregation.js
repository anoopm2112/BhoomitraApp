import React, { Component } from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from 'reselect';
import AddMcfSegregationView from '../components/AddMcfSegregationView';
import * as Actions from '../actions';
import * as McfActions from '../../mcf/actions';
import { getUserInfo } from '../../user/selectors';
import { getSegregationItemNames, getSegregationQuantity } from '../selectors';
import { getMcfItemNames, getItemSubCatogories } from '../../mcf/selectors';

class AddMcfSegregation extends Component {
    render() {
        return <AddMcfSegregationView {...this.props} />;
    }
}

const mapStateToProps = createStructuredSelector({
    mcfItemNames: getMcfItemNames,
    segregationItemNames: getSegregationItemNames,
    segregationQuantity: getSegregationQuantity,
    itemSubCategories: getItemSubCatogories,
    userInfo: getUserInfo,
});

const mapDispatchToProps = dispatch => ({
    getMcfItemName: () => dispatch(McfActions.getMcfItemName()),
    getSegregationItem: () => dispatch(Actions.getSegregationItem()),
    getSegregationQuantity: (data) => dispatch(Actions.getSegregationQuantity(data)),
    setSegregationItem: (data) => dispatch(Actions.setSegregationItem(data)),
    getItemSubCategories: (data) => dispatch(McfActions.getItemSubCategories(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(AddMcfSegregation);
