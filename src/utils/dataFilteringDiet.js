import { sweetDishesList } from "constants/sweetDishes";
import { butterCream } from "constants/filtering";

/* Error Handling Variables */
var caloriesErrors = 0;
var sweetDishErrors = 0;
var butterCreamErrors = 0;
var indexOfErrors = [];

/* Per Day Nutrition Values For Phases */
var netCarbs = 0;
var carbs = 0;
var protein = 0;
var fat = 0;
var calories = 0;

/* Additional Checks on Phases */
var phase1MondayCalories = 0;
var phase2ThursdayCalories = 0;
var phase1CategoryType = "";

const errorHandlingPhase = (el, i, arr) => {
  console.log(
    "Phase Meal Error:",
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
  indexOfErrors.push(el);
  caloriesErrors++;
  return true;
};

const errorHandlingSweetDishes = (el, i) => {
  console.log(
    "Sweet Dish Error:",
    "FoodName=",
    el.Name,
    "Day=",
    el.Day,
    "MealType=",
    el.MealType
  );
  indexOfErrors.push(el);
  sweetDishErrors++;
  return false;
};

const errorHandlingButterCream = (el, el2, ingredientArr, i) => {
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
  indexOfErrors.push(el);
  butterCreamErrors++;
  return false;
};

/* Error Handling Function */
export const phaseBasedCalories_1_2_3_4 = (data) => {
  data.map((el, i, arr) => {
    return (el.Day >= 1 && el.Day <= 7) /* Phase 1 ( 1 Week ) */ ||
      (el.Day >= 22 && el.Day <= 42) /* Phase 3 ( 3 Weeks ) */ ||
      (el.Day >= 43 && el.Day <= 70) /* Phase 4 ( 4 Weeks ) */
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
        arr[i].Name !==
          arr[i + 1].Name /* Phase 2 ( 2 Weeks ) With Unique Food Name*/
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

/* To Check Whether a Food is a Sweet Dish or not */
export const checkSweetDishes = (data) => {
  let lowerCaseList = sweetDishesList.map((d) => d.toLowerCase());
  data.map((el, i) => {
    return lowerCaseList.includes(el.Name.toLowerCase())
      ? errorHandlingSweetDishes(el, i)
      : true;
  });
  let sweetDishSuccess = sweetDishErrors > 0 ? false : true;
  console.log("Sweet Erros", sweetDishErrors);
  console.log("Sweet Success ", sweetDishSuccess);
  sweetDishErrors = 0;
  return sweetDishSuccess;
};

/* To Check Whether a Food Name contain Cream and Butter */
export const checkCreamAndButter = (data) => {
  let lowerCaseList = butterCream.map((d) => d.toLowerCase());
  data?.map((el, i) => {
    return el?.DetailsDesc?.map((el2, arr) => {
      return lowerCaseList.includes(el2.toLowerCase())
        ? errorHandlingButterCream(el, el2, arr, i)
        : true;
    });
  });
  let butterCreamSuccess = butterCreamErrors > 0 ? false : true;
  console.log("Butter Cream Errors", butterCreamErrors);
  console.log("Butter Cream Success ", butterCreamSuccess);
  butterCreamErrors = 0;
  return butterCreamSuccess;
};

const perDayNutritionValues = (el, p) => {
  netCarbs += el.SR;
  protein += el.Protein;
  fat += el.fat;
  calories += el.Calories;
  carbs += el.Carbs;
  if (p >= 1 && p <= 7 && el.DayName.toLowerCase() === "monday") {
    phase1MondayCalories += el.Calories;
    phase1CategoryType = el.Category;
  }
  if (p >= 8 && p <= 14 && el.DayName.toLowerCase() === "thursday") {
    phase2ThursdayCalories += el.Calories;
  }
};

export const balancedDietPhase1 = (data) => {
  var balancedDietPhaseErrors = 0;
  for (let p = 1; p <= 7; p++) {
    data.map((el) => {
      return p === el.Day && perDayNutritionValues(el, p);
    });
    if (
      phase1CategoryType.toLowerCase() !== "vegetarian" &&
      netCarbs <= 25 &&
      protein > 100 &&
      fat < 100 &&
      calories >= 1700 &&
      calories <= 1800
    )
      console.log("Except vegetarian Phase 1 NetCarbs", p);
    else if (
      phase1CategoryType.toLowerCase() === "vegetarian" &&
      netCarbs <= 50 &&
      protein > 100 &&
      fat < 100 &&
      calories >= 1700 &&
      calories <= 1800
    ) {
      console.log("Vegetarian Phase 1 NetCarbs", true);
    } else {
      console.log("Error in Phase 1 NetCarbs", p, phase1CategoryType);
      indexOfErrors.push({ Day: p });
      balancedDietPhaseErrors++;
    }
    console.log(
      "Phase 1:",
      "Net-Carbs",
      netCarbs,
      "Protein",
      protein,
      "Fat",
      fat,
      "Calories",
      calories,
      "Phase1Monday",
      phase1MondayCalories,
      phase2ThursdayCalories
    );
    netCarbs = 0;
    protein = 0;
    fat = 0;
    calories = 0;
    phase1CategoryType = "";
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
      return p === el.Day && perDayNutritionValues(el, p);
    });
    if (
      netCarbs <= 50 &&
      protein > 100 &&
      fat < 80 &&
      calories >= 1700 &&
      calories <= 1500
    )
      console.log("");
    else {
      balancedDietPhaseErrors++;
      indexOfErrors.push({ Day: p });
    }
    console.log(
      "Phase 2:",
      "Net-Carbs",
      netCarbs,
      "Protein",
      protein,
      "Fat",
      fat,
      "Calories",
      calories,
      "Phase2Thursday",
      phase2ThursdayCalories
    );
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
      return p === el.Day && perDayNutritionValues(el, p);
    });
    if (
      carbs >= carbs * 0.45 &&
      carbs <= carbs * 0.65 &&
      protein >= protein * 0.1 &&
      protein <= protein * 0.35 &&
      fat >= fat * 0.2 &&
      fat <= fat * 0.25 &&
      calories <= 1800 &&
      calories == phase1MondayCalories
    )
      console.log(
        "Phase 3:",
        "Net-Carbs",
        netCarbs,
        "Protein",
        protein,
        "Fat",
        fat,
        "Calories",
        calories
      );
    else {
      balancedDietPhaseErrors++;
      indexOfErrors.push({ Day: p });
    }
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
  for (let p = 43; p <= 70; p++) {
    data.map((el) => {
      return p === el.Day && perDayNutritionValues(el, p);
    });
    if (
      carbs >= carbs * 0.45 &&
      carbs <= carbs * 0.65 &&
      protein >= protein * 0.1 &&
      protein <= protein * 0.35 &&
      fat >= fat * 0.2 &&
      fat <= fat * 0.25 &&
      calories <= 2000 &&
      calories == phase1MondayCalories &&
      calories == phase2ThursdayCalories
    )
      console.log(
        "Phase 4:",
        "Net-Carbs",
        netCarbs,
        "Protein",
        protein,
        "Fat",
        fat,
        "Calories",
        calories
      );
    else {
      balancedDietPhaseErrors++;
      indexOfErrors.push({ Day: p });
    }
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

/* To get list of all errors found in Excel Data */
export const totalErrors = () => {
  return indexOfErrors;
};
