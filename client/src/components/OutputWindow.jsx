import React from "react";
import { Container, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  containerCont: {
    marginTop: theme.spacing(1),
    backgroundColor: "#fff",
  },
  outputPanel: {
    // border: "2px solid #000",
    minHeight: "80vh",
  },
}));

export default function OutputWindow(props) {
  const classes = useStyles();
  const { htmlCode, cssCode, jsCode } = props;

  var srcDoc = `
    <html>
        <body>
        ${htmlCode}
        </body>
        <style>${cssCode}</style>
        <script>${jsCode}</script>
    </html>
    `;

  return (
    <>
      <Container disableGutters={true} className={classes.containerCont}>
        <iframe
        title="output"
          srcDoc={srcDoc}
          sandbox="allow-scripts"
          frameBorder="0"
          height="100%"
          width="100%"
          className={classes.outputPanel}
        ></iframe>
      </Container>
    </>
  );
}
