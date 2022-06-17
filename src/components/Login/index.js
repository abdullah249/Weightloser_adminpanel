import React, { useEffect, useState } from "react";
import styles from "./Login.module.scss";
import Input from "components/Input";
import Button from "components/Button";
import Card from "components/Card";
import Typography from "components/Typography";
import { Formik } from "formik";
import Logo from "icons/Logo";
import * as Yup from "yup";
import toast from "react-hot-toast";
import api from "api/RequestInterceptor";
import { API_URLS } from "utils/API_URLS";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "redux/reducers/user.reducer";
import { useNavigate } from "react-router";

const validationSchema = Yup.object().shape({
  Email: Yup.string().email("Invalid email").required("Required"),
  Password: Yup.string().required("Required"),
});

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const initialValues = {
    Email: "",
    Password: "",
  };
  const user = useSelector((state) => state.user.data);

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user]);
  const [loading, setLoading] = useState(false);
  return (
    <div className={styles.login__base}>
      <Card>
        <Logo className={styles.logo} />
        <Typography className="mb-3" block variant="body_bold">
          Login to your account check CI/CD
        </Typography>
        <Formik
          onSubmit={async (values) => {
            try {
              setLoading(true);
              const { data: res } = await api.post(
                API_URLS.staff.login,
                values
              );
              if (res.staffUser) {
                toast.success(res.response);
                dispatch(setUser(res.staffUser));
                navigate("/");
              } else {
                toast.error(res.response);
              }
            } catch (ex) {
              console.error("Error in login", ex.message);
              toast.error(ex.message);
            } finally {
              setLoading(false);
            }
          }}
          initialValues={initialValues}
          validationSchema={validationSchema}
        >
          {({ handleChange, handleSubmit, values, errors, touched }) => {
            return (
              <form onSubmit={handleSubmit}>
                <div className={styles.creds}>
                  <Input
                    name="Email"
                    value={values["Email"]}
                    onChange={handleChange}
                    type="email"
                    placeholder="Email"
                    error={touched["Email"] && errors["Email"]}
                  />
                  <Input
                    name="Password"
                    value={values["Password"]}
                    onChange={handleChange}
                    type="password"
                    placeholder="Password"
                    error={touched["Password"] && errors["Password"]}
                  />
                  <Button type="submit" disabled={loading} size="sm">
                    <Typography>
                      {loading ? "Please wait..." : "Login"}
                    </Typography>
                  </Button>
                </div>
              </form>
            );
          }}
        </Formik>
      </Card>
    </div>
  );
};

export default Login;
