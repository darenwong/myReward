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
import Stamp from "./Stamp";
import AddOfferPageDialog from "./AddOfferPageDialog";
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
  gridItem: {
    height: "100%",
  },
}));

const Main = () => {
  const classes = useStyles();
  const { offers } = useOffer();

  return (
    <Page className={classes.root} title="Main">
      <Container maxWidth={false}>
        <Grid container spacing={3}>
          {offers &&
            offers.map((offer, index) => (
              <Grid
                item
                key={index}
                lg={3}
                sm={6}
                xl={3}
                xs={12}
                className={classes.gridItem}
              >
                <Stamp offer={offer} />
              </Grid>
            ))}
          <Grid item lg={3} sm={6} xl={3} xs={12}>
            <AddOfferPageDialog />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};

export default Main;
