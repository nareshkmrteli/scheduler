import React from 'react'
import { createDispatchHook, createSelectorHook, createStoreHook, Provider } from "react-redux"
import { createStore } from "redux"
import { Reducer } from './reducer'

export const schedulerContext = React.createContext({})
export const useSelector = createSelectorHook(schedulerContext)
export const useDispatch = createDispatchHook(schedulerContext)
export const useStore = createStoreHook(schedulerContext)

const schedulerStore = createStore(Reducer)

export function SchedulerContext({children}){
    return(
        <Provider store = {schedulerStore} context = {schedulerContext}>
            {children}
        </Provider>
    )
}
