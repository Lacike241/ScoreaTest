import { createSlice } from '@reduxjs/toolkit'

export interface DefaultState {
    initialized: boolean
}

const initialState: DefaultState = {
    initialized: false,
}

export const defaultSlice = createSlice({
    name: 'default',
    initialState,
    reducers: {
        init: (state) => {
            state.initialized = true
        },
    },
})

// Action creators are generated for each case reducer function
export const { init } = defaultSlice.actions

export default defaultSlice.reducer