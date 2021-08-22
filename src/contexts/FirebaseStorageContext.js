import React, { useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import firebase from "firebase/app";
import firebaseApp from "src/firebase";
import "firebase/firestore";
import { storage } from "src/firebase";
import { useAuth } from "src/contexts/AuthContext";
import { v4 as uuidv4 } from "uuid";

const FirebaseStorageContext = React.createContext();

export function useFirebaseStorage() {
  return useContext(FirebaseStorageContext);
}

export function FirebaseStorageProvider({ children }) {
  const { currentUser } = useAuth();
  const [progress, setProgress] = useState(0);

  const handleUpload = async (image) => {
    return new Promise(function(resolve, reject) {
      const storageRef = storage.ref(`images/${currentUser.uid}/${uuidv4()}`);
      let imageMetadata = {
        cacheControl: "public,max-age=4000",
        customMetadata: {
          ownerID: currentUser.uid,
          originalFileName: image.name,
        },
      };
      const uploadTask = storageRef.put(image, imageMetadata);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(progress);
        },
        (error) => {
          console.log(error);
          reject();
        },
        () => {
          storageRef.getDownloadURL().then((url) => {
            resolve({ imgURL: url, imgRef: storageRef.fullPath });
          });
        }
      );
    });
  };

  const handleDelete = async (path) => {
    if (!path) return;

    const storageRef = storage.ref();
    const imageRef = storageRef.child(path);
    await imageRef.delete();
  };

  const value = {
    handleUpload,
    handleDelete,
  };

  return (
    <FirebaseStorageContext.Provider value={value}>
      {children}
    </FirebaseStorageContext.Provider>
  );
}

FirebaseStorageProvider.propTypes = {
  children: PropTypes.node,
};
