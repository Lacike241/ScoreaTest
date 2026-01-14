import {createSlice, type PayloadAction} from '@reduxjs/toolkit'

export interface CustomerState {
    calculatedGroups: string[]
    actualPage: number
}

const initialState: CustomerState = {
    calculatedGroups: [],
    actualPage: 1
}

export const customerSlice = createSlice({
    name: 'customer',
    initialState,
    reducers: {
        setCalculatedGroups: (state, action: PayloadAction<string[]>) => {
            state.calculatedGroups = action.payload
        },
        setActualPage: (state, action: PayloadAction<number>)=>{
            state.actualPage = action.payload
        }
    },
})

// Action creators are generated for each case reducer function
export const { setCalculatedGroups, setActualPage } = customerSlice.actions

export default customerSlice.reducer