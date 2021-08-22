import React, { useEffect, useState } from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardHeader,
  CardActions,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  IconButton,
  Typography,
  colors,
  makeStyles,
} from "@material-ui/core";
import MoneyIcon from "@material-ui/icons/Money";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import StorefrontIcon from "@material-ui/icons/Storefront";
import StampQRCode from "./StampQRCode";
import QRScanner from "./QRScanner";
import { useOffer } from "src/contexts/OfferContext";
import UpdateStampDialog from "./UpdateStampDialog";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
  },
  avatar: {
    backgroundColor: colors.red[600],
    height: 56,
    width: 56,
  },
  differenceIcon: {
    color: colors.red[900],
  },
  differenceValue: {
    color: colors.red[900],
    marginRight: theme.spacing(1),
  },
  offerImg: {
    objectFit: "cover",
  },
}));

const Stamp = ({ className, offer, ...rest }) => {
  const classes = useStyles();
  const [QRCodeIsOpen, setQRCodeIsOpen] = useState(false);
  const [stampID, setStampID] = useState();
  const { giveStamp, deleteStamp, getStoreInfo } = useOffer();
  const [storeInfo, setStoreInfo] = useState();
  const [stampDetailsPageIsOpen, setStampDetailsPageIsOpen] = useState(false);
  const [redeem, setRedeem] = useState(false);

  useEffect(() => {
    return () => {
      if (stampID) {
        deleteStamp(stampID).then(() => setQRCodeIsOpen(false));
      }
    };
  }, []);

  useEffect(() => {
    getStoreInfo(offer.data().storeID).then((storeInfo) => {
      setStoreInfo(storeInfo);
    });
  }, [offer]);

  function handleOpenQRCode() {
    giveStamp(offer.id).then((newStampID) => {
      setStampID(newStampID);
      console.log(newStampID);
    });
  }

  function handleCloseQRCode() {
    if (stampID) {
      deleteStamp(stampID).then(() => setQRCodeIsOpen(false));
    } else setQRCodeIsOpen(false);
  }

  return (
    <>
      <QRScanner
        open={QRCodeIsOpen}
        offer={offer}
        stampID={stampID}
        onClose={() => setQRCodeIsOpen(false)}
        redeem={redeem}
      />
      <UpdateStampDialog
        open={stampDetailsPageIsOpen}
        offer={offer}
        onClose={() => setStampDetailsPageIsOpen(false)}
      />
      <Card className={clsx(classes.root, className)} {...rest}>
        <CardHeader
          avatar={
            <Avatar
              className={classes.avatar}
              src={storeInfo && storeInfo.data().imgURL}
            >
              <StorefrontIcon />
            </Avatar>
          }
          action={
            <IconButton
              aria-label="settings"
              onClick={() => setStampDetailsPageIsOpen(true)}
            >
              <MoreVertIcon />
            </IconButton>
          }
          title={
            <Typography color="textSecondary" gutterBottom variant="h6">
              {storeInfo && storeInfo.data().name}
            </Typography>
          }
          subheader={
            <Typography color="textPrimary" variant="h3">
              {offer.data().title}
            </Typography>
          }
        >
          <Typography color="textSecondary" variant="caption">
            {offer.data().description}
          </Typography>
        </CardHeader>
        <CardActionArea>
          <CardMedia
            component="img"
            className={classes.offerImg}
            alt={offer.data().title}
            height="140"
            src={offer.data().imgURL || "/static/images/imgPlaceholder.png"}
            title={offer.data().title}
          />
          <CardContent>
            <Box mt={2} display="flex" alignItems="center">
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={() => {
                  setQRCodeIsOpen(true);
                  setRedeem(false);
                }}
              >
                Give stamp
              </Button>
            </Box>
            <Box mt={2} display="flex" alignItems="center">
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={() => {
                  setQRCodeIsOpen(true);
                  setRedeem(true);
                }}
              >
                Redeem stamp
              </Button>
            </Box>
            <Box mt={2} display="flex" alignItems="center">
              <Typography color="textSecondary" variant="caption">
                {offer.data().description}
              </Typography>
            </Box>
          </CardContent>
        </CardActionArea>
      </Card>
    </>
  );
};

Stamp.propTypes = {
  className: PropTypes.string,
};

export default Stamp;
