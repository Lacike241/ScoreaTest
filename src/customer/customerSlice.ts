import {createSlice, type PayloadAction} from '@reduxjs/toolkit'

import type {CalculatedGroups, GroupItem} from "src/types/customerTypes.ts";

export interface CustomerState {
    calculatedGroups: CalculatedGroups
    actualPage: number
}

const initialState: CustomerState = {
    calculatedGroups: {},
    actualPage: 1
}

interface ChildPayload {
    data: GroupItem,
    name: string
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
        },
        setRoot: (state, action: PayloadAction<GroupItem>)=>{
            state.calculatedGroups.root = action.payload
        },
        setChild: (state, action: PayloadAction<ChildPayload>)=>{
            state.calculatedGroups[action.payload.name] = action.payload.data
        },
    },
})


export const { setCalculatedGroups, setActualPage, setRoot, setChild } = customerSlice.actions

export default customerSlice.reducer