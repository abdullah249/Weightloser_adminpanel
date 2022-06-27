import styles from "./Input.module.scss";
import classNames from "classnames";
import Attachment from "icons/Attachment";

const Input = ({ className, value, handleInput, ...rest }) => {
  return (
    <div className={classNames(className, styles.input_container)}>
      <input
        {...rest}
        value={value}
        placeholder="Enter message..."
        onChange={handleInput}
      />
      <Attachment className={styles.icon_attachment} clickable />
    </div>
  );
};

export default Input;
