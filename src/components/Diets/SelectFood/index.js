import React, { useState, useEffect, useRef } from "react";
import Label from "components/Label";
import Typography from "components/Typography";
import Input from "components/Input";
import styles from "./SelectFood.module.scss";
import Food from "./Food";
import Calories from "./Calories";
import QuantityLabel from "./QuantityLabel";
import classNames from "classnames";
import Button from "components/Button";
import api, { apiFormData, getImage } from "api/RequestInterceptor";
import { API_URLS } from "utils/API_URLS";
import { Formik } from "formik";
import toast from "react-hot-toast";
// import FoodSearch from "./FoodSearch";
import * as Yup from "yup";
import { get, find, update } from "lodash";
import { useSelector } from "react-redux";
import { TIMES as PLAN_TYPES } from "../DietForm";
import FoodForm from "../FoodForm";
import Modal from "components/Modal";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import GroceryItem from "./GroceryItem";
import Select from "components/Select";
import ImageUploader from "./ImageUploader";
import { CARD_PLACEHOLDER_IMAGE } from "api/RequestInterceptor";
import * as XLSX from "xlsx";

const TABS = {
  ALL: "all",
  GROCERY: "Grocery",
  INGREDIENTS: "ingredients",
  PROCEDURE: "procedure",
};

export const nutritions = [
  {
    name: "Calories",
    title: "Calories",
  },
  {
    name: "fat",
    title: "Fat (g)",
  },
  {
    name: "Fiber",
    title: "Fiber (g)",
  },
  {
    name: "Carbs",
    title: "Total Carbs (g)",
  },
  {
    name: "SatFat",
    title: "Sat. Fat (g)",
  },
  {
    name: "Sugar",
    title: "Sugars (g)",
  },
  {
    name: "Protein",
    title: "Protein (g)",
  },
  {
    name: "Sodium",
    title: "Sodium",
  },
  {
    name: "SR",
    title: "Net Carbs (g)",
  },
];

