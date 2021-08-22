import React from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  colors,
  makeStyles,
} from "@material-ui/core";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import PeopleIcon from "@material-ui/icons/PeopleOutlined";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
  },
  avatar: {
    backgroundColor: colors.red[500],
    height: 56,
    width: 56,
  },
}));

const Scorecard = ({ className, title, value, icon, ...rest }) => {
  const classes = useStyles();

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <CardContent>
        <Grid container justify="space-between" spacing={3}>
          <Grid item>
            <Typography color="textSecondary" gutterBottom variant="h6">
              {title}
            </Typography>
            <Typography color="textPrimary" variant="h3">
              {value}
            </Typography>
          </Grid>
          <Grid item>
            <Avatar className={classes.avatar}>{icon}</Avatar>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

Scorecard.propTypes = {
  className: PropTypes.string,
};

export default Scorecard;
