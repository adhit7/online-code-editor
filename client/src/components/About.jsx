import React, { useEffect } from "react";
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

const useStyles = makeStyles((theme) => ({
  heading: {
    fontWeight: 300,
  },
}));

export default function About(props) {
  const classes = useStyles();

  const { setTopHeading } = props;

  useEffect(() => {
    setTopHeading("About");
  }, []);

  return (
    <Container style={{ marginTop: "20px" }}>
      <Typography variant="h4" className={classes.heading}>
        About this project
      </Typography>
      <Typography paragraph style={{ marginTop: "20px", fontSize: "1.2rem" }}>
        This project is a clone of 'CodePen' coding environment.
        <Typography
          variant="h5"
          className={classes.heading}
          style={{ marginTop: "10px" }}
        >
          Features include:
        </Typography>
        <li>
          Users could register, create account, login to build, edit and delete
          their codes.
        </li>
        <li>
          Users could access codes of other users on the platform for reference
          and could make temporary changes.
        </li>
        <li>
          Front-End was created using <u>React</u> while Back-End was developed
          with <u>NodeJS</u>, <u>Express</u> with database as <u>MongoDB</u>.
        </li>
      </Typography>
    </Container>
  );
}
