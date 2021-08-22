import React, { useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import firebase from "firebase/app";
import firebaseApp, { db } from "src/firebase";
import "firebase/firestore";
import { useAuth } from "src/contexts/AuthContext";
import { ContactSupportOutlined } from "@material-ui/icons";

const OfferContext = React.createContext();

export function useOffer() {
  return useContext(OfferContext);
}

export function OfferProvider({ children }) {
  const [stampID, setStampID] = useState();
  const { currentUser } = useAuth();
  const [userStamps, setUserStamps] = useState();
  const [users, setUsers] = useState([]);
  const [offers, setOffers] = useState([]);
  const [stores, setStores] = useState([]);
  const [uniqueCustomerSet, setUniqueCustomerSet] = useState(new Set());
  const [redeemedStamps, setRedeemedStamps] = useState([]);
  const [redemptionTransaction, setRedemptionTransaction] = useState([]);
  const [stampsTimeDictionary, setStampsTimeDictionary] = useState({});

  useEffect(() => {
    getStamps();
    getOffers();
    getStores();
    getRedemptionTransaction();
    getUsers();
  }, []);

  function addDummyData() {
    const dummyData = [
      {
        createdTimestamp: firebase.firestore.FieldValue.serverTimestamp(),
        createdBy: currentUser.uid,
        title: "10 stamps = 1 free bubble tea.",
        description: "Earn a stamp with every purchase of bubble tea.",
        StartDate: new Date.now(),
        EndDate: new Date.now(),
        capacity: 10,
      },
      {
        createdTimestamp: firebase.firestore.FieldValue.serverTimestamp(),
        createdBy: currentUser.uid,
        title: "5 stamps = 1 free tea.",
        description: "Earn a stamp with every purchase of tea.",
        StartDate: new Date.now(),
        EndDate: new Date.now(),
        capacity: 5,
      },
    ];

    //const db = firebaseApp.firestore();
    dummyData.forEach((data) => {
      db.collection("offers")
        .doc()
        .set(data);
    });
  }

  async function createOffer(values, imgInfo = null) {
    if (!currentUser) return;

    //const db = firebaseApp.firestore();
    const doc = db.collection("offers").doc();
    await doc.set({
      createdTimestamp: firebase.firestore.FieldValue.serverTimestamp(),
      createdBy: currentUser.uid,
      ...imgInfo,
      ...values,
    });
    if (doc) {
      const userDoc = db.collection("users").doc(currentUser.id);
      await userDoc.update({
        offers: firebase.firestore.FieldValue.arrayUnion(`${doc.id}`),
      });
      return doc.id;
    }
  }

  async function updateOffer(offerID, values, imgInfo = null) {
    if (!currentUser) return;

    //const db = firebaseApp.firestore();
    const doc = db.collection("offers").doc(offerID);

    if (imgInfo) {
      await doc.update({
        ...values,
        ...imgInfo,
      });
    } else {
      await doc.update({
        ...values,
      });
    }
    if (doc) {
      console.log(await (await doc.get()).data(), imgInfo);
      return doc.id;
    }
  }

  async function deleteOffer(offerID) {
    //const db = firebaseApp.firestore();
    const doc = db.collection("offers").doc(offerID);
    const offerData = await doc.get();
    await doc.delete();
  }

  async function checkUserIsValid(claimedUserID) {
    //const db = firebaseApp.firestore();
    return (
      await db
        .collection("users")
        .doc(claimedUserID)
        .get()
    ).exists;
  }

  function getUserName(claimedUserID) {
    for (let i = 0; i < users.length; i++) {
      if (users[i].id === claimedUserID) {
        return users[i];
      }
    }
  }

  function getUsers() {
    if (!currentUser) return;

    //const db = firebaseApp.firestore();
    db.collection("users").onSnapshot(
      (querySnapshot) => {
        setUsers(querySnapshot.docs);
        console.log("users", querySnapshot.docs);
      },
      (err) => {
        console.log(`Encountered error: ${err}`);
      }
    );
  }

  async function updateProfilePicture(imgURL) {
    await db
      .collection("users")
      .doc(currentUser.uid)
      .update({
        imgURL: imgURL,
      });
  }

  async function updateProfile(values) {
    await db
      .collection("users")
      .doc(currentUser.uid)
      .update({
        ...values,
      });
  }

  /*
  async function createOffer(values, url){
    values.createdTimestamp = firebase.firestore.FieldValue.serverTimestamp();
    values.createdBy = currentUser.uid;
    values.imgURL = url;
    //const db = firebaseApp.firestore();
    const doc = db.collection('offers').doc();
    await doc.set(values);
    return doc.id;
  }


  async function giveStamp(offerID) {
    //const db = firebaseApp.firestore();
    const doc = db.collection('stamps').doc()
    await doc.set(
      {
        offerID: offerID,
        claimedTimestamp: null,
        createdTimestamp: firebase.firestore.FieldValue.serverTimestamp(),
        claimedBy: null,
        isClaimed: false,
        isRedeemed: false,
        redeemedTimestamp: null,
        storeID: currentUser.uid,
      });
    console.log('stamp res', doc)
    if (!doc) {
      console.log('No such document!');
    } else {
      console.log('Document doc:',  doc.id);
      return doc.id;
    }
  }*/

  async function giveStamp(offerID, claimedUserID) {
    //const db = firebaseApp.firestore();
    const doc = db.collection("stamps").doc();
    await doc.set({
      offerID: offerID,
      createdTimestamp: firebase.firestore.FieldValue.serverTimestamp(),
      claimedBy: claimedUserID,
      isRedeemed: false,
      redemptionID: null,
      redeemedTimestamp: null,
      storeID: currentUser.uid,
    });
    console.log("stamp res", doc);
    if (!doc) {
      console.log("No such document!");
    } else {
      console.log("Document doc:", doc.id);
      const userDoc = db.collection("userStamps").doc(claimedUserID);
      await userDoc.update({
        [offerID]: firebase.firestore.FieldValue.arrayUnion(`${doc.id}`),
      });
      return doc.id;
    }
  }

  async function redeemStamp(claimedUserID, offerid) {
    const capacity = (
      await db
        .collection("offers")
        .doc(offerid)
        .get()
    ).data().capacity;

    console.log("capacity", capacity, claimedUserID, offerid);
    const userStamps = (
      await db
        .collection("userStamps")
        .doc(claimedUserID)
        .get()
    ).data()[offerid];

    console.log("userStamps", userStamps, capacity, claimedUserID, offerid);
    const currentNumberOfStamps = userStamps.length;

    const redemptionsDoc = db.collection("redemptionTransaction").doc();

    if (currentNumberOfStamps >= capacity) {
      let stampsCount = 0;
      let index = 0;
      let tasks = [];
      let stampsArray = [];

      while (stampsCount < capacity) {
        if (index >= currentNumberOfStamps) return 404;

        console.log(index);
        const stampID = userStamps[index];

        const isRedeemed = (
          await db
            .collection("stamps")
            .doc(stampID)
            .get()
        ).data().isRedeemed;
        console.log("to redeem: ", stampID);

        if (isRedeemed == false) {
          stampsArray.push(stampID);

          const stampDoc = db.collection("stamps").doc(stampID);
          tasks.push(() =>
            stampDoc.update({
              isRedeemed: true,
              redemptionID: redemptionsDoc.id,
              redeemedTimestamp: firebase.firestore.FieldValue.serverTimestamp(),
            })
          );

          const userStampsDoc = db.collection("userStamps").doc(claimedUserID);
          tasks.push(() =>
            userStampsDoc.update({
              [offerid]: firebase.firestore.FieldValue.arrayRemove(stampID),
            })
          );

          stampsCount++;
        }
        index++;
      }

      Promise.all(tasks.map((t) => t())).then((resolvedValues) => {
        console.log(resolvedValues);
        redemptionsDoc
          .set({
            offerID: offerid,
            approvedBy: currentUser.uid,
            redeemedStamps: stampsArray,
            redeemedBy: claimedUserID,
            redeemedTimestamp: firebase.firestore.FieldValue.serverTimestamp(),
          })
          .then();
      });

      return 200;
    } else {
      console.log("Insufficient stamps");
    }
  }

  async function deleteStamp(stampID) {
    //const db = firebaseApp.firestore();
    const doc = db.collection("stamps").doc(stampID);
    const stampData = await doc.get();
    if (stampData && stampData.data().isClaimed == false) {
      const res = await doc.delete();
    }
  }

  function getStamps() {
    if (!currentUser) return;

    //const db = firebaseApp.firestore();
    db.collection("stamps")
      .where("storeID", "==", currentUser.uid)
      .onSnapshot(
        (querySnapshot) => {
          setUserStamps(querySnapshot.docs);

          let customersSet = new Set();
          let redeemedStamps = [];

          let stampsTimeDic = {};

          console.log(stampsTimeDic);
          querySnapshot.docs.forEach((stamp) => {
            customersSet.add(stamp.data().claimedBy);
            if (stamp.data().isRedeemed === true) {
              redeemedStamps.push(stamp);
            }

            if (Object.keys(stampsTimeDic).indexOf(stamp.data().offerID) < 0) {
              stampsTimeDic[stamp.data().offerID] = { total: {}, redeemed: {} };
            }

            if (!stamp.data().createdTimestamp) {
              return;
            }
            let stampDate = stamp.data().createdTimestamp.toDate();
            Object.keys(stampsTimeDic).forEach((offerID) => {
              if (
                Object.keys(stampsTimeDic[offerID].total).indexOf(
                  stampDate.getFullYear().toString()
                ) < 0
              ) {
                stampsTimeDic[offerID].total[
                  stampDate.getFullYear()
                ] = new Array(12).fill(0);
              }
              if (
                Object.keys(stampsTimeDic[offerID].redeemed).indexOf(
                  stampDate.getFullYear().toString()
                ) < 0
              ) {
                stampsTimeDic[offerID].redeemed[
                  stampDate.getFullYear()
                ] = new Array(12).fill(0);
              }
            });

            if (stamp.data().isRedeemed == true) {
              stampsTimeDic[stamp.data().offerID].redeemed[
                stampDate.getFullYear()
              ][stampDate.getMonth()]++;
            }
            stampsTimeDic[stamp.data().offerID].total[stampDate.getFullYear()][
              stampDate.getMonth()
            ]++;
          });
          setRedeemedStamps(redeemedStamps);
          setUniqueCustomerSet(customersSet);
          setStampsTimeDictionary(stampsTimeDic);
        },
        (err) => {
          console.log(`Encountered error: ${err}`);
        }
      );
  }

  function getOffers() {
    if (!currentUser) return;

    //const db = firebaseApp.firestore();
    db.collection("offers")
      .where("createdBy", "==", currentUser.uid)
      .onSnapshot(
        (querySnapshot) => {
          console.log("offers", querySnapshot.docs);
          setOffers(querySnapshot.docs);
        },
        (err) => {
          console.log(`Encountered error: ${err}`);
        }
      );
  }

  function getStores() {
    if (!currentUser) return;

    db.collection("shops")
      .where("storeOwnerID", "==", currentUser.uid)
      .onSnapshot(
        (querySnapshot) => {
          setStores(querySnapshot.docs);
        },
        (err) => {
          console.log(`Encountered error: ${err}`);
        }
      );
  }

  function getRedemptionTransaction() {
    if (!currentUser) return;

    db.collection("redemptionTransaction")
      .where("approvedBy", "==", currentUser.uid)
      .onSnapshot(
        (querySnapshot) => {
          setRedemptionTransaction(querySnapshot.docs);
        },
        (err) => {
          console.log(`Encountered error: ${err}`);
        }
      );
  }

  async function getStoreInfo(storeID) {
    if (!currentUser) return;

    //const db = firebaseApp.firestore();
    const doc = db.collection("shops").doc(storeID);
    const data = await doc.get();
    if (data.exists) {
      return data;
    }
  }

  async function uploadNewStore(values, imgInfo = null) {
    if (!currentUser) return;

    //const db = firebaseApp.firestore();
    const doc = db.collection("shops").doc();

    await doc.set({
      storeOwnerID: currentUser.uid,
      ...imgInfo,
      ...values,
    });
    if (doc) {
      return doc.id;
    }
  }

  async function updateStore(storeID, values, imgInfo = null) {
    if (!currentUser) return;

    //const db = firebaseApp.firestore();
    const doc = db.collection("shops").doc(storeID);
    console.log(imgInfo);
    if (imgInfo) {
      console.log("true");

      await doc.update({
        ...values,
        ...imgInfo,
      });
    } else {
      await doc.update({
        ...values,
      });
    }
    if (doc) {
      console.log(await (await doc.get()).data(), imgInfo);
      return doc.id;
    }
  }

  const getStoreInformation = (offerID) => {
    let offerInfo = getOfferInformation(offerID);

    if (!offerInfo) {
      return;
    }

    for (let i = 0; i < stores.length; i++) {
      if (stores[i].id === offerInfo.data().storeID) {
        return stores[i];
      }
    }
  };

  const getOfferInformation = (offerID) => {
    for (let i = 0; i < offers.length; i++) {
      if (offers[i].id === offerID) {
        return offers[i];
      }
    }
  };

  async function getOfferInfo(offerID) {
    const doc = db.collection("offers").doc(offerID);
    const offerData = await doc.get();
    return offerData;
  }

  const value = {
    uniqueCustomerSet,
    redeemedStamps,
    stampID,
    userStamps,
    stampsTimeDictionary,
    setStampID,
    giveStamp,
    deleteStamp,
    getStamps,
    redeemStamp,
    offers,
    getOffers,
    createOffer,
    updateOffer,
    deleteOffer,
    getOfferInfo,
    getOfferInformation,
    users,
    checkUserIsValid,
    getUserName,
    updateProfile,
    updateProfilePicture,
    stores,
    getStores,
    getStoreInfo,
    uploadNewStore,
    updateStore,
    getStoreInformation,
    redemptionTransaction,
  };

  return (
    <OfferContext.Provider value={value}>{children}</OfferContext.Provider>
  );
}

OfferProvider.propTypes = {
  children: PropTypes.node,
};
