import React from "react";
import { Container, Grid, makeStyles } from "@material-ui/core";
import Page from "src/components/Page";
import Budget from "./Budget";
import LatestOrders from "./LatestOrders";
import LatestProducts from "./LatestProducts";
import Sales from "./Sales";
import TasksProgress from "./TasksProgress";
import Scorecard from "./Scorecard";
import TotalProfit from "./TotalProfit";
import TrafficByDevice from "./TrafficByDevice";
import { useOffer } from "src/contexts/OfferContext";
import StampsBar from "./StampsBar";
import Results from "./Results";
import TransactionTable from "./TransactionTable";
import PeopleIcon from "@material-ui/icons/PeopleOutlined";
import LocalAtmIcon from "@material-ui/icons/LocalAtm";
import RedeemIcon from "@material-ui/icons/Redeem";
import CheckIcon from "@material-ui/icons/Check";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: "100%",
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
}));

const Dashboard = () => {
  const classes = useStyles();
  const {
    uniqueCustomerSet,
    userStamps,
    redeemedStamps,
    redemptionTransaction,
  } = useOffer();

  return (
    <Page className={classes.root} title="Dashboard">
      <Container maxWidth={false}>
        <Grid container spacing={3}>
          <Grid item lg={3} sm={6} xl={3} xs={12}>
            <Scorecard
              title="TOTAL CUSTOMER"
              value={uniqueCustomerSet.size}
              icon={<PeopleIcon />}
            />
          </Grid>
          <Grid item lg={3} sm={6} xl={3} xs={12}>
            <Scorecard
              title="TOTAL STAMPS GIVEN"
              value={userStamps && userStamps.length}
              icon={<LocalAtmIcon />}
            />
          </Grid>
          <Grid item lg={3} sm={6} xl={3} xs={12}>
            <Scorecard
              title="TOTAL STAMPS REDEEMED"
              value={redeemedStamps && redeemedStamps.length}
              icon={<CheckIcon />}
            />
          </Grid>
          <Grid item lg={3} sm={6} xl={3} xs={12}>
            <Scorecard
              title="TOTAL OFFERS REDEEMED"
              value={redemptionTransaction && redemptionTransaction.length}
              icon={<RedeemIcon />}
            />
          </Grid>
          <Grid item lg={12} md={12} xl={12} xs={12}>
            <Sales />
          </Grid>
          <Grid item lg={4} md={6} xl={3} xs={12}>
            <TrafficByDevice />
          </Grid>
          <Grid item lg={8} md={6} xl={9} xs={12}>
            <StampsBar />
          </Grid>
          <Grid item lg={12} md={12} xl={12} xs={12}>
            <Results userStamps={userStamps} />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};

export default Dashboard;
