import React, { useEffect, useState } from "react";
import {
  IconButton,
  Card,
  CardActionArea,
  CardContent,
  Container,
  Grid,
  makeStyles,
} from "@material-ui/core";
import Page from "src/components/Page";
import Store from "./Store";
import AddStoreButton from "./AddStoreButton";
import { useOffer } from "src/contexts/OfferContext";

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
}));

const Main = () => {
  const classes = useStyles();
  //const [stores, setStores] = useState([]);
  const { stores } = useOffer();

  return (
    <Page className={classes.root} title="Main">
      <Container maxWidth={false}>
        <Grid container spacing={3}>
          {stores &&
            stores.map((store, index) => (
              <Grid item key={index} lg={6} sm={6} xl={6} xs={12}>
                <Store store={store} />
              </Grid>
            ))}
          <Grid item lg={6} sm={6} xl={6} xs={12}>
            <AddStoreButton />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};

export default Main;
