import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { CircularProgress, Backdrop, makeStyles } from '@material-ui/core';
import NavBar from './NavBar';
import TopBar from './TopBar';
import { useLoading } from 'src/contexts/LoadingContext';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    display: 'flex',
    height: '100%',
    overflow: 'hidden',
    width: '100%'
  },
  wrapper: {
    display: 'flex',
    flex: '1 1 auto',
    overflow: 'hidden',
    paddingTop: 64,
    [theme.breakpoints.up('lg')]: {
      paddingLeft: 256
    }
  },
  contentContainer: {
    display: 'flex',
    flex: '1 1 auto',
    overflow: 'hidden'
  },
  content: {
    flex: '1 1 auto',
    height: '100%',
    overflow: 'auto'
  },  
  backdrop: {
    zIndex: 1500,
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
  },
}));

const DashboardLayout = () => {
  const classes = useStyles();
  const [isMobileNavOpen, setMobileNavOpen] = useState(false);
  const { loading } = useLoading();

  return (
    <div className={classes.root}>
      <Backdrop className={classes.backdrop} open={loading.state}><CircularProgress/> {loading.msg}</Backdrop>
      <TopBar onMobileNavOpen={() => setMobileNavOpen(true)} />
      <NavBar
        onMobileClose={() => setMobileNavOpen(false)}
        openMobile={isMobileNavOpen}
      />
      <div className={classes.wrapper}>
        <div className={classes.contentContainer}>
          <div className={classes.content}>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
