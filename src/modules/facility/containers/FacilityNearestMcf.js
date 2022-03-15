import React, { Component } from 'react';
import FacilityNearestMcfView from '../components/FacilityNearestMcfView';
import Geolocation from 'react-native-geolocation-service';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import * as FacilityActions from '../../facility/actions';
import { getFacilityList } from '../selectors';
import { AppState } from 'react-native';

class FacilityNearestMcf extends Component {

    constructor(props) {
        super(props);
        this.state = { appState: AppState.currentState };
    }

    componentDidMount() {
        AppState.addEventListener(
            'change',
            this._handleAppStateChange
        );
    }

    componentWillUnmount() {
        AppState.removeEventListener(
            'change',
            this._handleAppStateChange
        );
    }

    _handleAppStateChange = (nextAppState) => {
        if (
            this.state.appState.match(/inactive|background/) &&
            nextAppState === 'active'
        ) {
            console.log('App has come to the foreground!');
            Geolocation.getCurrentPosition((coords) => {
                this.props.fetchNearestMcf(coords.coords);
            }, (error) => {
            }, { enableHighAccuracy: true, maximumAge: 0 });
        }
        this.setState({ appState: nextAppState });
    };

    render() {
        return (
            <FacilityNearestMcfView {...this.props} />
        );
    }
}
const mapStateToProps = createStructuredSelector({
    facility: getFacilityList
});

const mapDispatchToProps = (dispatch) => ({
    fetchNearestMcf: (data) => dispatch(FacilityActions.fetchNearestMcf(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(FacilityNearestMcf);
