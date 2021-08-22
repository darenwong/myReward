import React, { useState } from "react";
import { Box, Container, makeStyles } from "@material-ui/core";
import { useOffer } from "src/contexts/OfferContext";
import Page from "src/components/Page";
import Results from "./Results";
import Toolbar from "./Toolbar";
import data from "./data";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: "100%",
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
}));

const CustomerListView = () => {
  const classes = useStyles();
  const [customers] = useState(data);
  const { userStamps } = useOffer();

  console.log("userStamps", userStamps);

  return (
    <Page className={classes.root} title="Customers">
      <Container maxWidth={false}>
        <Toolbar />
        <Box mt={3}>
          <Results userStamps={userStamps} />
        </Box>
      </Container>
    </Page>
  );
};

export default CustomerListView;
