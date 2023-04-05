import Header from "components/Header";
import Sidebar from "components/Sidebar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Diets from "pages/diets";
import BlogsPage from "pages/blogs";
import DietFormPage from "pages/diets/new";
import ExercisesPage from "pages/exercises";
import ExerciseStatsPage from "pages/exercises/stats";
import MindStatsPage from "pages/mind/stats";
import DietsStatsPage from "pages/diets/stats";
import CouponsPage from "pages/coupons";
import DashboardPage from "pages/dashboard";
import MindPage from "pages/mind";
import StaffPage from "pages/staff";
import ChatPage from "pages/chat";
import RestaurantsPage from "pages/restaurants";
import CustomersPage from "pages/customers";
import { store } from "redux/store";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import "./App.scss";
import "scss/style.scss";
import { Suspense } from "react";
import BlogDetailsPage from "pages/blogs/details";
import LoginPage from "pages/auth/login";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div>
      {/* <Header />
      <Sidebar /> */}
    </div>
  );
}

function AppBase() {
  return (
    <div className="app">
      <Provider store={store}>
        <BrowserRouter>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/" exact element={<DashboardPage />} />
              <Route exact path="/login" element={<LoginPage />} />
              <Route path="/diets" exact element={<Diets />} />
              <Route
                path="/diets/stats"
                exact
                element={<DietsStatsPage />}
              ></Route>
              <Route path="/diets/new" exact element={<DietFormPage />} />
              <Route path="/blogs" exact element={<BlogsPage />} />
              <Route path="/blogs/:id" exact element={<BlogDetailsPage />} />
              <Route path="/exercises" exact element={<ExercisesPage />} />
              <Route
                path="/exercises/stats"
                exact
                element={<ExerciseStatsPage />}
              />
              <Route path="/coupons" exact element={<CouponsPage />}></Route>
              <Route path="/mind" exact element={<MindPage />}></Route>
              <Route path="/mind/stats" exact element={<MindStatsPage />} />
              <Route path="/staff" exact element={<StaffPage />}></Route>
              <Route path="/chat" exact element={<ChatPage />}></Route>
              <Route
                path="/customers"
                exact
                element={<CustomersPage />}
              ></Route>
              <Route
                path="/restaurants"
                exact
                element={<RestaurantsPage />}
              ></Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
      </Provider>
      <ToastContainer />
      <Toaster />
    </div>
  );
}

export default AppBase;
