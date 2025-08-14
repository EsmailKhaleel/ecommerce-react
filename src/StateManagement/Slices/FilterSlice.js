import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    searchTerm: '',
    selectedCategory: 'All',
    sortOrder: 'desc',
    selectedPriceRange: null,
    selectedRating: null,
    expandedSections: {
        categories: true,
        price: true,
        sort: true,
        rating: true,
    }
};

const filterSlice = createSlice({
    name: 'filters',
    initialState,
    reducers: {
        setSearchTerm: (state, action) => {
            state.searchTerm = action.payload;
        },
        setSelectedCategory: (state, action) => {
            state.selectedCategory = action.payload;
        },
        setSortOrder: (state, action) => {
            state.sortOrder = action.payload;
        },
        setSelectedPriceRange: (state, action) => {
            state.selectedPriceRange = action.payload;
        },
        setSelectedRating: (state, action) => {
            state.selectedRating = action.payload;
        },
        clearFilters: (state) => {
            state.searchTerm = '';
            state.selectedCategory = 'All';
            state.sortOrder = 'desc';
            state.selectedPriceRange = null;
            state.selectedRating = null;
        },
        toggleSection: (state, action) => {
            const section = action.payload;
            state.expandedSections[section] = !state.expandedSections[section];
        }
    }
});

export const { 
    setSearchTerm, 
    setSelectedCategory, 
    setSortOrder, 
    setSelectedPriceRange, 
    setSelectedRating,
    clearFilters,
    toggleSection
} = filterSlice.actions;

export default filterSlice.reducer;