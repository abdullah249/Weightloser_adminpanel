import React, { useState, useEffect, useMemo, useRef } from "react";
import Button from "components/Button";
import Typography from "components/Typography";
import styles from "./Diets.module.scss";
import { SearchInput } from "components/Header";
import { useDispatch, useSelector } from "react-redux";
import { debounce } from "lodash";
import {
  setShowAddForm,
  fetchDiets,
  fetchFoodId,
} from "redux/reducers/diets.reducer";
import api from "api/RequestInterceptor";
import { API_URLS } from "utils/API_URLS";
import { Link } from "react-router-dom";
const Card = React.lazy(() => import("components/Card"));
const Modal = React.lazy(() => import("components/ModalDefault"));
const DietForm = React.lazy(() => import("./DietForm"));
const DietLabel = React.lazy(() => import("./DietLabel"));
const DietsListing = React.lazy(() => import("./DietsListing"));

const Diets = () => {
  const dispatch = useDispatch();
  const searchRef = useRef(null);
  const allData = useSelector((state) => state.diets.data);
  const [data, setData] = useState([]);
  const isModalOpen = useSelector((state) => state.diets.showAddForm);
  const [dashboard, setDashboard] = useState({});

  useEffect(() => {
    dispatch(fetchDiets());
    dispatch(fetchFoodId());
    fetchDashboard();
  }, []);

  useEffect(() => {
    if (searchRef && searchRef.current) {
      filterData(searchRef.current.value);
    } else {
      setData(allData);
    }
  }, [allData]);

  const fetchDashboard = async () => {
    try {
      const { data: res } = await api.get(API_URLS.diet.dashboard);
      setDashboard(res);
    } catch (ex) {
      console.error("Error in fetching diet dashboard", ex.message);
    }
  };

  const filterData = (search) => {
    const filteredData = allData.filter(
      (f) => f.Title.toLowerCase().trim().indexOf(search.toLowerCase()) > -1
    );
    setData(filteredData);
  };

  const handleSearchExercises = (e) => {
    filterData(e.target.value);
  };

  const debouncedResults = useMemo(() => {
    return debounce(handleSearchExercises, 500);
  }, [allData]);

  const onModalClose = () => {
    dispatch(setShowAddForm({ visibility: false }));
    dispatch(fetchDiets());
  };

  return (
    <>
      <Typography className="mb-2" block>
        Diet
      </Typography>
      <Card className="mb-2">
        <div className={styles.base}>
          <div className={styles.left}>
            <Button
              onClick={() =>
                dispatch(
                  setShowAddForm({
                    visibility: true,
                  })
                )
              }
            >
              <Typography>Create New Diet</Typography>
            </Button>
            {/* <Button outlined>
              <Typography>Edit Diet</Typography>
            </Button> */}
          </div>
          <div className={styles.right}>
            <DietLabel title="Total Diets" count={dashboard.totalDiets} />
            <DietLabel
              title="Diets Being Followed"
              count={dashboard.followedPlans}
            />
            <DietLabel title="Keto Diets" count={dashboard.ketoDiets} />
            <DietLabel title="Keto Diets" count={dashboard.ketoDiets} />
            <DietLabel title="Keto Diets" count={dashboard.ketoDiets} />
            <DietLabel title="Active Diets" count={dashboard.activePlans} />
            <DietLabel
              title="In-Active Diets"
              count={dashboard.inactiveDiets}
            />
            <DietLabel title="Vegan Diets" count={dashboard.veganDiets} />
            <DietLabel
              title="Vegetarian Diets"
              count={dashboard.vegetarianDiets}
            />
            <DietLabel title="Desi Diets" count={dashboard.desiDiets} />
          </div>
        </div>
      </Card>

      <Card>
        <div className={styles.head}>
          <SearchInput inputRef={searchRef} onChange={debouncedResults} />{" "}
          {/* <Typography variant="body_bold" className="ml-3">
            Sort By
          </Typography> */}
          <Link to="/diets/stats">
            <Button
              size="sm"
              outlined
              className={styles.btn_stats}
              variant="secondary"
            >
              <Typography variant="small">Stats for Diets</Typography>
            </Button>
          </Link>
        </div>
        {/* <DietsListing title="Top Diets" /> */}
        <DietsListing title="All Diets" data={data} />
      </Card>

      <Modal isOpen={isModalOpen} onClose={onModalClose}>
        <DietForm />
      </Modal>
    </>
  );
};

export default Diets;
