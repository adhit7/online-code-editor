import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
} from "@material-ui/core";
import VisibilityIcon from "@material-ui/icons/Visibility";
import url from "../serverInfo";

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

export default function RegisterForm(props) {
  const classes = useStyles();
  console.log(url);
  const { setTopHeading } = props;
  const [vis, setVis] = useState(false);
  const [formBody, setFormBody] = useState({
    userName: "",
    userEmail: "",
    password: "",
  });

  const [dialogMsg, setDialogMsg] = useState("");
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = (msg) => {
    setOpen(true);
    setDialogMsg(msg);
  };
  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    setTopHeading("Register");
  }, []);

  const onSubmitHandler = (e) => {
    e.preventDefault();
    // console.log(formBody);
    fetch(url + "/adddata/register/user", {
      method: "POST",
      body: JSON.stringify(formBody),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      if (res.status === 201) {
        handleClickOpen(
          "Congratulations you have been successfully registered\nHead over to login page to login your account"
        );
      } else if (res.status === 409) {
        handleClickOpen("Email already exists\nPlease enter a different email");
      } else {
        handleClickOpen("Oops! Could not register right now\nTry again later");
      }
    });
  };

  const handleClickVis = (e) => {
    e.preventDefault();
    setVis(!vis);
  };

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
            <Button color="primary">Go to Login page</Button>
          </Link>
        </DialogActions>
      </Dialog>
      <Container className={classes.containerContent}>
        <form onSubmit={onSubmitHandler}>
          <Card className={classes.root}>
            <Typography variant="h4" className={classes.textField}>
              Enter your details
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
              value={formBody.password}
              onChange={(e) =>
                setFormBody({ ...formBody, password: e.target.value })
              }
            />
            <Typography paragraph>
              <li> Password must have atleast 8 characters </li>
              <li> Include atleast one uppercase and lowercase letter </li>
              <li> Include atleast one number </li>
            </Typography>
            <Button variant="contained" color="primary" type="submit">
              Submit Details
            </Button>
          </Card>
        </form>
      </Container>
    </>
  );
}
