import { sweetDishesList } from "constants/sweetDishes";
import { butterCream } from "constants/filtering";

/* Error Handling Variables */
var caloriesErrors = 0;
var sweetDishErrors = 0;
var butterCreamErrors = 0;

/* Per Day Nutrition Values For Phases */
var netCarbs = 0;
var carbs = 0;
var protein = 0;
var fat = 0;
var calories = 0;

const errorHandlingPhase = (el, i, arr) => {
  console.log(
    "Error:",
    "Day=",
    el.Day,
    "MealType=",
    el.MealType,
    "Calories=",
    el.Calories,
    "Protein=",
    el.Protein,
    "Fats=",
    el.fat,
    "SaturatedFats=",
    el.SatFat,
    "TotalCarbs=",
    el.Carbs,
    "NetCarbs=",
    el.SR,
    "Procedure=",
    el.Procedure,
    "arraylength=",
    arr.length,
    "FoodName=",
    arr[i].Name,
    "Food Unique=",
    i <= arr.length - 2 ? arr[i].Name !== arr[i + 1].Name : true
  );
  caloriesErrors++;
  return true;
};

const errorHandlingSweetDishes = (el) => {
  console.log(
    "Sweet Dish Error:",
    "FoodName=",
    el.Name,
    "Day=",
    el.Day,
    "MealType=",
    el.MealType
  );
  sweetDishErrors++;
  return false;
};

const errorHandlingButterCream = (el, el2, ingredientArr) => {
  console.log(
    "Butter Cream Error:",
    "FoodName=",
    el.Name,
    "Day=",
    el.Day,
    "MealType=",
    el.MealType,
    "IngredientList=",
    ingredientArr,
    "Error on ingredient=",
    el2
  );
  butterCreamErrors++;
  return false;
};

export const phaseBasedCalories1_3_4 = (data) => {
  data.map((el, i, arr) => {
    return (el.Day >= 1 && el.Day <= 7) ||
      (el.Day >= 22 && el.Day <= 42) ||
      (el.Day >= 43 && el.Day <= 70)
      ? el.MealType.toLowerCase() === "breakfast" &&
        el.Calories >= 200 &&
        el.Calories <= 400 &&
        el.Protein &&
        el.Procedure &&
        el.Carbs &&
        el.SatFat &&
        el.fat &&
        el.SR
        ? true
        : el.MealType.toLowerCase() === "lunch" &&
          el.Calories >= 400 &&
          el.Calories <= 600 &&
          el.Protein &&
          el.Procedure &&
          el.Carbs &&
          el.SatFat &&
          el.fat &&
          el.SR
        ? true
        : el.MealType.toLowerCase() === "snacks" &&
          el.Calories >= 150 &&
          el.Calories <= 300 &&
          el.Protein &&
          el.Carbs &&
          el.SatFat &&
          el.fat &&
          el.SR
        ? true
        : el.MealType.toLowerCase() === "dinner" &&
          el.Calories >= 400 &&
          el.Calories <= 800 &&
          el.Protein &&
          el.Procedure &&
          el.Carbs &&
          el.SatFat &&
          el.fat &&
          el.SR
        ? true
        : errorHandlingPhase(el, i, arr)
      : el.Day >= 8 &&
        el.Day <= 21 &&
        i <= arr.length - 2 &&
        arr[i].Name !== arr[i + 1].Name
      ? el.MealType.toLowerCase() === "breakfast" &&
        el.Calories >= 200 &&
        el.Calories <= 400 &&
        el.Protein &&
        el.Procedure &&
        el.Carbs &&
        el.SatFat &&
        el.fat &&
        el.SR
        ? true
        : el.MealType.toLowerCase() === "lunch" &&
          el.Calories >= 400 &&
          el.Calories <= 600 &&
          el.Protein &&
          el.Procedure &&
          el.Carbs &&
          el.SatFat &&
          el.fat &&
          el.SR
        ? true
        : el.MealType.toLowerCase() === "snacks" &&
          el.Calories >= 150 &&
          el.Calories <= 300 &&
          el.Protein &&
          el.Carbs &&
          el.SatFat &&
          el.fat &&
          el.SR
        ? true
        : el.MealType.toLowerCase() === "dinner" &&
          el.Carbs === 0 &&
          el.Calories >= 400 &&
          el.Calories <= 800 &&
          el.Protein &&
          el.Procedure &&
          el.SatFat &&
          el.fat &&
          el.SR
        ? true
        : errorHandlingPhase(el, i, arr)
      : true;
  });
  let caloriesSuccess = caloriesErrors > 0 ? false : true;
  console.log("Calories Errors:", caloriesErrors);
  console.log("Calories Success:", caloriesSuccess);
  caloriesErrors = 0;
  return caloriesSuccess;
};

export const checkSweetDishes = (data) => {
  let lowerCaseList = sweetDishesList.map((d) => d.toLowerCase());
  data.map((el) => {
    return lowerCaseList.includes(el.Name.toLowerCase())
      ? errorHandlingSweetDishes(el)
      : true;
  });
  let sweetDishSuccess = sweetDishErrors > 0 ? false : true;
  console.log("Sweet Erros", sweetDishErrors);
  console.log("Sweet Success ", sweetDishSuccess);
  sweetDishErrors = 0;
  return sweetDishSuccess;
};

