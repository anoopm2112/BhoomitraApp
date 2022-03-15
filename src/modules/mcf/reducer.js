import { types as ActionTypes } from './actions';
import { types as CkcActionTypes } from '../ckc/actions';
import { types as RrfActionTypes } from '../rrf/actions';

const initialState = {
    mcfItemNames: {
        data: [],
        refreshing: false
    },
    mcfFacilityType: {
        stockTransfer: [],
        refreshing: false
    },
    mcfItemTypes: {
        itemType: [],
        refreshing: false
    },
    mcfAssociations: {
        associations: [],
        refreshing: false
    },
    rate: 0,
    stockInItems: [],
    saleItems: [],
    segregationItemNames: {
        data: [],
        refreshing: false
    },
    segregationQuantity: '',
    itemSubCategories: {
        subCategory: [],
        refreshing: false
    }
};

export default (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.GET_MCF_ITEM_NAME_API_REQUEST:
            return Object.assign({}, state, {
                mcfItemNames: {
                    refreshing: true
                }
            });
        case ActionTypes.GET_MCF_ITEM_NAME_API_SUCCESS:
            return Object.assign({}, state, {
                mcfItemNames: {
                    data: action.payload.data,
                    refreshing: false
                }
            });
        case ActionTypes.GET_MCF_ITEM_NAME_API_FAILED:
            return Object.assign({}, state, {
                mcfItemNames: {
                    refreshing: false
                }
            });
        case ActionTypes.GET_MCF_STOCK_TRANSFER_TO_REQUEST:
            return Object.assign({}, state, {
                mcfFacilityType: {
                    refreshing: true
                }
            });
        case ActionTypes.GET_MCF_STOCK_TRANSFER_TO_SUCCESS:
            return Object.assign({}, state, {
                mcfFacilityType: {
                    stockTransfer: action.payload.data,
                    refreshing: false
                }
            });
        case ActionTypes.GET_MCF_STOCK_TRANSFER_TO_FAILED:
            return Object.assign({}, state, {
                mcfFacilityType: {
                    refreshing: false
                }
            });
        case ActionTypes.GET_MCF_ITEM_TYPES_REQUEST:
            return Object.assign({}, state, {
                mcfItemTypes: {
                    refreshing: true
                }
            });
        case ActionTypes.GET_MCF_ITEM_TYPES_SUCCESS:
            return Object.assign({}, state, {
                mcfItemTypes: {
                    itemType: action.payload.data,
                    refreshing: false
                }
            });
        case ActionTypes.GET_MCF_ITEM_TYPES_FAILED:
            return Object.assign({}, state, {
                mcfItemTypes: {
                    refreshing: false
                }
            });
        case ActionTypes.GET_MCF_ASSOCIATIONS_API_REQUEST:
            return Object.assign({}, state, {
                mcfAssociations: {
                    refreshing: true
                }
            });
        case ActionTypes.GET_MCF_ASSOCIATIONS_API_SUCCESS:
            return Object.assign({}, state, {
                mcfAssociations: {
                    associations: action.payload.data,
                    refreshing: false
                }
            });
        case ActionTypes.GET_MCF_ASSOCIATIONS_API_FAILED:
            return Object.assign({}, state, {
                mcfAssociations: {
                    refreshing: false
                }
            });
        case ActionTypes.GET_RATE_API_REQUEST:
            return Object.assign({}, state, {
                rate: 0
            });
        case ActionTypes.GET_RATE_API_SUCCESS:
            return Object.assign({}, state, {
                rate: action.payload.data,
            });
        case ActionTypes.GET_RATE_API_FAILED:
            return Object.assign({}, state, {
                rate: 0
            });
        case ActionTypes.RESET_RATE:
            return Object.assign({}, state, {
                rate: 0
            });
        case ActionTypes.SET_STOCK_IN_ITEM:
            return Object.assign({}, state, {
                stockInItems: action.payload.data,
            });
        case ActionTypes.ADD_MCF_STOCK_IN_API_SUCCESS:
        case CkcActionTypes.SAVE_PICK_UP_API_SUCCESS:
            return Object.assign({}, state, {
                stockInItems: [],
            });
        case ActionTypes.ADD_MCF_SALE_API_SUCCESS:
        case CkcActionTypes.SAVE_CKC_SALE_API_SUCCESS:
        case RrfActionTypes.ADD_RRF_SALE_API_SUCCESS:
            return Object.assign({}, state, {
                saleItems: [],
            });
        case ActionTypes.SET_SALE_ITEM:
            return Object.assign({}, state, {
                saleItems: action.payload.data,
            });
        case ActionTypes.GET_SEGREGATION_ITEM_TYPES_REQUEST:
            return Object.assign({}, state, {
                segregationItemNames: {
                    data: [],
                    refreshing: true
                }
            });
        case ActionTypes.GET_SEGREGATION_ITEM_TYPES_SUCCESS:
            return Object.assign({}, state, {
                segregationItemNames: {
                    data: action.payload.data,
                    refreshing: false
                }
            });
        case ActionTypes.GET_SEGREGATION_ITEM_TYPES_FAILED:
            return Object.assign({}, state, {
                segregationItemNames: {
                    data: [],
                    refreshing: false
                }
            });
        case ActionTypes.SET_SEGREGATION_QUANTITY:
            return Object.assign({}, state, {
                segregationQuantity: action.payload.data
            });
        case ActionTypes.GET_ITEM_SUB_CATEGORIES_REQUEST:
            return Object.assign({}, state, {
                itemSubCategories: {
                    subCategory: [],
                    refreshing: false
                }
            });
        case ActionTypes.GET_ITEM_SUB_CATEGORIES_SUCCESS:
            return Object.assign({}, state, {
                itemSubCategories: {
                    subCategory: action.payload.data,
                    refreshing: false
                }
            });
        case ActionTypes.GET_ITEM_SUB_CATEGORIES_FAILED:
            return Object.assign({}, state, {
                itemSubCategories: {
                    subCategory: [],
                    refreshing: false
                }
            });
        default:
            return state;
    }
};
