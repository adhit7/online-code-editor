import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import {
  Container,
  TextField,
  makeStyles,
  Card,
  Typography,
  Button,
  InputAdornment,
  IconButton,
  Slide,
  Dialog,
  DialogContent,
  DialogActions,
  Tr,
} from "@material-ui/core";
import VisibilityIcon from "@material-ui/icons/Visibility";
import url from "../serverInfo";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
  containerContent: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    // background:"yellow"
  },

  textField: {
    marginBottom: theme.spacing(2),
    fontSize: "2rem",
  },

  root: {
    padding: theme.spacing(3),
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    width: "80%",
    margin: "0 auto",
    marginTop: theme.spacing(3),
  },

  navLink: {
    color: "inherit",
    textDecoration: "none",
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function EditProfile(props) {
  const { isAuth, authToken, setTopHeading, setAuthToken, setIsAuth } = props;

  const classes = useStyles();

  const [vis, setVis] = useState(false);
  const [formBody, setFormBody] = useState({
    userName: "",
    userEmail: "",
  });
  const [passBody, setPassBody] = useState({
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    setTopHeading("Edit Profile");

    axios
      .get(url + "/editdata/user/profile", {
        headers: {
          auth: "bearer " + authToken,
        },
      })
      .then((res) => {
        // console.log(res);
        if (res.status === 200) {
          setFormBody({
            ...formBody,
            userName: res.data.userName,
            userEmail: res.data.userEmail,
          });
        }
      })
      .catch((e) => {
        // console.log(e);
        var response = e.response;
        if (response.status === 403) {
          setIsAuth(false);
        }
      });
  }, []);

  // For profile details
  const onSubmitHandler = (e) => {
    e.preventDefault();
    axios
      .post(url + "/editdata/user/profile", formBody, {
        headers: {
          auth: "bearer " + authToken,
        },
      })
      .then((res) => {
        if (res.status === 200) {
          handleClickOpen("Details updated successfully !");
        } else {
          handleClickOpen("Could not update data\nTry again later");
        }
      })
      .catch((e) => {
        var response = e.response;
        if (response.status === 500) {
          handleClickOpen("Could not update data\nTry again later");
        }
      });
  };

  // For password edit
  const onSubmitHandlerPass = (e) => {
    e.preventDefault();
    // console.log(passBody)
    axios.post(url+"/editdata/user/pass", passBody, {
      headers: {
        auth: "bearer " + authToken,
      }
    })
    .then((res) => {
      if (res.status === 200) {
        handleClickOpen("Details updated successfully !");
      } else {
        handleClickOpen("Could not update data\nTry again later");
      }
    })
    .catch((e) => {
      var response = e.response;
      if (response.status === 500) {
        handleClickOpen("Could not update data\nTry again later");
      }
    });
  }

  function validatePassword(){
    var password = document.getElementById("pass")
    var confirm_password = document.getElementById("c-pass")
    if(password.value != confirm_password.value) {
      confirm_password.setCustomValidity("Passwords Don't Match");
    } else {
      confirm_password.setCustomValidity('');
    }
  }

  const handleClickVis = (e) => {
    e.preventDefault();
    setVis(!vis);
  };

  // Dialog Box related code
  const [dialogMsg, setDialogMsg] = useState("");
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = (msg) => {
    setOpen(true);
    setDialogMsg(msg);
  };
  const handleClose = () => {
    setOpen(false);
  };

  if (!isAuth) {
    return <Redirect to="/" />;
  }

  return (
    <>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogContent>{dialogMsg}</DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
          <Link to="/" className={classes.navLink}>
            <Button color="primary">Go to Home page</Button>
          </Link>
        </DialogActions>
      </Dialog>
      <Container className={classes.containerContent}>
        <form onSubmit={onSubmitHandler}>
          <Card className={classes.root}>
            <Typography variant="h4" className={classes.textField}>
              Edit your details
            </Typography>
            <TextField
              fullWidth
              required={true}
              className={classes.textField}
              id="name"
              label="Full Name"
              value={formBody.userName}
              onChange={(e) =>
                setFormBody({ ...formBody, userName: e.target.value })
              }
            />
            <TextField
              fullWidth
              required={true}
              className={classes.textField}
              id="email"
              label="Email"
              type="email"
              value={formBody.userEmail}
              onChange={(e) =>
                setFormBody({ ...formBody, userEmail: e.target.value })
              }
            />

            <Button variant="contained" color="primary" type="submit">
              Save Details
            </Button>
          </Card>
        </form>
        <form onSubmit={onSubmitHandlerPass}>
          <Card className={classes.root}>
            <Typography variant="h4" className={classes.textField}>
              Edit password
            </Typography>
            <TextField
              fullWidth
              required={true}
              className={classes.textField}
              id="pass"
              label="Password"
              type={vis ? "text" : "password"}
              inputProps={{
                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/
                  .source,
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleClickVis}>
                      <VisibilityIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              value={passBody.password}
              onChange={(e) =>
                {
                  setPassBody({ ...passBody, password: e.target.value });
                  validatePassword();
                }
              }
            />
            <TextField
              fullWidth
              required={true}
              className={classes.textField}
              id="c-pass"
              label="Confirm Password"
              type={vis ? "text" : "password"}
              inputProps={{
                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/
                  .source,
              }}
              value={passBody.confirmPassword}
              onChange={(e) =>
                setPassBody({ ...passBody, confirmPassword: e.target.value})
              }
              onKeyUp={validatePassword}
            />
            <Typography paragraph>
              <li> Password must have atleast 8 characters </li>
              <li> Include atleast one uppercase and lowercase letter </li>
              <li> Include atleast one number </li>
            </Typography>
            <Button variant="contained" color="primary" type="submit">
              Save Password
            </Button>
          </Card>
        </form>
      </Container>
    </>
  );
}
