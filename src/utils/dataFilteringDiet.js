const errorHandlingPhase = (el, i) => {
  console.log("Error in Calories", i, el.MealType, el.Calories, el.Day);
  return false;
};

export const phaseBasedCalories1_3_4 = (data) => {
  let result = data.every((el, i) => {
    return (el.Day >= 1 && el.Day <= 7) ||
      (el.Day >= 22 && el.Day <= 42) ||
      (el.Day >= 43 && el.Day <= 70)
      ? el.MealType.toLowerCase() === "breakfast" &&
        el.Calories >= 200 &&
        el.Calories <= 400
        ? true
        : el.MealType.toLowerCase() === "lunch" &&
          el.Calories >= 400 &&
          el.Calories <= 600
        ? true
        : el.MealType.toLowerCase() === "snacks" &&
          el.Calories >= 150 &&
          el.Calories <= 300
        ? true
        : el.MealType.toLowerCase() === "dinner" &&
          el.Calories >= 400 &&
          el.Calories <= 800
        ? true
        : errorHandlingPhase(el, i)
      : el.Day >= 8 && el.Day <= 21
      ? el.MealType.toLowerCase() === "breakfast" &&
        el.Calories >= 200 &&
        el.Calories <= 400
        ? true
        : el.MealType.toLowerCase() === "lunch" &&
          el.Calories >= 400 &&
          el.Calories <= 600
        ? true
        : el.MealType.toLowerCase() === "snacks" &&
          el.Calories >= 150 &&
          el.Calories <= 300
        ? true
        : el.MealType.toLowerCase() === "dinner" &&
          el.Carbs === 0 &&
          el.Calories >= 400 &&
          el.Calories <= 800
        ? true
        : errorHandlingPhase(el, i)
      : false;
  });

  console.log("resultDoo", result);
};

export const phaseBasedCalories2 = (data) => {};

export const checkAllNutrition = () => {};

export const checkAllProcedure = () => {};

export const checkSweetDishes = () => {};
