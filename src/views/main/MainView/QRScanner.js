import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  makeStyles,
} from "@material-ui/core";
import QrScan from "react-qr-reader";
import { useOffer } from "src/contexts/OfferContext";
import { useLoading } from "src/contexts/LoadingContext";

const useStyles = makeStyles((theme) => ({
  root: {
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
  paper: {
    maxWidth: "100vw",
  },
  QRcontainer: {
    display: "flex",
    justifyContent: "center",
    width: "50vmin",
  },
}));

const QRScanner = ({
  open,
  onEnter,
  onClose,
  offer,
  stampID,
  redeem,
  ...rest
}) => {
  const classes = useStyles();
  const { giveStamp, redeemStamp } = useOffer();
  const { loading, setLoading } = useLoading();
  const [scanCompleted, setScanCompleted] = useState(false);
  const [
    stampGivenSuccessDialogIsOpen,
    setStampGivenSuccessDialogIsOpen,
  ] = useState(false);
  /*  const handleScan = url => {
    if (url) {
      const claimedUserID = new URL(url).searchParams.get('id');
      console.log("scanned", claimedUserID, url);
      if (claimedUserID){
        setLoading({state:true, msg:'Processing User ID'});
        checkUserIsValid(claimedUserID).then((isValid)=>{
          if (isValid){
            setLoading({state:true, msg:'Preparing stamp'});
            giveStamp(offer.id, claimedUserID).then((id)=>{
              setLoading({state:false, msg:''});
              onClose();
              setScanCompleted(true);
            })
          }
        })
      }
    }
  }*/
  const handleScan = (url) => {
    if (!url || scanCompleted) return;
    console.log("scanning ", redeem);
    if (!redeem) {
      const claimedUserID = new URL(url).searchParams.get("id");
      const userToRedeem = new URL(url).searchParams.get("toredeem");
      console.log("give stamp, ", claimedUserID, userToRedeem);
      if (userToRedeem == "true") return;

      console.log("scanned", claimedUserID, url);
      setScanCompleted(true);
      if (claimedUserID) {
        setLoading({ state: true, msg: "Processing User ID" });
        giveStamp(offer.id, claimedUserID).then((id) => {
          setLoading({ state: false, msg: "" });
          onClose();
          setStampGivenSuccessDialogIsOpen(true);
        });
      }
    }

    if (redeem) {
      const claimedUserID = new URL(url).searchParams.get("id");
      const userToRedeem = new URL(url).searchParams.get("toredeem");
      const offerid = new URL(url).searchParams.get("offerid");
      setLoading({ state: true, msg: "Redeeming offer" });
      setScanCompleted(true);

      if (!userToRedeem || !claimedUserID || !offerid) {
        console.log("invalid stamp");
      }
      if (offerid !== offer.id) return;

      redeemStamp(claimedUserID, offerid).then((res) => {
        setLoading({ state: false, msg: "" });
        onClose();
        setStampGivenSuccessDialogIsOpen(true);
        console.log(res);
        if (res === 200) {
          console.log("redeem success");
        }
      });

      console.log("scanned", claimedUserID, userToRedeem, offerid, url);
    }
  };

  const handleError = (err) => {
    console.error(err);
  };

  return (
    <>
      <Dialog
        onClose={onClose}
        aria-labelledby="simple-dialog-title"
        open={open}
        {...rest}
        classes={{ root: classes.root, paper: classes.paper }}
      >
        <DialogTitle id="simple-dialog-title">{offer.data().title}</DialogTitle>
        <DialogContent dividers className={classes.QRcontainer}>
          <QrScan
            delay={300}
            onError={handleError}
            onScan={handleScan}
            style={{ height: "100%", width: "100%" }}
          />
        </DialogContent>
      </Dialog>
      <StampGivenSuccessDialog
        open={stampGivenSuccessDialogIsOpen}
        onClose={() => {
          setScanCompleted(false);
          setStampGivenSuccessDialogIsOpen(false);
        }}
      />
    </>
  );
};

export default QRScanner;

function StampGivenSuccessDialog({ open, onClose, ...rest }) {
  return (
    <Dialog
      onClose={onClose}
      aria-labelledby="simple-dialog-title"
      open={open}
      {...rest}
    >
      <DialogTitle id="simple-dialog-title">
        Stamp given successfully
      </DialogTitle>
    </Dialog>
  );
}
