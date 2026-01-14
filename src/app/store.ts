import { configureStore } from '@reduxjs/toolkit'

import CustomerReducer from 'src/customer/customerSlice'
import DefaultSliceReducer from './defaultSlice'

export const store = configureStore({
    reducer: {
        app: DefaultSliceReducer,
        customer: CustomerReducer
    },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch