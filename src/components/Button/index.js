import styles from "./Button.module.scss";

const Button = ({
  outlined,
  circle,
  variant,
  children,
  shape = "",
  size = "md",
  type,
  handleSubmit,
  ...rest
}) => {
  return (
    <button
      {...rest}
      type={type}
      onClick={handleSubmit}
      className={`${styles.button} ${
        outlined ? styles.outlined : styles.solid
      } ${styles[size]} ${styles[shape]} ${circle ? styles.circle : ""} ${
        styles[variant]
      }`}
    >
      {children}
    </button>
  );
};

export default Button;
