import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import moment from "moment";
import { useOffer } from "src/contexts/OfferContext";
import { useAuth } from "src/contexts/AuthContext";
import { useFirebaseStorage } from "src/contexts/FirebaseStorageContext";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Typography,
  makeStyles,
} from "@material-ui/core";
import PhotoCamera from "@material-ui/icons/PhotoCamera";

const user = {
  avatar: "/static/images/avatars/avatar_6.png",
  city: "Los Angeles",
  country: "USA",
  jobTitle: "Senior Developer",
  name: "Katarina Smith",
  timezone: "GTM-7",
};

const useStyles = makeStyles(() => ({
  root: {},
  avatar: {
    height: 100,
    width: 100,
  },
  cardActions: {
    display: "flex",
    justifyContent: "center",
  },
  input: {
    display: "none",
    width: "0%",
  },
}));

const Profile = ({ className, ...rest }) => {
  const classes = useStyles();
  const { getUserName, updateProfilePicture } = useOffer();
  const { currentUser } = useAuth();
  const { handleUpload } = useFirebaseStorage();

  const handleChange = (event) => {
    handleUpload(event.target.files[0]).then((imgInfo) => {
      updateProfilePicture(imgInfo.imgURL).then(() => {
        console.log("pp updated");
      });
    });
  };

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <CardContent>
        <Box alignItems="center" display="flex" flexDirection="column">
          <Avatar
            className={classes.avatar}
            src={
              getUserName(currentUser.uid) &&
              getUserName(currentUser.uid).data().imgURL
            }
          />
          <Typography color="textPrimary" gutterBottom variant="h3">
            {currentUser &&
              getUserName(currentUser.uid) &&
              getUserName(currentUser.uid).data().firstName +
                " " +
                getUserName(currentUser.uid).data().lastName}
          </Typography>
          <Typography color="textSecondary" variant="body1">
            {currentUser.email}
          </Typography>
        </Box>
      </CardContent>
      <Divider />
      <CardActions className={classes.cardActions}>
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
    </Card>
  );
};

Profile.propTypes = {
  className: PropTypes.string,
};

export default Profile;
