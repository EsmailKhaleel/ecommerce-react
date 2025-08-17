import { createSlice } from "@reduxjs/toolkit";


const drawerSlice = createSlice({
    name: "drawer",
    initialState: {
        isMainDrawerOpen: false,
        isProfileDrawerOpen: false,
    },
    reducers: {
        toggleMainDrawer: (state) => {
            state.isMainDrawerOpen = !state.isMainDrawerOpen;
        },
        toggleProfileDrawer: (state) => {
            state.isProfileDrawerOpen = !state.isProfileDrawerOpen;
        },
        setIsMainDrawerOpen: (state, action) => {
            state.isMainDrawerOpen = action.payload;
        },
        setIsProfileDrawerOpen: (state, action) => {
            state.isProfileDrawerOpen = action.payload;
        },
        closeAllDrawers: (state) => {
            state.isMainDrawerOpen = false;
            state.isProfileDrawerOpen = false;
        },
    },
});

export const { toggleMainDrawer, toggleProfileDrawer, closeAllDrawers, setIsMainDrawerOpen, setIsProfileDrawerOpen } = drawerSlice.actions;
export default drawerSlice.reducer;