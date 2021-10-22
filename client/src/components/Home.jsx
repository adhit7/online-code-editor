import React, { useState, useEffect } from "react";
import {
  Container,
  makeStyles,
  Typography,
  TextField,
} from "@material-ui/core";
import { Card, CardActions, CardContent, Button } from "@material-ui/core";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import Dashboard from "./Dashboard";
import url from "../serverInfo";
import { Alert } from "@material-ui/lab";
const axios = require("axios");

const useStyles = makeStyles((theme) => ({
  containerContent: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "80vh",
    // backgroundColor: "yellow",
  },

  root: {
    // flex: "400 400",
    // maxWidth: 400,
    // maxHeight: 300,
    padding: theme.spacing(1.5),
  },

  cardContent: {},

  textField: {
    marginBottom: theme.spacing(2),
  },

  btn: {
    textAlign: "right",
  },
}));

export default function Home(props) {
  const {
    isAuth,
    setIsAuth,
    topHeading,
    setTopHeading,
    authToken,
    setAuthToken,
    setSidebarHeading,
  } = props;

  const [formBody, setFormBody] = useState({
    email: "",
    pass: "",
  });

  // Alert Code
  const [showAlert, setShowAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const giveAlert = () => {
    if (showAlert) {
      return <Alert severity="error">{alertMsg}</Alert>;
    }
  };

  // Check if user is already loggedin on startup
  useEffect(() => {
    setTopHeading("Home");
    if (localStorage.getItem("authToken") != null) {
      setAuthToken(localStorage.getItem("authToken"));
      setIsAuth(true);
    }
  }, []);

  // Form submit handler
  const loginSubmit = (e) => {
    e.preventDefault();
    setShowAlert(false);
    axios
      .post(url + "/adddata/login/user", formBody)
      .then((res) => {
        if (res.status === 200) {
          setAuthToken(res.data.token);
          setFormBody({ email: "", pass: "" });
          setIsAuth(true);
          localStorage.setItem("authToken", res.data.token);
        }
      })
      .catch((e) => {
        // console.log(e.response);
        var res = e.response;
        if (res.status === 401) {
          setAlertMsg("Wrong Password");
          setShowAlert(true);
        } else if (res.status === 404) {
          setAlertMsg("User not found");
          setShowAlert(true);
        } else {
          setAlertMsg("Server error, try again later");
          setShowAlert(true);
        }
      });
  };

  const classes = useStyles();

  if (!isAuth) {
    return (
      <>
        <Container maxWidth="md" className={classes.containerContent}>
          <form onSubmit={loginSubmit}>
            <Card className={classes.root}>
              <CardContent className={classes.cardContent} display="flex">
                <Typography
                  variant="h5"
                  component="h5"
                  className={classes.textField}
                >
                  Login to start coding
                </Typography>
                <TextField
                  required={true}
                  id="email"
                  label="Email"
                  type="email"
                  fullWidth
                  className={classes.textField}
                  value={formBody.email}
                  onChange={(e) => {
                    setFormBody({ ...formBody, email: e.target.value });
                  }}
                />
                <TextField
                  required={true}
                  type="password"
                  id="pass"
                  label="Password"
                  fullWidth
                  className={classes.textField}
                  value={formBody.pass}
                  onChange={(e) => {
                    setFormBody({ ...formBody, pass: e.target.value });
                  }}
                />
              </CardContent>
              <CardActions>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  endIcon={<ArrowForwardIosIcon fontSize="inherit" />}
                >
                  Login
                </Button>
              </CardActions>
              {giveAlert()}
            </Card>
          </form>
        </Container>
      </>
    );
  }

  return (
    <Dashboard
      topHeading={topHeading}
      setTopHeading={setTopHeading}
      authToken={authToken}
      setAuthToken={setAuthToken}
      setIsAuth={setIsAuth}
      isAuth={isAuth}
      setSidebarHeading={setSidebarHeading}
    />
  );
}
