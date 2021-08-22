import React, { useEffect } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
  Hidden,
  List,
  Typography,
  makeStyles,
} from "@material-ui/core";
import {
  AlertCircle as AlertCircleIcon,
  BarChart as BarChartIcon,
  Lock as LockIcon,
  Settings as SettingsIcon,
  ShoppingBag as ShoppingBagIcon,
  User as UserIcon,
  UserPlus as UserPlusIcon,
  Users as UsersIcon,
  Home as HomeIcon,
} from "react-feather";
import RedeemIcon from "@material-ui/icons/Redeem";
import StorefrontIcon from "@material-ui/icons/Storefront";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import NavItem from "./NavItem";
import { useAuth } from "src/contexts/AuthContext";
import { useOffer } from "src/contexts/OfferContext";

const user = {
  avatar: "/static/images/avatars/avatar_6.png",
  jobTitle: "Senior Developer",
  name: "Katarina Smith",
};

const items = [
  {
    href: "/app/main",
    icon: RedeemIcon,
    title: "Offers",
  },
  {
    href: "/app/dashboard",
    icon: BarChartIcon,
    title: "Dashboard",
  },
  {
    href: "/app/stores",
    icon: StorefrontIcon,
    title: "Stores",
  },
  {
    href: "/app/account",
    icon: UserIcon,
    title: "Account",
  },
  {
    href: "/logout",
    icon: ExitToAppIcon,
    title: "Logout",
  },
];

const useStyles = makeStyles(() => ({
  mobileDrawer: {
    width: 256,
  },
  desktopDrawer: {
    width: 256,
    top: 64,
    height: "calc(100% - 64px)",
  },
  avatar: {
    cursor: "pointer",
    width: 64,
    height: 64,
  },
}));

const NavBar = ({ onMobileClose, openMobile }) => {
  const classes = useStyles();
  const location = useLocation();
  const { currentUser } = useAuth();
  const { getUserName } = useOffer();

  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const content = (
    <Box height="100%" display="flex" flexDirection="column">
      <Box alignItems="center" display="flex" flexDirection="column" p={2}>
        <Avatar
          className={classes.avatar}
          component={RouterLink}
          src={
            getUserName(currentUser.uid) &&
            getUserName(currentUser.uid).data().imgURL
          }
          to="/app/account"
        />
        <Typography className={classes.name} color="textPrimary" variant="h5">
          {getUserName(currentUser.uid) &&
            getUserName(currentUser.uid).data().firstName +
              " " +
              getUserName(currentUser.uid).data().lastName}
        </Typography>
        <Typography color="textSecondary" variant="body2">
          {currentUser.email}
        </Typography>
      </Box>
      <Divider />
      <Box p={2}>
        <List>
          {items.map((item) => (
            <NavItem
              href={item.href}
              key={item.title}
              title={item.title}
              icon={item.icon}
            />
          ))}
        </List>
      </Box>
    </Box>
  );

  return (
    <>
      <Hidden lgUp>
        <Drawer
          anchor="left"
          classes={{ paper: classes.mobileDrawer }}
          onClose={onMobileClose}
          open={openMobile}
          variant="temporary"
        >
          {content}
        </Drawer>
      </Hidden>
      <Hidden mdDown>
        <Drawer
          anchor="left"
          classes={{ paper: classes.desktopDrawer }}
          open
          variant="persistent"
        >
          {content}
        </Drawer>
      </Hidden>
    </>
  );
};

NavBar.propTypes = {
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool,
};

NavBar.defaultProps = {
  onMobileClose: () => {},
  openMobile: false,
};

export default NavBar;
