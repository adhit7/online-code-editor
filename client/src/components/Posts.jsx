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
import VisibilityIcon from "@material-ui/icons/Visibility";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";

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
  },
  imgPro: {
    height: "25px",
    width: "25px",
    borderRadius: "100%",
    marginRight: "4px",
  },
}));

function Posts(props) {
  const { setTopHeading } = props;

  const [codePosts, setCodePosts] = useState([]);

  const classes = useStyles();

  useEffect(() => {
    setTopHeading("Posts");
    axios.get(url + "/getdata/public/codes").then((res) => {
      setCodePosts(res.data);
    });
  }, []);

  return (
    <>
      <Container style={{ marginTop: "10px" }}>
        {/* <Typography variant="h4" className={classes.heading} style={{margin: "10px 0"}}>Posts</Typography> */}
        {codePosts.map((item, index) => {
          let d = new Date(item.postDate);
          let ye = new Intl.DateTimeFormat("en", { year: "numeric" }).format(d);
          let mo = new Intl.DateTimeFormat("en", { month: "short" }).format(d);
          let da = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(d);
          return (
            <Card key={index} className={classes.cardContent}>
              <CardContent>
                <Typography variant="h5" className={classes.heading}>
                  {item.title}
                </Typography>
                <Box display="flex" alignItems="center">
                  <AccountCircleIcon style={{ marginRight: "4px" }} />
                  <Typography variant="h6">
                    {item.user_details[0].userName}
                  </Typography>
                </Box>
                <Typography paragraph>{`${da}-${mo}-${ye}`}</Typography>
                <Box display="flex" justifyContent="flex-start">
                  <Link
                    to={`/editor/code/public/${item.cid}`}
                    className={classes.linkStyle}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<VisibilityIcon />}
                      style={{ marginRight: "10px" }}
                    >
                      View
                    </Button>
                  </Link>
                </Box>
              </CardContent>
            </Card>
          );
        })}
      </Container>
    </>
  );
}

export default Posts;
