export const NEW_LOCATION = 'NEW_LOCATION'
export const DELETE_LOCATION = 'DELETE_LOCATION'
export const CLEAR_LOCATIONS = 'CLEAR_LOCATIONS'

export const BOOL_CHANGE = 'BOOL_CHANGE'
export const SLIDER_CHANGE = 'SLIDER_CHANGE'
export const RESET_PREFS = 'RESET_PREFS'

export const newLocation = newLoc => ({
    type: NEW_LOCATION,
    payload: newLoc
})

export const deleteLoc = key => ({
    type: DELETE_LOCATION,
    payload: key
})

export const clearLocs = () => ({
    type: CLEAR_LOCATIONS,
})

export const boolChange = type => ({
    type: BOOL_CHANGE,
    payload: type
})

export const sliderChange = data => ({
    type: SLIDER_CHANGE,
    payload: data
})

export const resetPrefs = () => ({
    type: RESET_PREFS
})