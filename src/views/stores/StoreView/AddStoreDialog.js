import React, { useState } from "react";
import * as Yup from "yup";
import moment from "moment";
import { Formik } from "formik";
import {
  Button,
  Box,
  Container,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  makeStyles,
} from "@material-ui/core";
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
}));

function AddStoreDialog({ open, onClose, ...rest }) {
  const classes = useStyles();
  const [storeImg, setStoreImg] = useState();
  const { uploadNewStore } = useOffer();
  const { handleUpload } = useFirebaseStorage();

  function handleFormSubmit(values) {
    if (storeImg) {
      handleUpload(storeImg).then((imgInfo) => {
        uploadNewStore(values, imgInfo).then((id) => {
          console.log(id);
          onClose();
        });
      });
    } else {
      uploadNewStore(values).then((id) => {
        console.log(id);
        onClose();
      });
    }
  }

  return (
    <>
      <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Add a new store</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please provide your new store details below and click submit to
            create your new store
          </DialogContentText>

          <Container maxWidth="sm">
            <Formik
              initialValues={{
                name: "",
                address: "",
                operatingHourStart: "00:00",
                operatingHourEnd: "01:00",
                phoneNumber: "",
                website: "",
              }}
              validationSchema={Yup.object().shape({
                name: Yup.string()
                  .max(255)
                  .required("Name is required"),
                address: Yup.string()
                  .max(255)
                  .required("address is required"),
                operatingHourStart: Yup.string()
                  .required("Opening time is required")
                  .test("is-greater", "Invalid opening time", function(value) {
                    return moment(value, "HH:mm").isValid();
                  }),
                operatingHourEnd: Yup.string()
                  .required("Closing time is required")
                  .test("is-greater", "Invalid closing time", function(value) {
                    return moment(value, "HH:mm").isValid();
                  }),
                phoneNumber: Yup.string().matches(
                  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
                  "Phone number is not valid"
                ),
                website: Yup.string(),
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
                  <TextField
                    error={Boolean(touched.name && errors.name)}
                    fullWidth
                    helperText={touched.name && errors.name}
                    label="Name"
                    margin="normal"
                    name="name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.name}
                    variant="outlined"
                  />
                  <TextField
                    error={Boolean(touched.address && errors.address)}
                    fullWidth
                    helperText={touched.address && errors.address}
                    label="Address"
                    margin="normal"
                    name="address"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.address}
                    variant="outlined"
                  />
                  <TextField
                    error={Boolean(
                      touched.operatingHourStart && errors.operatingHourStart
                    )}
                    fullWidth
                    helperText={
                      touched.operatingHourStart && errors.operatingHourStart
                    }
                    label="Opening time"
                    margin="normal"
                    name="operatingHourStart"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.operatingHourStart}
                    variant="outlined"
                    type="time"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      step: 300,
                    }}
                  />
                  <TextField
                    error={Boolean(
                      touched.operatingHourEnd && errors.operatingHourEnd
                    )}
                    fullWidth
                    helperText={
                      touched.operatingHourEnd && errors.operatingHourEnd
                    }
                    label="Closing time"
                    margin="normal"
                    name="operatingHourEnd"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.operatingHourEnd}
                    variant="outlined"
                    type="time"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      step: 300,
                    }}
                  />
                  <TextField
                    error={Boolean(touched.phoneNumber && errors.phoneNumber)}
                    fullWidth
                    helperText={touched.phoneNumber && errors.phoneNumber}
                    label="Phone number"
                    margin="normal"
                    name="phoneNumber"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.phoneNumber}
                    variant="outlined"
                  />
                  <TextField
                    error={Boolean(touched.website && errors.website)}
                    fullWidth
                    helperText={touched.website && errors.website}
                    label="Website"
                    margin="normal"
                    name="website"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.website}
                    variant="outlined"
                  />
                  <ImageUpload setImg={setStoreImg} title="Upload store logo" />
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
                </form>
              )}
            </Formik>
          </Container>
        </DialogContent>
      </Dialog>
    </>
  );
}
export default AddStoreDialog;
