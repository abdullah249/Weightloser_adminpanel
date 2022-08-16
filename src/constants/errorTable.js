export const excelDietColumns = [
  {
    dataKey: "Day",
    title: "Day",
  },
  {
    dataKey: "Name",
    title: "FoodName",
  },
  {
    dataKey: "DayName",
    title: "DayName",
  },
  {
    dataKey: "MealType",
    title: "MealType",
  },
  {
    dataKey: "Calories",
    title: "Calories",
  },
  {
    dataKey: "ErrorType",
    title: "ErrorType",
    render: ({ ErrorType }) => (
      <ul>
        {ErrorType?.map((err) => (
          <li>{err}</li>
        ))}
      </ul>
    ),
  },
  // {
  //   dataKey: "Protein",
  //   title: "Protein",
  // },
  // {
  //   dataKey: "Carbs",
  //   title: "Total Carbs",
  // },
  // {
  //   dataKey: "SR",
  //   title: "Net Carbs",
  // },
  // {
  //   dataKey: "SatFat",
  //   title: "SaturatedFat",
  // },
  // {
  //   dataKey: "Category",
  //   title: "Category",
  // },
  // {
  //   dataKey: "Cuisine",
  //   title: "Cuisine",
  // },
];
