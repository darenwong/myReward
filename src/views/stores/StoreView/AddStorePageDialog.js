import React, {useState, useEffect} from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
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
  makeStyles
} from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { useOffer } from 'src/contexts/OfferContext';
import { useFirebaseStorage } from 'src/contexts/FirebaseStorageContext';
import ImageUpload from 'src/components/ImageUpload';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  },
  addButton: {
    margin: theme.spacing(1),
    position: 'absolute',
    bottom: '0',
    right: '0',
    borderRadius: '50%'
  },
  addButtonCard: {
    height: '100%',
    textAlign: 'center'
  },
  addButtonIcon: {
    fontSize: '5vh',
  },
  formControl: {
    minWidth: 120,
  },
  menuItem: {
    width: '80vw',
    wordWrap: 'break-word',
    whiteSpace: 'normal'
  }
}));


function AddStorePageDialog({existingStoreData, ...rest}){
  const classes = useStyles();
  const [addStorePageIsOpen, setAddStorePageIsOpen] = useState(false);
  const [storeImg, setStoreImg] = useState();
  const { uploadNewStore } = useOffer();
  const { handleUpload } = useFirebaseStorage();

  function handleClose(){setAddStorePageIsOpen(false)};

  function handleFormSubmit(values){
    if (storeImg){
      handleUpload(storeImg).then((url)=>{
        uploadNewStore(values, url).then((id)=>{
          console.log(id);
          setAddStorePageIsOpen(false);
        })
      })
    }
  }

  return (
    <>            
      <Card style={{height: '100%'}}>
        <CardActionArea className={classes.addButtonCard} onClick={()=>{setAddStorePageIsOpen(true)}}>
          <CardContent>
            <AddCircleIcon color='primary' className={classes.addButtonIcon} />
          </CardContent>
        </CardActionArea>
      </Card>
      <Dialog open={addStorePageIsOpen} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Add a new loyalty program</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To subscribe to this website, please enter your email address here. We will send updates
            occasionally.
          </DialogContentText>


          <Container maxWidth="sm">
            <Formik
              initialValues={{
                name: '',
                address: '',
                operatingHourStart: '1970-01-01T00:00',
                operatingHourEnd: '1970-01-01T00:00',
                phoneNumber: '',
                website: '',
              }}
              validationSchema={
                Yup.object().shape({
                  name: Yup.string().max(255).required('Name is required'),
                  address: Yup.string().max(255).required('address is required'),
                  operatingHourStart: Yup.date().required('Start date is required'),
                  operatingHourEnd: Yup.date().required('End date is required'),
                  phoneNumber: Yup.string().matches(/^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/, 'Phone number is not valid'),
                  website: Yup.string()
                })
              }
              onSubmit={handleFormSubmit}
            >
              {({
                errors,
                handleBlur,
                handleChange,
                handleSubmit,
                isSubmitting,
                touched,
                values
              }) => (
                <form onSubmit={handleSubmit}>
                  <TextField
                    error={Boolean(touched.name && errors.name)}
                    fullWidth
                    helperText={touched.name && errors.name}
                    label="name"
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
                    label="address"
                    margin="normal"
                    name="address"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.address}
                    variant="outlined"
                  />
                  <TextField
                    error={Boolean(touched.operatingHourStart && errors.operatingHourStart)}
                    fullWidth
                    helperText={touched.operatingHourStart && errors.operatingHourStart}
                    label="Opening time"
                    margin="normal"
                    name="operatingHourStart"
                    onBlur={handleBlur}
                    onChange={(event)=>{values.operatingHourStart = "1970-01-01T" + event.target.value; console.log("1970-01-01T" + event.target.value, values)}}
                    value={values.operatingHourStart.substring(values.operatingHourStart.length-5, values.operatingHourStart.length)}
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
                    error={Boolean(touched.operatingHourEnd && errors.operatingHourEnd)}
                    fullWidth
                    helperText={touched.operatingHourEnd && errors.operatingHourEnd}
                    label="Closing time"
                    margin="normal"
                    name="operatingHourEnd"
                    onBlur={handleBlur}
                    onChange={(event)=>{values.operatingHourEnd = "1970-01-01T" + event.target.value; console.log("1970-01-01T" + event.target.value, values)}}
                    value={values.operatingHourEnd.substring(values.operatingHourEnd.length-5, values.operatingHourEnd.length)}
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
                  <ImageUpload setImg={setStoreImg}/>
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
                      onClick={handleClose}
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
  )
}
export default AddStorePageDialog