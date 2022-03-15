import { actions } from '../../common';

const { action } = actions;

export const types = {
    INITIALIZE: 'Splash/INITIALIZE',
    TAKE_TOUR_THROUGH_APP: 'Splash/TAKE_TOUR_THROUGH_APP',
    SET_APP_TOUR_DATA: 'Splash/SET_APP_TOUR_DATA'
};

export function initialize(data) {
    return action(types.INITIALIZE, { data });
}

export function takeTourThroughApp() {
    return action(types.TAKE_TOUR_THROUGH_APP);
}

export function setAppTourData(data) {
    return action(types.SET_APP_TOUR_DATA, { data });
}
