import { useEffect, useState } from "react";
import Typography from "components/Typography";
import styles from "./Time.module.scss";
import Plus from "icons/Plus";
import SelectFood from "components/Diets/SelectFood";
import toast from "react-hot-toast";
import { get, find, set } from "lodash";
import { useSelector } from "react-redux";
import Modal from "components/Modal";
import FoodCard from "../FoodCard";
import GridFiller from "components/GridFiller";
import IconButton from "components/IconButton";
import Input from "components/Input";
import api from "api/RequestInterceptor";
import { API_URLS } from "utils/API_URLS";

const Time = ({
  label,
  planId,
  selectedDay,
  time,
  viewOnly,
  withLogging,
  setCount = () => {},
  count,
}) => {
  const plans = useSelector((state) => state.diets.plans);
  const [isOpen, setIsOpen] = useState(false);
  const [foods, setFoods] = useState([]);
  const [selectedFoodId, setSelectedFoodId] = useState(null);
  const [phase, setPhase] = useState(1);

  const handleOpen = () => {
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
    setIsOpen(true);
  };

  const getFoods = async () => {
    console.log("CALLING ME");
    try {
      if (!planId || !selectedDay) {
        return false;
      }
      const { data } = await api.get(
        API_URLS.diet.getFoods({ planId, day: selectedDay })
      );
      if (data) {
        setFoods(
          data.foods.filter(
            (f) =>
              f.MealType && f.MealType.toLowerCase() === label.toLowerCase()
          )
        );
      } else {
        setFoods([]);
      }
    } catch (ex) {
      console.error(ex.message);
      setFoods([]);
    }
  };

  useEffect(() => {
    getFoods();
  }, [selectedDay, count]);

  const onFoodAdd = async () => {
    setIsOpen(false);
    getFoods();
    setCount();
  };

  useEffect(() => {
    const selectedPlan = find(plans, { planId });
    if (selectedPlan) {
      const food = get(selectedPlan.foods, `${selectedDay}.${label}`);
      if (food) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    } else {
      setIsOpen(false);
    }
  }, [selectedDay]);

  const handleEditFood = (foodId, foodPhase) => {
    setPhase(foodPhase);
    setSelectedFoodId(foodId);
    setIsOpen(true);
    setCount();
  };
  const handleDeleteFood = async () => {
    getFoods();
    setCount();
  };

  return (
    <>
      <div className={styles.base}>
        <div className={styles.content}>
          <div>
            <Typography className={styles.label}>{label}</Typography>
            {/* <Typography>( Select Time )</Typography> */}
            {time && (
              <Input type="time" value={time} disabled variant="no-border" />
            )}
          </div>
          {/* <div className={styles.time_picker} onClick={handleOpen}>
            <Plus className={styles.icon} />
          </div> */}
          <div className={styles.foods}>
            {(!foods || !foods.length) && (
              <Typography
                variant="body_bold"
                className={styles.no_food_placeholder}
              >
                No Meals
              </Typography>
            )}
            {foods?.map((m) => (
              <FoodCard
                withLogging={withLogging}
                viewOnly={viewOnly}
                key={m.FoodId}
                data={m}
                onEditFood={() => handleEditFood(m.FoodId, m.Phase)}
                onDeleteFood={handleDeleteFood}
              />
            ))}
            {!viewOnly && (
              <IconButton size="lg" onClick={handleOpen}>
                <Plus />
              </IconButton>
            )}
            <GridFiller />
          </div>
        </div>
      </div>
      <Modal isOpen={isOpen} size="lg" onClose={() => setIsOpen(false)}>
        <SelectFood
          foodId={selectedFoodId}
          selectedPhase={phase}
          label={label}
          planId={planId}
          selectedDay={selectedDay}
          onFoodAdd={onFoodAdd}
          onClose={() => setIsOpen(false)}
        />
      </Modal>
    </>
  );
};

export default Time;
