import React, { useState, useEffect } from "react";
import { Controlled as CodeMirror } from "react-codemirror2";
import {
  Container,
  Typography,
  makeStyles,
  Button,
  TextField,
  Box,
  Dialog,
  DialogContent,
  DialogActions,
  Slide,
} from "@material-ui/core";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/mode/xml/xml";
import "codemirror/mode/javascript/javascript";
import "codemirror/mode/css/css";
import url from "../serverInfo";
import OutputWindow from "./OutputWindow";
import axios from "axios";
import { Redirect, useParams } from "react-router-dom";

function onChange(newValue) {
  console.log("change", newValue);
}

const useStyles = makeStyles((theme) => ({
  parentCont: {
    // backgroundColor: "#0A1931",
  },
  titleContainer: {
    margin: "10px 0",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "flex-start",
    padding: theme.spacing(1),
  },
  containerContent: {
    flexGrow: 1,
    padding: theme.spacing(0),
  },
  editor: {
    height: "100%",
    width: "100%",
  },
  test: {
    padding: "0 5px",
    overflowX: "hidden",
  },
  codeContainer: {
    padding: theme.spacing(0),
    marginTop: theme.spacing(1),
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    // justifyContent:"flex-start",
    // alignItems: "flex-start"
  },
  barCont: {
    display: "inline",
    color: "#fff",
  },
  tabHeading: {
    color: "#fff",
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function CodeEditor(props) {
  const { cid } = useParams();
  var {
    topHeading,
    setTopHeading,
    authToken,
    isAuth,
    newCode,
    oldCode,
    setIsAuth,
    editable,
  } = props;

  const classes = useStyles();

  const [htmlCode, setHtmlCode] = useState("");
  const [cssCode, setCssCode] = useState("");
  const [jsCode, setJsCode] = useState("");
  const [display, setDisplay] = useState(true);

  const saveCode = () => {
    if (newCode) {
      var codeBody = {
        title: topHeading,
        htmlCode: htmlCode,
        cssCode: cssCode,
        jsCode: jsCode,
      };

      axios
        .post(url + "/adddata/user/code/save", codeBody, {
          headers: {
            auth: "bearer " + authToken,
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          // console.log(res);
          if (res.status === 201) {
            handleClickOpen("Code saved successfully!");
            setIsAuth(false);
          }
        })
        .catch((e) => {
          // console.log(e.response);
          handleClickOpen("Cannot save code\nTry again later");
        });
    } else if (oldCode) {
      var codeBody = {
        cid: cid,
        title: topHeading,
        htmlCode: htmlCode,
        cssCode: cssCode,
        jsCode: jsCode,
      };

      // console.log(codeBody)

      axios
        .post(url + "/editdata/user/code", codeBody, {
          headers: {
            auth: "bearer " + authToken,
          },
        })
        .then((res) => {
          if (res.status === 200) {
            handleClickOpen("Code saved successfully!");
          }
        })
        .catch((e) => {
          handleClickOpen("Cannot save code\nTry again later");
        });
    }
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

  useEffect(() => {
    if (newCode) setTopHeading("Untitled");

    if (oldCode) {
      axios
        .get(url + "/getdata/user/code/" + cid, {
          headers: {
            auth: "bearer " + authToken,
          },
        })
        .then((res) => {
          if (res.status === 200) {
            var data = res.data;
            setHtmlCode(data.htmlCode);
            setCssCode(data.cssCode);
            setJsCode(data.jsCode);
            setTopHeading(data.title);
          }
        });
    }
  }, []);

  if (!isAuth) {
    return <Redirect to="/" />;
  }

  const showSaveAndTitle = () => {
    if (editable) {
      return (
        <Container
        className={classes.titleContainer}
        style={{ display: display ? "flex" : "none" }}
      >
        <TextField
          label="Title"
          value={topHeading}
          onChange={(e) => {
            setTopHeading(e.target.value);
          }}
          style={{marginBottom: "10px"}}
        />
        <Button
          variant="outlined"
          color="primary"
          size="small"
          onClick={saveCode}
          style={{ marginBottom: "10px" }}
        >
          Save Code
        </Button>
        </Container>
      );
    }
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
          {/* <Link to="/" className={classes.navLink}>
            <Button color="primary">Go to Home page</Button>
          </Link> */}
        </DialogActions>
      </Dialog>
      
        {showSaveAndTitle()}
      <div className={classes.parentCont}>
        <Container
          disableGutters={true}
          className={classes.codeContainer}
          style={{ display: display ? "grid" : "none" }}
        >
          <Container className={classes.test}>
            <Typography variant="h5" className={classes.tabHeading}>
              HTML
            </Typography>
            <CodeMirror
              value={htmlCode}
              options={{
                mode: "xml",
                theme: "material",
                lineNumbers: true,
                lineWrapping: true,
              }}
              onBeforeChange={(editor, data, value) => {
                setHtmlCode(value);
              }}
            />
          </Container>
          <Container className={classes.test}>
            <Typography variant="h5" className={classes.tabHeading}>
              CSS
            </Typography>
            <CodeMirror
              value={cssCode}
              options={{
                mode: "css",
                theme: "material",
                lineNumbers: true,
                lineWrapping: true,
              }}
              onBeforeChange={(editor, data, value) => {
                setCssCode(value);
              }}
            />
          </Container>
          <Container className={classes.test}>
            <Typography variant="h5" className={classes.tabHeading}>
              JS
            </Typography>
            <CodeMirror
              value={jsCode}
              options={{
                mode: "javascript",
                theme: "material",
                lineNumbers: true,
                lineWrapping: true,
              }}
              onBeforeChange={(editor, data, value) => {
                setJsCode(value);
              }}
            />
          </Container>
        </Container>
        <Container disableGutters={true}>
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-around"
            padding="5px 0"
          >
            <Typography variant="h5" className={classes.barCont}>
              Output
            </Typography>
            <Button
              variant="outlined"
              size="small"
              color="primary"
              onClick={() => {
                setDisplay(!display);
              }}
            >
              Full display
            </Button>
          </Box>
          <OutputWindow htmlCode={htmlCode} cssCode={cssCode} jsCode={jsCode} />
        </Container>
      </div>
    </>
  );
}
