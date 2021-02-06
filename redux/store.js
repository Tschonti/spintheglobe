import { createStore, applyMiddleware } from 'redux'
import { persistStore, persistReducer } from 'redux-persist' 
import AsyncStorage from '@react-native-community/async-storage'
import thunk from 'redux-thunk'
import reducer from './reducers'


const persistConfig = {
  key: 'root',
  storage: AsyncStorage
}

const persistedReducer = persistReducer(persistConfig, reducer)

export let store = createStore(persistedReducer, applyMiddleware(thunk))
export let persistor = persistStore(store)

export default store