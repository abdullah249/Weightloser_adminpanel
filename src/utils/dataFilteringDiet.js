const errorHandlingPhase = (el, i) => {
  console.log("Error in Calories", i, el.MealType, el.Calories, el.Day);
  return false;
};

export const phaseBasedCalories1_3_4 = (data) => {
  let result = data?.every((el, i) => {
    return (Number(el.Calories) >= 1 && Number(el.Calories) <= 7) ||
      (Number(el.Calories) >= 22 && Number(el.Calories) <= 42) ||
      (Number(el.Day) >= 43 && Number(el.Calories) <= 70)
      ? el.MealType.toLowerCase() === "breakfast" &&
        Number(el.Calories) >= 200 &&
        Number(el.Calories) <= 400
        ? true
        : el.MealType.toLowerCase() === "lunch" &&
          Number(el.Calories) >= 400 &&
          Number(el.Calories) <= 600
        ? true
        : el.MealType.toLowerCase() === "snacks" &&
          Number(el.Calories) >= 150 &&
          Number(el.Calories) <= 300
        ? true
        : el.MealType.toLowerCase() === "dinner" &&
          Number(el.Calories) >= 400 &&
          Number(el.Calories) <= 800
        ? true
        : console.log("YOYO1")
      : Number(el.Calories) >= 8 && Number(el.Calories) <= 21
      ? el.MealType.toLowerCase() === "breakfast" &&
        Number(el.Calories) >= 200 &&
        Number(el.Calories) <= 400
        ? true
        : el.MealType.toLowerCase() === "lunch" &&
          Number(el.Calories) >= 400 &&
          Number(el.Calories) <= 600
        ? true
        : el.MealType.toLowerCase() === "snacks" &&
          Number(el.Calories) >= 150 &&
          Number(el.Calories) <= 300
        ? true
        : el.MealType.toLowerCase() === "dinner" &&
          //  Number(el.Carbs) === 0 &&
          Number(el.Calories) >= 400 &&
          Number(el.Calories) <= 800
        ? true
        : console.log("YOYO2")
      : false;
  });

  console.log("resultDoo", result);
};

export const phaseBasedCalories2 = (data) => {};

export const checkAllNutrition = () => {};

export const checkAllProcedure = () => {};

export const checkSweetDishes = () => {};
