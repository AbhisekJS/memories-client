import {combineReducers} from 'redux'
import posts from './posts'
import auth from './auth'
//Combine Reducer function
export default combineReducers({
    posts,
    auth,
})