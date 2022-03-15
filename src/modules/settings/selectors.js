import flow from 'lodash/fp/flow';
import { STATE_REDUCER_KEY } from './constants';

export const getSettings = state => state[STATE_REDUCER_KEY];

const developerOptions = settings => settings.developerOptions;
export const getDeveloperOptions = flow(getSettings, developerOptions);

const animationData = settings => settings.animationData;
export const getAnimationData = flow(getSettings, animationData);