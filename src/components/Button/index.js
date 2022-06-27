import styles from "./Button.module.scss";

const Button = ({
  outlined,
  circle,
  variant,
  children,
  shape = "",
  size = "md",
  ...rest
}) => {
  return (
    <button
      {...rest}
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
