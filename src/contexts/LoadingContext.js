import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';

const LoadingContext = React.createContext();


export function useLoading() {
  return useContext(LoadingContext);
}

export function LoadingProvider({ children }) {
  const [loading, setLoading] = useState({state: false, msg: ''});


  const value = {
    loading,
    setLoading
  };

  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  );
}

LoadingProvider.propTypes = {
  children: PropTypes.node
};
