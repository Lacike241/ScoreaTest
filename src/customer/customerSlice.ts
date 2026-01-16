import {createSlice, type PayloadAction} from '@reduxjs/toolkit'

import type {CalculatedGroups} from "src/types/customerTypes.ts";

export interface CustomerState {
    calculatedGroups: CalculatedGroups
    actualPage: number
}

const initialState: CustomerState = {
    calculatedGroups: {},
    actualPage: 1
}

export const customerSlice = createSlice({
    name: 'customer',
    initialState,
    reducers: {
        setCalculatedGroups: (state, action: PayloadAction<CalculatedGroups>) => {
            state.calculatedGroups = action.payload
        },
        setActualPage: (state, action: PayloadAction<number>)=>{
            state.actualPage = action.payload
        }
    },
})


export const { setCalculatedGroups, setActualPage } = customerSlice.actions

export default customerSlice.reducer