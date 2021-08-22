import React, { useState, useEffect } from "react";
import {
  Card,
  CardActionArea,
  CardContent,
  makeStyles,
} from "@material-ui/core";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import AddStoreDialog from "./AddStoreDialog";

const useStyles = makeStyles((theme) => ({
  addButtonCard: {
    height: "100%",
    textAlign: "center",
  },
  addButtonIcon: {
    fontSize: "5vh",
  },
}));

function AddStoreButton({ existingStoreData, ...rest }) {
  const classes = useStyles();
  const [addStorePageIsOpen, setAddStorePageIsOpen] = useState(false);

  function handleClose() {
    setAddStorePageIsOpen(false);
  }

  return (
    <>
      <Card style={{ height: "100%" }}>
        <CardActionArea
          className={classes.addButtonCard}
          onClick={() => {
            setAddStorePageIsOpen(true);
          }}
        >
          <CardContent>
            <AddCircleIcon
              color="secondary"
              className={classes.addButtonIcon}
            />
          </CardContent>
        </CardActionArea>
      </Card>
      <AddStoreDialog open={addStorePageIsOpen} onClose={handleClose} />
    </>
  );
}
export default AddStoreButton;
