import React, { useState, useEffect } from "react";
import Input from "components/Input";
import styles from "./DietForm.module.scss";
import ImageUploader from "components/molecules/ImageUploader";
import Typography from "components/Typography";
import classNames from "classnames";
import Weeks from "components/molecules/Weeks";
import Time from "./Time";
import { Formik } from "formik";
import Button from "components/Button";
import toast from "react-hot-toast";
import api, {
  apiFormData,
  CARD_PLACEHOLDER_IMAGE,
} from "api/RequestInterceptor";
import { API_URLS } from "utils/API_URLS";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import TextArea from "components/TextArea";
import Select from "components/Select";
import * as _ from "lodash";

const validationSchema = Yup.object().shape({
  Title: Yup.string().required("Required"),
  Description: Yup.string().required("Required"),
  duration: Yup.number().required("Required").typeError("Invalid number"),
  ImageFile: Yup.mixed().required("Required"),
  Cuisine: Yup.string().required("Required"),
});

const validationSchemaForUpdate = Yup.object().shape({
  Title: Yup.string().required("Required"),
  Description: Yup.string().required("Required"),
  duration: Yup.number().required("Required").typeError("Invalid number"),
  Cuisine: Yup.string().required("Required"),
});

export const TIMES = [
  { label: "Breakfast", time: "08:30" },
  { label: "Lunch", time: "12:30" },
  { label: "Dinner", time: "20:30" },
  { label: "Snacks" },
];

