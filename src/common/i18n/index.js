import I18n from 'i18n-js';

import en_IN from './locales/en_IN';
import ml_IN from './locales/ml_IN';
import mr_IN from './locales/mr_IN';

I18n.fallbacks = true;
I18n.translations = {
    en_IN,
    ml_IN,
    mr_IN
};

export default I18n;
