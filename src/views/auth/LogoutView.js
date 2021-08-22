import React from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { Formik } from "formik";
import {
  Box,
  Button,
  Card,
  CardHeader,
  Container,
  Grid,
  Link,
  TextField,
  Typography,
  makeStyles,
} from "@material-ui/core";
import FacebookIcon from "src/icons/Facebook";
import GoogleIcon from "src/icons/Google";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import Page from "src/components/Page";
import { useAuth } from "../../contexts/AuthContext";
// import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    height: "100%",
    padding: theme.spacing(3),
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "50vmin",
    overflow: "auto",
    display: "flex",
    padding: theme.spacing(3),
    flexDirection: "column",
    justifyContent: "center",
  },
}));

const LogoutView = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { logout } = useAuth();

  async function handleLogout() {
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch {
      console.log("Failed to log in");
    }
  }

  return (
    <Page className={classes.root} title="Logout">
      <Card className={classes.card}>
        <CardHeader title="Are you sure you want to log out?" />
        <Button
          color="secondary"
          startIcon={<ExitToAppIcon />}
          onClick={handleLogout}
          size="large"
          variant="contained"
        >
          Log out
        </Button>
      </Card>
    </Page>
  );
};

export default LogoutView;
