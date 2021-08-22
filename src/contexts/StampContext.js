import React, { useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import firebase from 'firebase/app';
import firebaseApp from 'src/firebase';
import 'firebase/firestore';
import { useAuth } from 'src/contexts/AuthContext';
const StampContext = React.createContext();

const dummyData = [
  {
    claimedBy: "WrqPjJbtUogUAolBoXozLzy6EdJ2",
    claimedTimestamp: firebase.firestore.FieldValue.serverTimestamp(),
    createdTimestamp: firebase.firestore.FieldValue.serverTimestamp(),
    isClaimed: true,
    isRedeemed: false,
    redeemedTimestamp: firebase.firestore.FieldValue.serverTimestamp(),
    storeID: "abc124",
    value: 1
  },
  {
    claimedBy: "WrqPjJbtUogUAolBoXozLzy6EdJ2",
    claimedTimestamp: firebase.firestore.FieldValue.serverTimestamp(),
    createdTimestamp: firebase.firestore.FieldValue.serverTimestamp(),
    isClaimed: true,
    isRedeemed: false,
    redeemedTimestamp: firebase.firestore.FieldValue.serverTimestamp(),
    storeID: "abc125",
    value: 10
  },
  {
    claimedBy: "WrqPjJbtUogUAolBoXozLzy6EdJ2",
    claimedTimestamp: firebase.firestore.FieldValue.serverTimestamp(),
    createdTimestamp: firebase.firestore.FieldValue.serverTimestamp(),
    isClaimed: true,
    isRedeemed: false,
    redeemedTimestamp: firebase.firestore.FieldValue.serverTimestamp(),
    storeID: "abc126",
    value: 2
  },
];

export function useStamp() {
  return useContext(StampContext);
}

export function StampProvider({ children }) {
  const [stampID, setStampID] = useState();
  const {currentUser} = useAuth();
  const [userStamps, setUserStamps]= useState();

  useEffect(()=>{
    const db = firebaseApp.firestore();
    getStamps();
    /*dummyData.forEach((data)=>{
      db.collection('stamps').doc().set(data);
    })*/
  }, [])

  async function redeemStamp() {
    const db = firebaseApp.firestore();
    const data = await db.collection('stamps').doc(stampID).update({claimedBy: currentUser.uid, isClaimed: true, claimedTimestamp: firebase.firestore.FieldValue.serverTimestamp()});
    if (!data) {
      console.log('No such document!', stampID);
    } else {
      //await db.collection('stamps').doc(stampID).update({claimedBy: currentUser.uid, isClaimed: true, claimedTimestamp: firebase.firestore.FieldValue.serverTimestamp()});
      console.log('Document data:', data.data(), stampID);
    }
  }

  async function getStamps() {
    if (!currentUser) return;
    
    const db = firebaseApp.firestore();
    const data = await db.collection('stamps').where('claimedBy','==',currentUser.uid).get();
    data.docs.forEach((doc)=>{
      console.log(doc.data());
    })
    setUserStamps(data.docs);
    return data.docs;
  }

  const value = {
    stampID,
    userStamps,
    setStampID,
    redeemStamp,
    getStamps
  };

  return (
    <StampContext.Provider value={value}>
      {children}
    </StampContext.Provider>
  );
}

StampProvider.propTypes = {
  children: PropTypes.node
};
