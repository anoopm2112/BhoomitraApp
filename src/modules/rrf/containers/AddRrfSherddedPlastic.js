import React, { Component } from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from 'reselect';
import AddRrfSherddedPlasticView from '../components/AddRrfSherddedPlasticView';
import * as Actions from '../actions';
import { getUserInfo } from '../../user/selectors';
import * as McfActions from '../../mcf/actions';
import { getMcfItemNames, getItemSubCatogories } from '../../mcf/selectors';

class AddRrfSherddedPlastic extends Component {
    render() {
        return <AddRrfSherddedPlasticView {...this.props} />;
    }
}

const mapStateToProps = createStructuredSelector({
    mcfItemNames: getMcfItemNames,
    itemSubCategories: getItemSubCatogories,
    userInfo: getUserInfo,
});

const mapDispatchToProps = dispatch => ({
    saveShreddedPlastic: (data) => dispatch(Actions.saveShreddedPlastic(data)),
    getMcfItemName: () => dispatch(McfActions.getMcfItemName()),
    getItemSubCategories: (data) => dispatch(McfActions.getItemSubCategories(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(AddRrfSherddedPlastic);
