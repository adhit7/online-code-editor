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
  Link,
} from "@material-ui/core";
import LinkedInIcon from "@material-ui/icons/LinkedIn";

const useStyles = makeStyles((theme) => ({
  heading: {
    fontWeight: 300,
  },
}));

export default function Contact(props) {
  const classes = useStyles();

  const { setTopHeading } = props;

  useEffect(() => {
    setTopHeading("Contact");
  }, []);

  return (
    <Container style={{ marginTop: "20px" }}>
      <Typography variant="h4" className={classes.heading}>
        Contact me
      </Typography>

      <Typography paragraph style={{ marginTop: "20px", fontSize: "1.5rem" }}>
        This project has been created by Arsh Khatwani (me).
        <br />
        I am currently pursuing B.Tech in Computer Science from Jabalpur
        Engineering College.
        <br />
        You can contact me on{" "}
        <Link
          href="https://www.linkedin.com/in/arsh-khatwani-b300521aa/"
          color="primary"
        >
          LinkedIn
        </Link>
        .
        <br />
        You can checkout my GitHub profile{" "}
        <Link href="https://github.com/arshkhatwani" color="primary">
          here
        </Link>
        .
      </Typography>
    </Container>
  );
}
