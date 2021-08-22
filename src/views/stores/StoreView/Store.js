import React, { useEffect, useState } from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import {
  Avatar,
  Box,
  Card,
  CardHeader,
  CardActions,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Typography,
  colors,
  makeStyles,
} from "@material-ui/core";
import MoneyIcon from "@material-ui/icons/Money";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import RoomIcon from "@material-ui/icons/Room";
import PhoneIcon from "@material-ui/icons/Phone";
import PublicIcon from "@material-ui/icons/Public";
import StorefrontIcon from "@material-ui/icons/Storefront";

import { useOffer } from "src/contexts/OfferContext";
import UpdateStoreDialog from "./UpdateStoreDialog";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
  },
  avatar: {
    backgroundColor: theme.palette.secondary.main,
    height: 56,
    width: 56,
  },
  cardHeaderContent: {
    width: "50%",
    marginRight: "auto",
  },
  listItemText: {
    overflowWrap: "break-word",
  },
}));

const Store = ({ className, store, ...rest }) => {
  const classes = useStyles();
  const [storeDetailsPageIsOpen, setStoreDetailsPageIsOpen] = useState(false);

  return (
    <>
      <UpdateStoreDialog
        open={storeDetailsPageIsOpen}
        onClose={() => {
          setStoreDetailsPageIsOpen(false);
        }}
        store={store}
      />
      <Card className={clsx(classes.root, className)} {...rest}>
        <CardHeader
          classes={{ content: classes.cardHeaderContent }}
          avatar={
            <Avatar className={classes.avatar} src={store.data().imgURL}>
              <StorefrontIcon />
            </Avatar>
          }
          action={
            <IconButton
              aria-label="settings"
              onClick={() => {
                setStoreDetailsPageIsOpen(true);
              }}
            >
              <MoreVertIcon />
            </IconButton>
          }
          title={
            <Typography color="textPrimary" gutterBottom variant="h3">
              {store.data().name}
            </Typography>
          }
          subheader={
            <Typography color="textSecondary" variant="h6" noWrap>
              {store.data().address}
            </Typography>
          }
        ></CardHeader>
        <CardActionArea>
          <CardContent>
            <List>
              <ListItem>
                <ListItemIcon>
                  <RoomIcon />
                </ListItemIcon>
                <ListItemText
                  primary={store.data().address}
                  className={classes.listItemText}
                ></ListItemText>
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <PhoneIcon />
                </ListItemIcon>
                <ListItemText
                  primary={store.data().phoneNumber}
                  className={classes.listItemText}
                ></ListItemText>
              </ListItem>
              <ListItem
                button
                component="a"
                href={store && store.data().website}
              >
                <ListItemIcon>
                  <PublicIcon />
                </ListItemIcon>
                <ListItemText
                  primary={store.data().website}
                  className={classes.listItemText}
                ></ListItemText>
              </ListItem>
            </List>
          </CardContent>
        </CardActionArea>
      </Card>
    </>
  );
};

Store.propTypes = {
  className: PropTypes.string,
};

export default Store;
