import React, { useState } from "react";
import Input from "components/Input";
import styles from "./ExerciseForm.module.scss";
import ImageUploader from "components/molecules/ImageUploader/Linear";
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
import useBurnerTypes from "hooks/useBurnerTypes";
import useCategories from "hooks/useExerciseCategories";

const validationSchema = Yup.object().shape({
  Title: Yup.string().required("Required"),
  Description: Yup.string().required("Required"),
  duration: Yup.number().required("Required").typeError("Invalid number"),
  Sets: Yup.number().required("Required").typeError("Invalid number"),
  ImageFile: Yup.mixed().required("Required"),
  Details: Yup.string().required("Required"), // type
  Cuisine: Yup.string().required("Required"), // category
});

export const TIMES = ["SET 1", "SET 2", "SET 3", "SET 4"];

const ExerciseForm = () => {
  const [currentPlanId, setCurrentPlanId] = useState(2);
  const [selectedDay, setSelectedDay] = useState(1);
  const [numOfDays, setNumOfDays] = useState(0);
  const [numOfSets, setNumOfSets] = useState(0);
  const burnerTypes = useBurnerTypes();
  const categories = useCategories();

  const [initialValues, setInitialValues] = useState({
    Title: "",
    Description: "",
    duration: "",
    ImageFile: null,
    Sets: "",
    Cuisine: "",
    Details: "",
  });

  const savePlan = async (planPostData) => {
    try {
      let planFormData = new FormData();
      for (let key in planPostData) {
        planFormData.append(key, planPostData[key]);
      }
      const { data } = await apiFormData.post(
        API_URLS.exercise.create,
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
              UserId: 1,
              PlanTypeId: 2,
            };
            const data = await savePlan(planPostData);
            if (data) {
              setCurrentPlanId(data);
              toast.success("Plan saved");
              setNumOfDays(values.duration);
              setNumOfSets(values.Sets);
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
                    placeholder="Plan Name"
                  />
                  <Input
                    error={touched["Details"] && errors["Details"]}
                    placeholder="Description"
                    name="Details"
                    value={values["Details"]}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
                <div className={styles.selects}>
                  <Select
                    onChange={handleChange}
                    onBlur={handleBlur}
                    options={categories}
                    idParam="Description"
                    label="Description"
                    name="Description"
                    value={values["Description"]}
                    placeholder="Category"
                    error={touched["Description"] && errors["Description"]}
                  />
                  <Select
                    onChange={handleChange}
                    onBlur={handleBlur}
                    options={burnerTypes}
                    idParam="Name"
                    name="Cuisine"
                    value={values["Cuisine"]}
                    placeholder="Type"
                    error={touched["Cuisine"] && errors["Cuisine"]}
                  />
                </div>
              </section>
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
                <div>
                  <Typography variant="body_bold" className="mb-1" block>
                    Select Number of Sets
                  </Typography>
                  <Input
                    error={touched["Sets"] && errors["Sets"]}
                    type="number"
                    placeholder="Select no. of Sets"
                    name="Sets"
                    value={values["Sets"]}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
              </section>
            </form>
          );
        }}
      </Formik>
      <section>
        {currentPlanId && (
          <>
            <Weeks
              numOfDays={numOfDays}
              selectedDay={selectedDay}
              setSelectedDay={setSelectedDay}
            />
            <div className={styles.times}>
              {Array.from({ length: numOfSets }, (_, i) => i + 1).map((m) => (
                <Time
                  key={m.toString()}
                  label={"SET " + m}
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

export default ExerciseForm;
