import { useState, useEffect } from "react";
import styles from "./FoodCard.module.scss";
import Typography from "components/Typography";
import { CARD_PLACEHOLDER_IMAGE } from "api/RequestInterceptor";
import Heart from "icons/Heart";
import Plus from "icons/Plus";
import Context from "icons/Context";
import IconButton from "components/IconButton";
import OutsideClick from "components/OutsideClick";
import api from "api/RequestInterceptor";
import { API_URLS } from "utils/API_URLS";
import toast from "react-hot-toast";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

const FoodCard = ({
  data: food,
  viewOnly,
  withLogging,
  onEditFood = () => {},
  onDeleteFood = () => {},
}) => {
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [logged, setLogged] = useState(false);

  // const fetchLogging = async () => {
  //   try {
  //     const { data } = await api.get(
  //       API_URLS.diet.getLogging(269, food.PlanId)
  //     );
  //     if (data && data.response === "Logged") {
  //       setLogged(true);
  //     } else {
  //       setLogged(false);
  //     }
  //   } catch (ex) {}
  // };

  // useEffect(() => {
  //   console.log("FOOOD", food);
  //   fetchLogging();
  // }, []);

  const deleteFood = async () => {
    confirmAlert({
      title: "Delete Food",
      message: "Are you sure you want to delete?",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            try {
              const { data: res } = await api.post(API_URLS.diet.deleteFood, {
                FoodId: food.FoodId,
                PlanId: food.PlanId,
              });
              if (res) {
                toast.success("Food removed successfully");
                onDeleteFood();
              } else {
                toast.error("An unknow error occurred!");
              }
            } catch (ex) {
              console.error(
                "Error in deleting food from diet plan",
                ex.message
              );
              toast.error(ex.message);
            }
          },
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
    });
  };

  return (
    <div className={styles.food_card__base}>
      {withLogging && (
        <div className={styles.logging}>
          <Typography variant="h3">
            {logged ? "Logged" : "Not Logged"}
          </Typography>
        </div>
      )}

      {!viewOnly && (
        <OutsideClick onClickOutside={() => setShowContextMenu(false)}>
          <IconButton
            className={styles.btn_context_menu}
            onClick={() => setShowContextMenu((prev) => !prev)}
          >
            <Context />
          </IconButton>
          {showContextMenu && (
            <ul className={styles.context_menu}>
              <li onClick={deleteFood}>
                <Typography variant="small">Delete</Typography>
              </li>
              <li onClick={onEditFood}>
                <Typography variant="small">Edit</Typography>
              </li>
            </ul>
          )}
        </OutsideClick>
      )}
      <div className={styles.img_top}>
        <img
          src={`${process.env.REACT_APP_IMAGES_URL}${food.FileName}`}
          onError={(el) => {
            el.target.src = CARD_PLACEHOLDER_IMAGE;
          }}
        />
      </div>
      <div className={styles.content}>
        <div className={styles.head}>
          <Typography variant="small" className={styles.title}>
            {food.Name || "N/A"}
          </Typography>
          <Typography variant="extra_small" className={styles.duration}>
            {food.ServingSize} {food.ServingSize > 1 ? "grams" : "gram"}
          </Typography>
        </div>
        <div className={styles.footer}>
          <Heart className={styles.btn_bookmark} />
          <Plus className={styles.btn_add} />
          <Typography variant="label" className={styles.counts}>
            {food.Calories}{" "}
            <Typography variant="extra_small" className="text-disabled">
              kcal
            </Typography>
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
