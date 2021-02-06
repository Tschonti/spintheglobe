import {combineReducers} from 'redux'

import {NEW_LOCATION, DELETE_LOCATION, CLEAR_LOCATIONS, BOOL_CHANGE, SLIDER_CHANGE, RESET_PREFS} from './actions'

const locationsReducer = (state = [], action) => {
    switch (action.type) {
        case NEW_LOCATION:
            return [...state, action.payload]
        case CLEAR_LOCATIONS:
            return []
        case DELETE_LOCATION: 
            return state.filter(location => location.place_id !== action.payload)
        default:
            return state
    }
}
const default_preferences = {
    mountains: true,
    beaches: true,
    cities: true,
    mountainLimit: 1500,
    beachLimit: 200,
    cityLimit: 100000
}

const preferencReducer = (state = default_preferences, action) => {
    switch (action.type) {
        case BOOL_CHANGE: {
            const newState = {...state}
            newState[action.payload] = !newState[action.payload]
            return newState
        } case SLIDER_CHANGE: {
            const newState = {...state}
            newState[action.payload.type] = action.payload.data
            return newState
        } case RESET_PREFS:
            return default_preferences
        default:
            return state
    }
}

const reducer = combineReducers({
    locations: locationsReducer,
    preferences: preferencReducer,
  })
  
  export default reducer