export const checkCreamAndButter = (data) => {
  let lowerCaseList = butterCream.map((d) => d.toLowerCase());
  data?.map((el) => {
    return el?.DetailsDesc?.map((el2, i, arr) => {
      return lowerCaseList.includes(el2.toLowerCase())
        ? errorHandlingButterCream(el, el2, arr)
        : true;
    });
  });
  let butterCreamSuccess = butterCreamErrors > 0 ? false : true;
  console.log("Butter Cream Errors", butterCreamErrors);
  console.log("Butter Cream Success ", butterCreamSuccess);
  butterCreamErrors = 0;
  return butterCreamSuccess;
};

const perDayNutritionValues = (el) => {
  netCarbs += el.SR;
  protein += el.Protein;
  fat += el.fat;
  calories += el.Calories;
  carbs += el.Carbs;
};

export const balancedDietPhase1 = (data) => {
  var balancedDietPhaseErrors = 0;
  for (let p = 1; p <= 1; p++) {
    data.map((el) => {
      return p === el.Day ? perDayNutritionValues(el) : "";
    });
    if (
      netCarbs < 25 &&
      protein > 100 &&
      fat < 100 &&
      calories >= 1700 &&
      calories <= 1800
    )
      console.log("");
    else balancedDietPhaseErrors++;
    console.log(
      "Net-Carbs",
      netCarbs,
      "Protein",
      protein,
      "Fat",
      fat,
      "Calories",
      calories
    );
    netCarbs = 0;
    protein = 0;
    fat = 0;
    calories = 0;
  }
  let balancedDietPhaseSuccess = balancedDietPhaseErrors > 0 ? false : true;
  console.log("Balanced Diet Phase 1 Errors", balancedDietPhaseErrors);
  console.log("Balanced Diet Phase 1 Success ", balancedDietPhaseSuccess);
  balancedDietPhaseErrors = 0;
  return balancedDietPhaseSuccess;
};

export const balancedDietPhase2 = (data) => {
  var balancedDietPhaseErrors = 0;
  for (let p = 8; p <= 21; p++) {
    data.map((el) => {
      return p === el.Day ? perDayNutritionValues(el) : "";
    });
    if (
      netCarbs < 50 &&
      protein > 100 &&
      fat < 80 &&
      calories >= 1700 &&
      calories > 1500
    )
      console.log("");
    else balancedDietPhaseErrors++;
    netCarbs = 0;
    protein = 0;
    fat = 0;
    calories = 0;
  }
  let balancedDietPhaseSuccess = balancedDietPhaseErrors > 0 ? false : true;
  console.log("Balanced Diet Phase 2 Errors", balancedDietPhaseErrors);
  console.log("Balanced Diet Phase 2 Success ", balancedDietPhaseSuccess);
  balancedDietPhaseErrors = 0;
  return balancedDietPhaseSuccess;
};

export const balancedDietPhase3 = (data) => {
  var balancedDietPhaseErrors = 0;
  for (let p = 22; p <= 42; p++) {
    data.map((el) => {
      return p === el.Day ? perDayNutritionValues(el) : "";
    });
    if (
      carbs >= carbs * 0.45 &&
      carbs >= carbs * 0.65 &&
      protein >= protein * 0.1 &&
      protein >= protein * 0.35 &&
      fat >= fat * 0.2 &&
      fat >= fat * 0.25 &&
      calories >= 1800
    )
      console.log("");
    else balancedDietPhaseErrors++;
    netCarbs = 0;
    protein = 0;
    fat = 0;
    calories = 0;
  }
  let balancedDietPhaseSuccess = balancedDietPhaseErrors > 0 ? false : true;
  console.log("Balanced Diet Phase 3 Errors", balancedDietPhaseErrors);
  console.log("Balanced Diet Phase 3 Success ", balancedDietPhaseSuccess);
  balancedDietPhaseErrors = 0;
  return balancedDietPhaseSuccess;
};

export const balancedDietPhase4 = (data) => {
  var balancedDietPhaseErrors = 0;
  for (let p = 22; p <= 42; p++) {
    data.map((el) => {
      return p === el.Day ? perDayNutritionValues(el) : "";
    });
    if (
      carbs >= carbs * 0.45 &&
      carbs >= carbs * 0.65 &&
      protein >= protein * 0.1 &&
      protein >= protein * 0.35 &&
      fat >= fat * 0.2 &&
      fat >= fat * 0.25 &&
      calories >= 2000
    )
      console.log("");
    else balancedDietPhaseErrors++;
    netCarbs = 0;
    protein = 0;
    fat = 0;
    calories = 0;
  }
  let balancedDietPhaseSuccess = balancedDietPhaseErrors > 0 ? false : true;
  console.log("Balanced Diet Phase 4 Errors", balancedDietPhaseErrors);
  console.log("Balanced Diet Phase 4 Success ", balancedDietPhaseSuccess);
  balancedDietPhaseErrors = 0;
  return balancedDietPhaseSuccess;
};
