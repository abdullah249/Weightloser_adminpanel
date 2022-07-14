import { configureStore } from "@reduxjs/toolkit";
import dietsReducer from "./reducers/diets.reducer";
import exercisesReducer from "./reducers/exercises.reducer";
import couponsReducer from "./reducers/coupons.reducer";
import blogsReducer from "./reducers/blogs.reducer";
import mindReducer from "./reducers/mind.reducer";
import restaurantsReducer from "./reducers/restaurants.reducer";
import scheduleReducer from "./reducers/schedule.reducer";
import userReducer from "./reducers/user.reducer";
import firebaseReducer from "./reducers/firebase.reducer";

export const store = configureStore({
  reducer: {
    diets: dietsReducer,
    exercises: exercisesReducer,
    coupons: couponsReducer,
    blogs: blogsReducer,
    mind: mindReducer,
    restaurants: restaurantsReducer,
    schedule: scheduleReducer,
    user: userReducer,
    fireB: firebaseReducer,
  },
});
