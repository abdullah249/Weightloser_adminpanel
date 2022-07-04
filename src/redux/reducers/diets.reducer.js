import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "api/RequestInterceptor";
import { API_URLS } from "utils/API_URLS";
import { findIndex, set } from "lodash";

const initialState = {
  data: [],
  plans: [],
  showAddForm: false,
  planId: null,
  foodId: null,
};

export const fetchDiets = createAsyncThunk("blogs/fetchDiets", async () => {
  try {
    const { data: res } = await api.get(API_URLS.diet.list);
    return res.plans;
  } catch (ex) {}
});

export const fetchFoodId = createAsyncThunk("blogs/fetchFoodId", async () => {
  try {
    const { data: res } = await api.get(API_URLS.diet.getFoodId);
    return res.foodId;
  } catch (ex) {}
});

export const dietsSlice = createSlice({
  name: "diets",
  initialState,
  reducers: {
    setShowAddForm: (state, action) => {
      const { visibility, planId } = action.payload;
      state.showAddForm = visibility;
      state.planId = planId || null;
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchDiets.fulfilled, (state, action) => {
      if (action.payload) {
        state.data = action.payload;
      }
    });
    builder.addCase(fetchFoodId.fulfilled, (state, action) => {
      if (action.payload) {
        state.foodId = action.payload;
      }
    });
  },
});

export const { setShowAddForm } = dietsSlice.actions;

export default dietsSlice.reducer;
