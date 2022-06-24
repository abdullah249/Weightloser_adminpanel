import styles from "./ChatCard.module.scss";
import variables from "scss/variables";
import { USER_THUMBNAIL } from "api/RequestInterceptor";
import Typography from "components/Typography";
import classNames from "classnames";

export const Indicator = ({ status = "active" }) => {
  const styles = {
    width: "0.4375em",
    height: "0.4375em",
    borderRadius: "100%",
    display: "inline-block",
  };
  const getIndicatorColor = () => {
    switch (status.toLowerCase()) {
      case "active":
        return { backgroundColor: variables.$color_text_success_light };
      case "offline":
        return { backgroundColor: variables.$color_text_dark };
      case "standy":
        return { backgroundColor: variables.$color_warning };
    }
  };

  return (
    <span
      className={styles.indicator}
      style={{ ...styles, ...getIndicatorColor() }}
    ></span>
  );
};

const ChatCard = ({ status = "active", active, ...rest }) => {
  return (
    <div
      {...rest}
      className={classNames(styles.chat_card, `${active ? styles.active : ""}`)}
    >
      <Indicator status={status} />
      <img src={USER_THUMBNAIL} />
      <div>
        <Typography block variant="label_bold" className="mb-xs">
          {rest.name}
        </Typography>
        <Typography block variant="label">
          Exercise Coach
        </Typography>
      </div>
      <div className={styles.status}>
        <Typography variant="label" block className="mb-xs">
          Active
        </Typography>
        <Typography variant="label">5 Min</Typography>
      </div>
    </div>
  );
};

export default ChatCard;