const SelectFood = ({
  label,
  planId,
  foodId,
  selectedDay,
  onFoodAdd = () => {},
  onClose = () => {},
}) => {
  const [openFoodModal, setOpenFoodModal] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const plans = useSelector((state) => state.diets.plans);
  const [currentTab, setCurrentTab] = useState(TABS.ALL);
  const [activeMealType, setActiveMealType] = useState(label);
  const [selectedFood, setSelectedFood] = useState({});
  const [cuisines, setCuisines] = useState([]);
  const [categotries, setCategories] = useState([]);
  const [isAllergy, setIsAllergy] = useState(false);
  const [phase, setPhase] = useState(1);
  const [allergyFood, setAllergyFood] = useState([]);
  const [readExcel, setReadExcel] = useState();
  const allDiets = useSelector((state) => state.diets.data);
  const diet = allDiets.find((f) => f.Id == planId);

  const validationSchema = Yup.object().shape({
    Name: Yup.string().required("Required"),
    ServingSize: Yup.number().required("Required").typeError("Invalid number"),
    Sugar: Yup.number().required("Required").typeError("Invalid number"),
    Fiber: Yup.number().required("Required").typeError("Invalid number"),
    Sodium: Yup.number().required("Required").typeError("Invalid number"),
    SR: Yup.number().required("Required").typeError("Invalid number"),
    SatFat: Yup.number().required("Required").typeError("Invalid number"),
    Protein: Yup.number().required("Required").typeError("Invalid number"),
    Carbs: Yup.number().required("Required").typeError("Invalid number"),
    Calories: Yup.number().required("Required").typeError("Invalid number"),
    fat: Yup.number().required("Required").typeError("Invalid number"),
    AllergicFood: isAllergy
      ? Yup.array()
          .min(1, "Select atleast one allergy food")
          .of(Yup.string().required())
          .required()
      : Yup.array(),
    Cuisine: Yup.string().required("Required"),
    Category: Yup.string().required("Required"),
    // ImageFile: Yup.mixed().required("Required"),
  });

  const dummies = [
    "Pork",
    "Beef",
    "Chicken",
    "Turkey",
    "Lamb",
    "Goat",
    "Diary",
    "Eggs",
    "Soy",
    "Nuts",
    "Bread",
    "Fruits",
    "Non-starchy",
    "Pasta",
    "Legumes",
    "Beans",
    "Starchy vegetables",
    "Seafood",
    "Dairy",
    "Rice",
  ];
  const [initialValues, setInitialValues] = useState({
    Name: "",
    ImageFile: null,
    Day: [],
    ServingSize: selectedFood?.ServingSize,
    DetailsDesc: "",
    Description: "",
    ingredients: ["", "", ""],
    Cuisine: diet?.Cuisine,
    Category: diet?.Description,
    Sugar: "",
    Fiber: "",
    Sodium: "",
    SR: "",
    SatFat: "",
    Protein: "",
    Carbs: "",
    Calories: "",
    fat: "",
    Items: [],
    AllergicFood: [],
    Grocery: [
      {
        title: "Breads and Cereals",
        items: [""],
      },
      {
        title: "Grains",
        items: [""],
      },
      {
        title: "Dairy",
        items: [""],
      },
      {
        title: "Meat and Poultry",
        items: [""],
      },
      {
        title: "Soy Products",
        items: [""],
      },
      {
        title: "Nuts and Seeds",
        items: [""],
      },
      {
        title: "Fruits and Vegetables",
        items: [""],
      },
      {
        title: "Fats and Oil",
        items: [""],
      },
      {
        title: "Baking",
        items: [""],
      },
    ],
  });

  const DAYS = ["M", "T", "W", "TH", "FR", "SA", "SU"];

  const handleExcelFile = (e) => {
    let selectedFile = e.target.files[0];
    let reader = new FileReader();
    reader.readAsArrayBuffer(selectedFile);
    reader.onload = async function (e) {
      if (e.target?.result) {
        const workbook = XLSX.read(e.target?.result, { type: "buffer" });
        const worksheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[worksheetName];
        const data = XLSX.utils.sheet_to_json(worksheet);
        console.log("JSON-DATA", data);
      }
    };
  };

  const shouldVisible = (tab) => {
    if (currentTab === tab && tab === TABS.PROCEDURE) {
      return styles.pl3;
    }
    if (currentTab === tab || currentTab === TABS.ALL) {
      return "";
    }
    return "d-none";
  };

  useEffect(() => {
    const selectedPlan = find(plans, { planId });
    if (selectedPlan) {
      const food = get(selectedPlan?.foods, `${selectedDay}.${label}`);
      if (food) {
      }
      setSelectedFood(food);
    }
  }, [selectedDay]);

  useEffect(() => {
    const selectedPlan = find(plans, { planId });
    if (selectedPlan) {
      const food = get(selectedPlan?.foods || {}, `${selectedDay}.${label}`);
      if (food) {
        setSelectedFood(food);
      }
    }
  }, [selectedDay]);

  useEffect(() => {
    if (foodId) {
      fetchFood(foodId);
    }
  }, [foodId]);

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

  const fetchFood = async (foodId) => {
    try {
      const { data: res } = await api.get(API_URLS.food.getById(foodId));
      const foodDetails = res.foodDetails || {};
      const extraFoodParams = [
        "Id",
        "FoodId",
        "HouseHoldServing",
        "Unit",
        "CreatedAt",
        "ModModifiedAti",
      ];
      for (let key of extraFoodParams) {
        delete foodDetails[key];
      }
      const recipeDetails = res.foodRecipie || {};
      const extraRecipeParams = [
        "Id",
        "PlanId",
        "FoodId",
        "CreatedAt",
        "ModifiedAt",
      ];
      for (let key of extraRecipeParams) {
        delete recipeDetails[key];
      }
      const foodData = { ...foodDetails, ...recipeDetails };
      const strigifyFields = ["Description", "Grocery"];
      try {
        foodData.Grocery = JSON.parse(foodData.Grocery.toString());
      } catch (err) {
        foodData.Grocery = [...initialValues.Grocery];
      }
      foodData.Items = JSON.parse(foodData.Items);
      foodData.Day = [];
      try {
        foodData.ingredients = JSON.parse(recipeDetails.Ingredients);
      } catch (err) {
        foodData.ingredients = [...initialValues.ingredients];
      }
      setIsAllergy(foodData.IsAllergic);
      setAllergyFood(JSON.parse(foodData.AllergicFood));
      setInitialValues(foodData);
    } catch (ex) {
      console.error("Error in fetching food details", ex.message);
    }
  };

  const handleSelectFood = (food) => {
    setSelectedFood(food);
  };

  const handleAddFood = () => {
    setOpenFoodModal(false);
  };

  const saveFoodDetails = async (values) => {
    try {
      const detailsData = {
        FoodId: selectedFood?.Id?.toString(),
        PlanId: planId,
        DetailsDesc: values.DetailsDesc,
        ServingSize: values.ServingSize,
        Procedure: values.Procedure,
        Grocery: JSON.stringify([...values.Grocery]),
      };
      const { data: res } = await api.post(
        API_URLS.food.addDetails,
        detailsData
      );
      if (res && res.response) {
        toast.success("Food details saved");
        toast("Saving food...");
        return true;
      }
      return false;
    } catch (ex) {
      throw ex;
    }
  };

  const saveFood = async (values) => {
    try {
      const formData = new FormData();
      for (let key in values) {
        formData.append(key, values[key]);
      }
      const { data: res } = await apiFormData.post(API_URLS.food.new, formData);
      if (res) {
        if (res.response == "Food already exists") {
          toast.error(res.response);
          return null;
        } else {
          toast("Saving food plan");
          return res.foodId;
        }
      } else {
        toast.error("Some error occurred. Try again!");
      }
    } catch (ex) {
      throw ex;
    }
  };

  const updateFood = async (values) => {
    try {
      const formData = new FormData();
      for (let key in values) {
        formData.append(key, values[key]);
      }
      const { data: res } = await apiFormData.post(
        API_URLS.food.update,
        formData
      );
      if (res) {
        if (res.response == "Food already exists") {
          toast.error(res.response);
          return null;
        } else {
          toast("Food updated");
          return res;
        }
      } else {
        toast.error("Some error occurred. Try again!");
      }
    } catch (ex) {
      throw ex;
    }
  };

  const getPreview = () => {
    try {
      if (foodId) {
        return initialValues.FileName
          ? `${process.env.REACT_APP_IMAGES_URL}${initialValues.FileName}`
          : CARD_PLACEHOLDER_IMAGE;
      }
    } catch (ex) {}
  };
  const saveFoodPlan = async (savedFoodId, ServingSize, phase) => {
    try {
      const { data: res } = await api.post(API_URLS.diet.addFoodPlan, {
        FoodId: savedFoodId,
        PlanId: planId,
        Day: String(selectedDay),
        MealType: activeMealType,
        ServingSize: ServingSize,
        Phase: phase,
      });
      if (res) {
        toast.success("Food plan saved");
        onFoodAdd();
      } else {
        toast.error("An error occurred in saving the food details");
      }
    } catch (ex) {
      throw ex;
    }
  };
  // const handleAllergies = (x) => {
  //   if (allergyFood.includes(x)) {
  //     setAllergyFood(allergyFood.filter((e) => e !== x));
  //   } else setAllergyFood((oldArray) => [...oldArray, x]);
  // };
  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize={true}
      validationSchema={validationSchema}
      onSubmit={async (originalValues) => {
        try {
          setLoading(true);
          if (!selectedDay) {
            toast("Please select a day", {
              style: {
                borderRadius: "10px",
                background: "#333",
                color: "#fff",
              },
            });
            return false;
          }
          let values = { ...originalValues };
          // values.phase = values.Day = selectedDay;
          values.AllergicFood = JSON.stringify([...values.AllergicFood]);
          values.Grocery = values.Grocery.map((m) => {
            return { ...m, items: m.items.filter((f) => f) };
          });
          values.ingredients = values.ingredients.filter((f) => f);
          console.log("ALL VALUES", values);
          let hasError = false;
          if (!values.Procedure) {
            hasError = true;
            toast("Please enter procedure details", {
              style: {
                borderRadius: "10px",
                background: "#333",
                color: "#fff",
              },
            });
          }
          if (!values.ingredients || !values.ingredients.length) {
            hasError = true;
            toast("Please enter ingredients", {
              style: {
                borderRadius: "10px",
                background: "#333",
                color: "#fff",
              },
            });
          }
          if (!values.Grocery || !values.Grocery.length) {
            hasError = true;
            toast("Please enter Grocery details", {
              style: {
                borderRadius: "10px",
                background: "#333",
                color: "#fff",
              },
            });
          }
          values.DetailsDesc = JSON.stringify([...values.ingredients]);
          values.IsAllergic = isAllergy;
          // values.AllergicFood = JSON.stringify(allergyFood);
          values.Grocery = JSON.stringify(values.Grocery);
          values.GroceryList = new Blob([JSON.stringify({ grocery: [] })], {
            type: "application/json",
          });
          delete values.ingredients;
          values.PlanId = planId;
          values.Items = JSON.stringify([...values.Items]);
          if (hasError) {
            return false;
          }
          if (foodId) {
            const res = await updateFood({ ...values, FoodId: foodId });
            if (res) {
              await saveFoodPlan(foodId, values.ServingSize, phase);
            }
            return false;
          }
          const savedFoodId = await saveFood(values);
          if (savedFoodId) {
            await saveFoodPlan(savedFoodId, values.ServingSize, phase);
          }

          // const detailsSaved = await saveFoodDetails(values);
          // if (!detailsSaved) {
          //   toast.error("An error occurred in saving the food details");
          //   return false;
          // }
          // const postData = {
          //   ServingSize: Number(values.ServingSize),
          //   Day: String(selectedDay),
          //   FoodId: String(selectedFood?.FoodId),
          //   DetailsDesc: selectedFood?.DetailsDesc,
          //   MealType: activeMealType,
          //   PlanId: planId,
          // };
          // const { data } = await api.post(API_URLS.food.add, postData);
          // if (data) {
          //   onFoodAdd();
          //   onClose();
          //   toast.success("Food saved");
          // } else {
          //   toast.error("Something went wrong. Try again");
          // }
        } catch (ex) {
          toast.error(ex.message);
          console.error(ex.message);
        } finally {
          setLoading(false);
        }
      }}
    >
      {({
        values,
        setFieldValue,
        handleBlur,
        handleSubmit,
        handleChange,
        errors,
        touched,
      }) => {
        const handleSelectDay = (day) => {
          const days = values["Day"];
          if (days.includes(day)) {
            days.splice(days.indexOf(day), 1);
          } else {
            days.push(day);
          }
          setFieldValue("Day", [...days]);
        };
        const onChangeServingSize = (e) => {
          setFieldValue("ServingSize", e.target.value);
        };
        const handleAddGroceryItem = (value, index) => {
          if (!value) {
            return false;
          }
          let Grocery = [...values.Grocery];
          Grocery[index].items.push("");
          setFieldValue("Grocery", Grocery);
        };
        return (
          <form
            onSubmit={handleSubmit}
            onKeyDown={(e) => {
              if (e.which === 13) {
                e.preventDefault();
              }
            }}
          >
            <div className={styles.base}>
              <div>
                {/* <Typography
          variant="body_bold"
          block
          className={classNames(styles.heading)}
        >
          Select a food
        </Typography> */}
                <div className={styles.tabs}>
                  <Label
                    active={currentTab === TABS.ALL}
                    onClick={() => setCurrentTab(TABS.ALL)}
                  >
                    <Typography variant="label_bold">All Info</Typography>
                  </Label>
                  <Label
                    active={currentTab === TABS.GROCERY}
                    onClick={() => setCurrentTab(TABS.GROCERY)}
                  >
                    <Typography variant="label_bold">Grocery</Typography>
                  </Label>
                  <Label
                    active={currentTab === TABS.INGREDIENTS}
                    onClick={() => setCurrentTab(TABS.INGREDIENTS)}
                  >
                    <Typography variant="label_bold">Ingredients</Typography>
                  </Label>
                  <Label
                    active={currentTab === TABS.PROCEDURE}
                    onClick={() => setCurrentTab(TABS.PROCEDURE)}
                  >
                    <Typography variant="label_bold">Procedure</Typography>
                  </Label>
                  <div className={styles.actions}>
                    <Button
                      type="button"
                      size="sm"
                      outlined
                      onClick={() => setPreviewMode((prev) => !prev)}
                    >
                      {previewMode ? "Close Preview" : "Preview"}
                    </Button>
                    <Button type="submit" size="sm" disabled={loading}>
                      <Typography variant="small_bold">
                        {loading ? "Please wait ..." : "Save"}
                      </Typography>
                    </Button>
                  </div>
                </div>
                {/* <div
                  className={classNames(
                    styles.top,
                    `${selectedFood ? styles.bordered : ""}`
                  )}
                >
                  <FoodSearch
                    setSelectedFood={handleSelectFood}
                    variant="outlined-rounded"
                    placeholder="Search food you want to add"
                  />
                </div> */}
                <>
                  <div className={styles.food}>
                    <div className={styles.image}>
                      {/* <img
                        src={getImage(selectedFood?.FileName)}
                        onError={(e) => {
                          e.target.src =
                            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWmK9tzl5QZD04ETOLral5SFLaYOa3l4-roU7ncpGGfmnAvhR55QPUjCAPZBnF-t6hIcA&usqp=CAU";
                        }}
                      /> */}
                      <ImageUploader
                        viewOnly={previewMode}
                        preview={getPreview()}
                        setFieldValue={setFieldValue}
                        error={touched["ImageFile"] && errors["ImageFile"]}
                      />
                    </div>
                    <Food
                      previewMode={previewMode}
                      data={values}
                      className={styles.item}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      touched={touched}
                      errors={errors}
                      setFieldValue={setFieldValue}
                      items={values.Items}
                    />
                    {/* <Calories
                      count={values?.Calories}
                      className={styles.calories}
                    /> */}
                    <div className={styles.quantities}>
                      <QuantityLabel
                        title="Carbs"
                        quantity={values?.Carbs}
                        left={0}
                      />
                      <QuantityLabel
                        title="Fat"
                        quantity={values?.fat}
                        left={0}
                      />
                      <QuantityLabel
                        title="Protein"
                        quantity={values?.Protein}
                        left={0}
                      />
                      <QuantityLabel
                        title="Other"
                        quantity={
                          Number(values?.Sodium) +
                          Number(values?.Fiber) +
                          Number(values?.SatFat) +
                          Number(values?.SR)
                        }
                        left={0}
                      />
                    </div>
                    <div>
                      <Typography variant="body_bold" className="mb-1" block>
                        Serving Size
                      </Typography>
                      <Input
                        previewMode={previewMode}
                        error={touched["ServingSize"] && errors["ServingSize"]}
                        onBlur={handleBlur}
                        variant="outlined"
                        unit=""
                        name="ServingSize"
                        type="number"
                        value={values["ServingSize"]}
                        onChange={handleChange}
                      />
                    </div>
                    {/* <div>
                      <Typography variant="body_bold" className="mb-1" block>
                        Repeat on these days
                      </Typography>
                      <div className="d-flex gap-1">
                        {DAYS.map((m, index) => (
                          <Label
                            key={m}
                            circle
                            active={values["Day"].includes(index + 1)}
                            onClick={() => handleSelectDay(index + 1)}
                          >
                            <Typography>{m}</Typography>
                          </Label>
                        ))}
                      </div>
                    </div> */}
                    {/* <div className={styles.info}>
                      <Typography
                        variant="body_bold"
                        block
                        style={{ marginBottom: "0.5rem" }}
                      >
                        Info
                      </Typography>
                      <div>
                        <Input
                          previewMode={previewMode}
                          placeholder="Tc:00"
                          name="TC"
                          value={values["TC"]}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched["TC"] && errors["TC"]}
                        />
                        <Input
                          previewMode={previewMode}
                          placeholder="Sr:00"
                          name="SR"
                          value={values["SR"]}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched["SR"] && errors["SR"]}
                        />
                      </div>
                    </div> */}
                    <div className={styles.selects}>
                      <Select
                        previewMode={previewMode}
                        placeholder="Cuisine"
                        options={cuisines}
                        name="Cuisine"
                        idParam="CuisineName"
                        label="CuisineName"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values["Cuisine"]}
                        error={touched["Cuisine"] && errors["Cuisine"]}
                      />
                      <Select
                        previewMode={previewMode}
                        placeholder="Category"
                        options={categotries}
                        name="Category"
                        idParam="Name"
                        value={values["Category"]}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched["Category"] && errors["Category"]}
                      />
                    </div>
                    <div className={styles.planTypes}>
                      {PLAN_TYPES.map((m) => (
                        <Label
                          key={m.label}
                          active={m.label === activeMealType}
                          onClick={() => setActiveMealType(m.label)}
                        >
                          <Typography variant="label_bold">
                            {m.label}
                          </Typography>
                        </Label>
                      ))}
                    </div>
                  </div>

                  <div className={styles.nutrition}>
                    <Typography variant="body_bold">Nutrition Info</Typography>
                    {nutritions.map((m) => (
                      <Input
                        previewMode={previewMode}
                        previewWithLabel
                        key={m.title}
                        value={values[m.name]}
                        onChange={handleChange}
                        name={m.name}
                        onBlur={handleBlur}
                        error={touched[m.name] && errors[m.name]}
                        placeholder={m.title}
                        type="number"
                      />
                    ))}
                  </div>
                  <div className={styles.allergy}>
                    <div className={styles.allergyCheck}>
                      <Typography variant="body_bold">
                        Pick any allergy
                      </Typography>
                      <div
                        className="form-check"
                        onClick={() => setIsAllergy(true)}
                      >
                        <input
                          className="form-check-input"
                          type="radio"
                          name="flexRadioDefault"
                          id="flexRadioDefault1"
                          checked={isAllergy}
                        />
                        <label
                          className="form-check-label"
                          for="flexRadioDefault1"
                        >
                          Yes
                        </label>
                      </div>
                      <div
                        className="form-check"
                        onClick={() => setIsAllergy(false)}
                      >
                        <input
                          className="form-check-input"
                          type="radio"
                          name="flexRadioDefault"
                          id="flexRadioDefault2"
                          checked={!isAllergy}
                        />
                        <label
                          className="form-check-label"
                          for="flexRadioDefault2"
                        >
                          No
                        </label>
                      </div>
                    </div>
                    {isAllergy && (
                      <div
                        className={styles.allergyFood}
                        style={{
                          border: errors["AllergicFood"] && "1px solid #dc3545",
                        }}
                      >
                        {dummies?.map((x) => {
                          return (
                            <div
                              onClick={(e) => {
                                if (e.target.checked) {
                                  let data = [...values["AllergicFood"], x];
                                  setFieldValue("AllergicFood", data);
                                } else {
                                  let data = [...values["AllergicFood"]];
                                  let index = data.indexOf(x);
                                  if (index !== -1) {
                                    data.splice(index, 1);
                                    setFieldValue("AllergicFood", data);
                                  }
                                }
                              }}
                            >
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value=""
                                id={"flexCheckChecked" + x}
                                checked={values.AllergicFood.includes(x)}
                              />
                              <label
                                for="flexCheckChecked"
                                className={styles.allergyItems}
                              >
                                {x}
                              </label>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Phases */}
                  <div>
                    <span>{`Upload Excel (For testing)`}</span>
                    <input type={"file"} onChange={handleExcelFile} />
                  </div>
                  <br />
                  <div className={styles.allergy}>
                    <div className={styles.allergyCheck}>
                      <Typography variant="body_bold">Phases</Typography>
                      {[1, 2, 3, 4].map((value) => (
                        <div
                          className="form-check"
                          onClick={() => setPhase(value)}
                        >
                          <input
                            className="form-check-input"
                            type="radio"
                            name="flexRadioPhase"
                            id={`flexRadioPhase${value}`}
                            checked={phase === value ? true : false}
                          />
                          <label
                            className="form-check-label"
                            for={`flexRadioPhase${value}`}
                          >
                            {value}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* <div className={styles.description}>
                    <Typography variant="body_bold" className="mb-1" block>
                      Description
                    </Typography>
                    <Input
                      onBlur={handleBlur}
                      variant="outlined"
                      name="Description"
                      type="text"
                      value={values["Description"]}
                      onChange={handleChange}
                    />
                  </div> */}

                  <div className={styles.meta}>
                    <div
                      className={classNames(
                        styles.ingredients,
                        shouldVisible(TABS.INGREDIENTS)
                      )}
                    >
                      <Typography variant="body_bold">Ingredients</Typography>
                      <div>
                        {values["ingredients"].map((m, i) => (
                          <Input
                            previewMode={previewMode}
                            placeholder="Enter some description"
                            name={values["ingredients"][i]}
                            key={i.toString()}
                            onChange={(e) =>
                              setFieldValue(`ingredients[${i}]`, e.target.value)
                            }
                            value={m}
                          />
                        ))}
                        {!previewMode && (
                          <Button
                            size="sm"
                            type="button"
                            shape="rect"
                            onClick={() =>
                              setFieldValue("ingredients", [
                                ...values["ingredients"],
                                "",
                              ])
                            }
                          >
                            <Typography variant="label_bold">
                              Add Ingredient
                            </Typography>
                          </Button>
                        )}
                      </div>
                    </div>
                    <div
                      className={classNames(
                        styles.procedure,
                        shouldVisible(TABS.PROCEDURE)
                      )}
                    >
                      <Typography variant="body_bold" block>
                        Procedure
                      </Typography>
                      {previewMode ? (
                        <p
                          dangerouslySetInnerHTML={{ __html: values.Procedure }}
                        />
                      ) : (
                        <CKEditor
                          editor={ClassicEditor}
                          data={values.Procedure}
                          onReady={(editor) => {}}
                          onChange={(event, editor) => {
                            const data = editor.getData();
                            setFieldValue("Procedure", data);
                          }}
                          onBlur={(event, editor) => {}}
                          onFocus={(event, editor) => {}}
                        />
                      )}
                    </div>
                  </div>
                  <section
                    className={classNames(
                      styles.grocery,
                      shouldVisible(TABS.GROCERY)
                    )}
                  >
                    <Typography block className="mb-1" variant="body_bold">
                      Grocery List
                    </Typography>
                    {values.Grocery.map((m, i) => (
                      <GroceryItem
                        previewMode={previewMode}
                        title={m.title}
                        key={m.title}
                        items={m.items}
                        groceryIndex={i}
                        setFieldValue={setFieldValue}
                        onAddItem={(value) => handleAddGroceryItem(value, i)}
                      />
                    ))}
                  </section>
                  <div className={styles.actions}>
                    {/* <Button type="submit" size="sm" disabled={loading}>
                      <Typography variant="small_bold">
                        {loading ? "Please wait ..." : "Log Food"}
                      </Typography>
                    </Button> */}
                  </div>
                </>
              </div>
              <Modal
                isOpen={openFoodModal}
                onClose={() => setOpenFoodModal(false)}
              >
                <FoodForm onFoodAdd={handleAddFood} />
              </Modal>
            </div>
          </form>
        );
      }}
    </Formik>
  );
};

export default SelectFood;