const DietForm = ({ viewOnly }) => {
  const dispatch = useDispatch();
  const [currentPlanId, setCurrentPlanId] = useState(
    useSelector((state) => state.diets.planId)
  );
  const [selectedDay, setSelectedDay] = useState(1);
  const [cuisines, setCuisines] = useState([]);
  const [categotries, setCategories] = useState([]);
  const [numOfDays, setNumOfDays] = useState(null);
  const [editMode, setEditMode] = useState(currentPlanId ? false : true);
  const [initialValues, setInitialValues] = useState({
    Title: "",
    Description: "",
    duration: "",
    ImageFile: "",
    Cuisine: "",
  });
  const [dietData, setDietData] = useState(null);
  const allDiets = useSelector((state) => state.diets.data);
  const [count, setCount] = useState(0);

  useEffect(() => {}, [count]);

  useEffect(() => {
    getPlan(currentPlanId);
  }, [currentPlanId]);

  useEffect(() => {
    fetchCuisines();
    fetchCategories();
  }, []);

  const fetchCuisines = async () => {
    try {
      const { data: res } = await api.get(API_URLS.cuisine.list);
      setCuisines(res);
    } catch (ex) {
      console.error("Error in fetching cuisines", ex.message);
    }
  };
  const fetchCategories = async () => {
    try {
      const { data: res } = await api.get(API_URLS.category.list);
      setCategories(res);
    } catch (ex) {
      console.error("Error in fetching cuisines", ex.message);
    }
  };

  const getPlan = (planId) => {
    if (!planId) {
      return false;
    }
    try {
      const diet = allDiets.find((f) => f.Id == planId);
      setInitialValues({
        Title: diet.Title,
        Description: diet.Description,
        duration: diet.duration,
        FileName: diet.FileName,
        Cuisine: diet.Cuisine,
      });
      setDietData({
        Title: diet.Title,
        Description: diet.Description,
        duration: diet.duration,
        FileName: diet.FileName,
        Cuisine: diet.Cuisine,
      });
      setNumOfDays(diet.duration);
    } catch (ex) {
      console.error(ex.message);
    }
  };

  const savePlan = async (planPostData) => {
    try {
      let planFormData = new FormData();
      for (let key in planPostData) {
        planFormData.append(key, planPostData[key]);
      }
      const { data } = await apiFormData.post(
        API_URLS.diet.create,
        planFormData
      );
      if (data) {
        setCurrentPlanId(data);
        // dispatch(fetchDiets());
        // dispatch(
        //   setShowAddForm({
        //     visibility: true,
        //     planId: data,
        //   })
        // );
        toast.success("Plan saved");
        setDietData({
          Title: planPostData.Title,
          Description: planPostData.Description,
          duration: planPostData.duration,
          FileName: planPostData.FileName,
        });
      } else {
        toast.error("Something went wrong. Try again");
      }
    } catch (ex) {
      throw ex;
    }
  };

  const updatePlan = async (planPostData) => {
    try {
      let postData = _.pickBy(planPostData);
      postData.Id = currentPlanId;
      let planFormData = new FormData();
      for (let key in postData) {
        planFormData.append(key, postData[key]);
      }
      const { data } = await apiFormData.post(
        API_URLS.diet.updata,
        planFormData
      );
      if (data) {
        toast.success("Plan updated");
        // dispatch(fetchDiets());
      } else {
        toast.error("Something went wrong. Try again");
      }
    } catch (ex) {
      throw ex;
    }
  };

  const getPreview = () => {
    try {
      if (currentPlanId) {
        return initialValues.FileName
          ? `${process.env.REACT_APP_IMAGES_URL}${initialValues.FileName}`
          : CARD_PLACEHOLDER_IMAGE;
      }
    } catch (ex) {}
  };

  return (
    <div className={styles.base}>
      <Formik
        onSubmit={async (values) => {
          try {
            toast("Saving plan");
            setNumOfDays(values.duration);
            const planPostData = {
              ...values,
              ImageFile: values.ImageFile,
              Details: "",
              UserId: 1,
              PlanTypeId: 1,
            };
            if (!currentPlanId) {
              await savePlan(planPostData);
            } else {
              await updatePlan(planPostData);
            }
          } catch (ex) {
            toast.error(ex.message);
            console.error(ex.message);
          }
        }}
        validationSchema={
          currentPlanId ? validationSchemaForUpdate : validationSchema
        }
        initialValues={initialValues}
        enableReinitialize={true}
      >
        {({
          handleSubmit,
          handleChange,
          values,
          errors,
          touched,
          handleBlur,
          setFieldValue,
        }) => {
          return (
            <form onSubmit={handleSubmit}>
              <section className={styles.head}>
                <TextArea
                  disabled={!editMode}
                  error={touched["Title"] && errors["Title"]}
                  name="Title"
                  size="lg"
                  as="textarea"
                  variant="no-border"
                  value={values["Title"]}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Plan Name"
                />
                {!viewOnly && (
                  <>
                    {editMode ? (
                      <Button type="submit">
                        <Typography variant="body_bold">Save</Typography>
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setEditMode(true);
                        }}
                      >
                        <Typography variant="body_bold">Edit</Typography>
                      </Button>
                    )}
                  </>
                )}
              </section>
              <section className={styles.image}>
                <ImageUploader
                  viewOnly={!editMode}
                  preview={getPreview()}
                  setFieldValue={setFieldValue}
                  error={touched["ImageFile"] && errors["ImageFile"]}
                />
              </section>
              <section className={styles.section_top}>
                <div className={styles.inputs}>
                  <Select
                    previewMode={!editMode}
                    placeholder="Category"
                    idParam="Name"
                    options={categotries}
                    onChange={handleChange}
                    value={values["Description"]}
                    name="Description"
                    onBlur={handleBlur}
                    error={touched["Description"] && errors["Description"]}
                  />
                  <Select
                    previewMode={!editMode}
                    placeholder="Cuisine"
                    idParam="CuisineName"
                    options={cuisines}
                    onChange={handleChange}
                    label="CuisineName"
                    name="Cuisine"
                    value={values["Cuisine"]}
                    onBlur={handleBlur}
                    error={touched["Cuisine"] && errors["Cuisine"]}
                  />
                </div>
                {/* <div className={styles.selects}>
                  <Select placeholder="Category" />
                  <Select
                    name="Cuisine"
                    value={values["Cuisine"]}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Cuisine"
                  />
                </div> */}
              </section>
              {editMode && (
                <section>
                  <Typography variant="body_bold" className="mb-1" block>
                    Select Number of Days
                  </Typography>
                  <div className={classNames("d-flex gap-1 align-center mb-3")}>
                    {/* <Input placeholder="Select no. of weeks" />
                  <Typography variant="small">or</Typography> */}
                    <Input
                      disabled={!editMode}
                      error={touched["duration"] && errors["duration"]}
                      type="number"
                      placeholder="Select no. of days"
                      name="duration"
                      value={values["duration"]}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </div>
                </section>
              )}
            </form>
          );
        }}
      </Formik>
      <section>
        {currentPlanId && (
          <>
            <Weeks
              viewOnly={editMode}
              numOfDays={numOfDays}
              selectedDay={selectedDay}
              setSelectedDay={setSelectedDay}
            />
            <div className={styles.times}>
              {selectedDay &&
                TIMES.map((m) => (
                  <Time
                    withLogging={viewOnly}
                    setCount={() => setCount((prev) => prev + 1)}
                    count={count}
                    viewOnly={!editMode}
                    key={m.label}
                    label={m.label}
                    time={m.time}
                    planId={currentPlanId}
                    selectedDay={selectedDay}
                  />
                ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default React.memo(DietForm);
