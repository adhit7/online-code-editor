import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  makeStyles,
  Box,
  Slide,
  Dialog,
  DialogContent,
  DialogActions,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import url from "../serverInfo";
import axios from "axios";
import DeleteIcon from "@material-ui/icons/Delete";
import VisibilityIcon from '@material-ui/icons/Visibility';

const useStyles = makeStyles((theme) => ({
  containerContent: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing(2),
    marginTop: theme.spacing(1),
  },
  cardContent: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
  linkStyle: {
    textDecoration: "none",
  },
  redBtn: {
    backgroundColor: "#e01b1b",
    color: "#fff",
    "&:hover": {
      backgroundColor: "#960303",
    },
  },
  heading: {
    fontWeight: 300,
  }
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function Dashboard(props) {
  const classes = useStyles();

  const {
    setTopHeading,
    authToken,
    setSidebarHeading,
    setAuthToken,
    setIsAuth,
    isAuth,
  } = props;

  const [codePosts, setCodePosts] = useState([]);

  // Fetching user data from server
  useEffect(() => {
    // Profile details
    axios
      .get(url + "/getdata/user/profile", {
        headers: {
          auth: "bearer " + authToken,
        },
      })
      .then((res) => {
        // console.log(res);
        setSidebarHeading(res.data.user.userName);
        setIsAuth(true);
      })
      .catch((e) => {
        var res = e.response;
        if (res.status === 403) {
          setAuthToken("");
          localStorage.removeItem("authToken");
          setIsAuth(false);
        }
      });

    // Saved codes
    axios
      .get(url + "/getdata/user/codes", {
        headers: {
          auth: "bearer " + authToken,
        },
      })
      .then((res) => {
        // console.log(res.data);
        setCodePosts(res.data);
      })
      .catch((e) => {
        var res = e.response;
        if (res.status === 403) {
          setAuthToken("");
          localStorage.removeItem("authToken");
          setIsAuth(false);
        }
      });

    setTopHeading("Home");
  }, []);

  // Dialog Box related code
  const [dialogMsg, setDialogMsg] = useState("");
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = (msg) => {
    setOpen(true);
    setDialogMsg(msg);
  };
  const handleClose = () => {
    setOpen(false);
    window.location.reload();
  };

  const [open2, setOpen2] = React.useState(false);
  const [delCid, setDelCid] = React.useState("");
  const handleClickOpen2 = (msg) => {
    setOpen2(true);
    setDialogMsg(msg);
  };
  const handleClose2 = () => {
    setOpen2(false);
  };

  const deleteCode = (cid) => {
    axios
      .delete(url + "/deletedata/user/code", {
        headers: {
          auth: "bearer " + authToken,
          cid: cid,
        },
      })
      .then((res) => {
        if (res.status === 200) {
          handleClickOpen("Deleted Successfully");
        }
      });
  };

  const noPostsMsg = () => {
    if(codePosts.length === 0){
      return (
        <h2>No posts</h2>
      )
    }
  }

  return (
    <>
      {/* Confirmation dialog */}
      <Dialog
        open={open2}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose2}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogContent>{dialogMsg}</DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              deleteCode(delCid);
              handleClose2();
            }}
            className={classes.redBtn}
          >
            Delete
          </Button>
          <Button onClick={handleClose2} color="primary" variant="outlined">
            Close
          </Button>
        </DialogActions>
      </Dialog>

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
          <Button onClick={handleClose} color="primary" variant="outlined">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Container style={{ margin: "10px 0" }}>
        <Link to="/editor/newcode" className={classes.linkStyle}>
          <Button variant="outlined" color="primary">
            Write Code <b>&nbsp;{"</>"}</b>
          </Button>
        </Link>
      </Container>
        
      <Container>
        <Typography variant="h4" className={classes.heading} style={{margin: "10px 0"}}>Your Posts</Typography>
        {noPostsMsg()}
        {codePosts.map((item, index) => {
          let d = new Date(item.postDate);
          let ye = new Intl.DateTimeFormat("en", { year: "numeric" }).format(d);
          let mo = new Intl.DateTimeFormat("en", { month: "short" }).format(d);
          let da = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(d);
          return (
            <Card key={index} className={classes.cardContent}>
              <CardContent>
                <Typography variant="h5" className={classes.heading}>{item.title}</Typography>
                <Typography paragraph>{`${da}-${mo}-${ye}`}</Typography>
                <Box display="flex" justifyContent="flex-start">
                  <Link to={`/editor/code/${item.cid}`} className={classes.linkStyle}>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<VisibilityIcon />}
                      style={{ marginRight: "10px" }}
                    >
                      View
                    </Button>
                  </Link>
                  <Button
                    variant="contained"
                    className={classes.redBtn}
                    startIcon={<DeleteIcon />}
                    style={{ marginRight: "10px" }}
                    onClick={() => {
                      setDelCid(item.cid);
                      handleClickOpen2(
                        "Are you sure you want to delete this code ?"
                      );
                    }}
                  >
                    Delete
                  </Button>
                </Box>
              </CardContent>
            </Card>
          );
        })}
      </Container>
    </>
  );
}
