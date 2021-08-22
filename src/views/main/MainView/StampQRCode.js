import React, {useState} from 'react';
import {
  Dialog,
  DialogTitle,
} from '@material-ui/core';
import QRCode from 'qrcode.react';

const ENDPOINT = 'http://localhost:3000/login?';

const StampQRCode = ({open, onEnter, onClose, offer, stampID, ...rest}) => {

  return (
    <Dialog onClose={onClose} onEnter={onEnter} aria-labelledby="simple-dialog-title" open={open} {...rest}>
      <DialogTitle id="simple-dialog-title">{offer.data().title}</DialogTitle>
      <QRCode value={`${ENDPOINT}id=${stampID}`} />
    </Dialog>
  )
}

export default StampQRCode;