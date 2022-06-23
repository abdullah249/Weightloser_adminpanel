import React, { useState, useEffect } from "react";
import Input from "components/Input";
import styles from "./MeditationForm.module.scss";
import { useSelector, useDispatch } from "react-redux";
import ImageUploader from "components/molecules/ImageUploader/Linear";
import LargeImageUploader from "components/molecules/ImageUploader";
import Select from "components/Select";
import Typography from "components/Typography";
import classNames from "classnames";
import Weeks from "components/molecules/Weeks";
import Time from "./Time";
import { Formik } from "formik";
import Button from "components/Button";
import toast from "react-hot-toast";
import { apiFormData } from "api/RequestInterceptor";
import { API_URLS } from "utils/API_URLS";
import * as Yup from "yup";
import TextArea from "components/TextArea";
import { fetchMindCategories } from "redux/reducers/mind.reducer";

const validationSchema = Yup.object().shape({
  Title: Yup.string().required("Required"),
  Description: Yup.string().required("Required"),
  duration: Yup.number().required("Required").typeError("Invalid number"),
  ImageFile: Yup.mixed().required("Required"),
});

export const TIMES = ["Morning", "Noon", "Evening", "Night"];

const MeditationFOrm = ({ meditationId }) => {
  const dispatch = useDispatch();
  const mindCatData = useSelector((state) => state.mind.mindCategories);
  const [mindCategories, setMindCategories] = useState([]);
  const [currentPlanId, setCurrentPlanId] = useState(meditationId);
  const [selectedDay, setSelectedDay] = useState(1);
  const [numOfDays, setNumOfDays] = useState(2);
  const [numOfSets, setNumOfSets] = useState(3);

  const [initialValues, setInitialValues] = useState({
    Title: "",
    Description: "",
    duration: "",
    ImageFile: null,
    sets: 0,
  });

  useEffect(() => {
    dispatch(fetchMindCategories());
  }, []);

  useEffect(() => {
    setMindCategories([...mindCatData]);
  }, [meditationId, mindCatData]);

  const savePlan = async (planPostData) => {
    try {
      let planFormData = new FormData();
      for (let key in planPostData) {
        planFormData.append(key, planPostData[key]);
      }
      const { data } = await apiFormData.post(
        API_URLS.mind.meditation.create,
        planFormData
      );
      return data;
    } catch (ex) {
      throw ex;
    }
  };

  return (
    <div className={styles.base}>
      <Formik
        onSubmit={async (values) => {
          try {
            toast("Saving plan");
            const planPostData = {
              ...values,
              Details: "",
              UserId: 1,
              PlanTypeId: 4,
            };
            const data = await savePlan(planPostData);
            if (data) {
              setCurrentPlanId(data);
              toast.success("Plan saved");
              setNumOfDays(values.duration);
              setNumOfSets(values.sets);
            } else {
              toast.error("Something went wrong. Try again");
            }
          } catch (ex) {
            toast.error(ex.message);
            console.error(ex.message);
          }
        }}
        validationSchema={validationSchema}
        initialValues={initialValues}
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
              <div className={styles.actions}>
                <Button size="sm" type="submit">
                  <Typography variant="small_bold">Save</Typography>
                </Button>
              </div>
              {meditationId ? (
                <>
                  <TextArea
                    className={styles.name}
                    variant="no-border"
                    size="lg"
                    placeholder="Meditation Name"
                  />
                  <LargeImageUploader
                    setFieldValue={setFieldValue}
                    error={touched["ImageFile"] && errors["ImageFile"]}
                  />
                </>
              ) : (
                <section className={styles.section_top}>
                  <ImageUploader
                    setFieldValue={setFieldValue}
                    error={touched["ImageFile"] && errors["ImageFile"]}
                  />
                  <div className={styles.inputs}>
                    <Input
                      error={touched["Title"] && errors["Title"]}
                      name="Title"
                      value={values["Title"]}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Meditation Name"
                    />
                    {/* <Input
                      error={touched["Description"] && errors["Description"]}
                      placeholder="Meditation Type"
                      name="Description"
                      value={values["Description"]}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    /> */}
                  </div>
                  <div className={styles.selects}>
                    <Select
                      // previewMode={previewMode}
                      placeholder="Meditation Type"
                      options={mindCategories}
                      name="Description"
                      idParam="Name"
                      label="Description"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values["Description"]}
                      error={touched["Description"] && errors["Description"]}
                    />
                  </div>
                </section>
              )}
              <section className={styles.numbers}>
                <div>
                  <Typography variant="body_bold" className="mb-1" block>
                    Select Number of Days
                  </Typography>
                  <Input
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
            </form>
          );
        }}
      </Formik>
      <section className={styles.days_info}>
        {currentPlanId && (
          <>
            <Weeks
              numOfDays={numOfDays}
              selectedDay={selectedDay}
              setSelectedDay={setSelectedDay}
            />
            <div className={styles.times}>
              {TIMES.map((m) => (
                <Time
                  key={m}
                  label={m}
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

export default MeditationFOrm;
