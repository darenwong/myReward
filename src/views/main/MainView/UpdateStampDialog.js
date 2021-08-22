import React, { useState, useEffect } from "react";
import * as Yup from "yup";
import { Formik } from "formik";
import {
  Button,
  Box,
  InputLabel,
  MenuItem,
  FormControl,
  FormHelperText,
  Select,
  Container,
  TextField,
  Card,
  CardActionArea,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  makeStyles,
} from "@material-ui/core";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import { useOffer } from "src/contexts/OfferContext";
import { useFirebaseStorage } from "src/contexts/FirebaseStorageContext";
import ImageUpload from "src/components/ImageUpload";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: "100%",
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
  addButton: {
    margin: theme.spacing(1),
    position: "absolute",
    bottom: "0",
    right: "0",
    borderRadius: "50%",
  },
  addButtonCard: {
    height: "100%",
    textAlign: "center",
  },
  addButtonIcon: {
    fontSize: "5vh",
  },
  formControl: {
    minWidth: 120,
  },
  menuItem: {
    width: "80vw",
    wordWrap: "break-word",
    whiteSpace: "normal",
  },
}));

function UpdateStampDialog({ offer, open, onClose, ...rest }) {
  const classes = useStyles();
  const { handleUpload, handleDelete } = useFirebaseStorage();
  const { updateOffer, deleteOffer, stores, getStoreInfo } = useOffer();
  const [offerImg, setOfferImg] = useState();
  const [storeInfo, setStoreInfo] = useState();

  function handleFormSubmit(values) {
    if (offerImg) {
      handleDelete(values.imgRef).then(() => {
        handleUpload(offerImg).then((imgInfo) => {
          updateOffer(offer.id, values, imgInfo).then((id) => {
            console.log(id);
            onClose();
          });
        });
      });
    } else {
      updateOffer(offer.id, values).then((id) => {
        console.log(id);
        onClose();
      });
    }
  }

  async function getDefaultStoreAddress(values) {
    let storeAddress = "";
    if (values.storeID) {
      const storeInfo = await getStoreInfo(values.storeID);
      storeAddress = storeInfo.data().address;
    }
    return storeAddress;
  }

  useEffect(() => {
    getStoreInfo(offer.data().storeID).then((storeInfo) => {
      if (storeInfo) {
        setStoreInfo(storeInfo);
      }
    });
  }, []);

  return (
    <>
      <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Edit offer details</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please make your changes below and click submit to upload the
            changes
          </DialogContentText>

          <Container maxWidth="sm">
            <Formik
              initialValues={offer.data()}
              validationSchema={Yup.object().shape({
                title: Yup.string()
                  .max(255)
                  .required("Title is required"),
                description: Yup.string()
                  .max(255)
                  .required("Description is required"),
                startDate: Yup.date().required("Start date is required"),
                endDate: Yup.date().required("End date is required"),
                capacity: Yup.number()
                  .integer()
                  .moreThan(0)
                  .required("Number of stamps to redeem reward is required"),
                storeID: Yup.string()
                  .nullable()
                  .required("Store address is required"),
              })}
              onSubmit={handleFormSubmit}
            >
              {({
                errors,
                handleBlur,
                handleChange,
                handleSubmit,
                isSubmitting,
                touched,
                values,
              }) => (
                <form onSubmit={handleSubmit}>
                  <FormControl
                    fullWidth
                    className={classes.formControl}
                    variant="outlined"
                    error={Boolean(touched.storeID && errors.storeID)}
                  >
                    <InputLabel id="demo-simple-select-outlined">
                      Store Address
                    </InputLabel>
                    <Select
                      id="demo-simple-select-outlined"
                      defaultValue=""
                      label="Store Address"
                      defaultValue={storeInfo ? storeInfo.id : ""}
                      onChange={(event) => {
                        values.storeID = event.target.value;
                        console.log(values);
                      }}
                    >
                      {stores &&
                        stores.map((store, ind) => (
                          <MenuItem
                            className={classes.menuItem}
                            key={ind}
                            value={store.id}
                          >
                            {store.data().address}
                          </MenuItem>
                        ))}
                    </Select>
                    <FormHelperText>
                      {Boolean(touched.storeID && errors.storeID) &&
                        errors.storeID}
                    </FormHelperText>
                  </FormControl>
                  <TextField
                    error={Boolean(touched.title && errors.title)}
                    fullWidth
                    helperText={touched.title && errors.title}
                    label="Title"
                    margin="normal"
                    name="title"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.title}
                    variant="outlined"
                  />
                  <TextField
                    error={Boolean(touched.description && errors.description)}
                    fullWidth
                    helperText={touched.description && errors.description}
                    label="Description"
                    margin="normal"
                    name="description"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.description}
                    variant="outlined"
                  />
                  <TextField
                    error={Boolean(touched.startDate && errors.startDate)}
                    fullWidth
                    helperText={touched.startDate && errors.startDate}
                    label="Start Date"
                    margin="normal"
                    name="startDate"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.startDate}
                    variant="outlined"
                    type="date"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                  <TextField
                    error={Boolean(touched.endDate && errors.endDate)}
                    fullWidth
                    helperText={touched.endDate && errors.endDate}
                    label="End Date"
                    margin="normal"
                    name="endDate"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.endDate}
                    variant="outlined"
                    type="date"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                  <TextField
                    error={Boolean(touched.capacity && errors.capacity)}
                    fullWidth
                    helperText={touched.capacity && errors.capacity}
                    label="Number of stamps per reward"
                    margin="normal"
                    name="capacity"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.capacity}
                    variant="outlined"
                  />
                  <ImageUpload
                    setImg={setOfferImg}
                    defaultImg={offer.data().imgURL}
                    title="Upload offer image"
                  />
                  <Box my={2}>
                    <Button
                      color="primary"
                      disabled={isSubmitting}
                      fullWidth
                      size="large"
                      type="submit"
                      variant="contained"
                    >
                      Submit
                    </Button>
                  </Box>
                  <Box my={2}>
                    <Button
                      color="secondary"
                      disabled={isSubmitting}
                      fullWidth
                      size="large"
                      onClick={onClose}
                      variant="contained"
                    >
                      Cancel
                    </Button>
                  </Box>
                  <Box my={2}>
                    <Button
                      color="secondary"
                      disabled={isSubmitting}
                      fullWidth
                      size="large"
                      onClick={() => deleteOffer(offer.id)}
                      variant="contained"
                    >
                      Delete
                    </Button>
                  </Box>
                </form>
              )}
            </Formik>
          </Container>
        </DialogContent>
      </Dialog>
    </>
  );
}
export default UpdateStampDialog;
