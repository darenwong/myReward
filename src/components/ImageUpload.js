import React, { useState } from "react";
import {
  Input,
  Button,
  makeStyles,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Typography,
} from "@material-ui/core";
import PhotoCamera from "@material-ui/icons/PhotoCamera";

const useStyles = makeStyles((theme) => ({
  input: {
    display: "none",
    width: "100%",
  },
  img: {
    width: "100%",
  },
  card: {
    justifyContent: "center",
  },
}));

function ImageUpload({ setImg, defaultImg = null, title, ...rest }) {
  const classes = useStyles();
  const [localImageURL, setLocalImageURL] = useState(null);

  const handleChange = (event) => {
    if (event.target.files[0]) {
      setLocalImageURL(URL.createObjectURL(event.target.files[0]));
      setImg(event.target.files[0]);
    }
  };

  return (
    <Card className={classes.card}>
      <CardHeader title={title} />
      <CardActions>
        <input
          accept="image/*"
          className={classes.input}
          id="icon-button-file"
          type="file"
          onChange={handleChange}
        />
        <label htmlFor="icon-button-file">
          <Button
            variant="contained"
            color="primary"
            aria-label="upload picture"
            component="span"
            startIcon={<PhotoCamera />}
            fullWidth
          >
            Upload
          </Button>
        </label>
      </CardActions>
      <CardContent>
        <Typography>Preview</Typography>
        <img
          src={
            localImageURL || defaultImg || "/static/images/imgPlaceholder.png"
          }
          alt="firebase-image"
          className={classes.img}
        />
      </CardContent>
    </Card>
  );
}
export default ImageUpload;
