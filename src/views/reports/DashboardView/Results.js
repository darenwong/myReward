import React, { useState } from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import moment from "moment";
import PerfectScrollbar from "react-perfect-scrollbar";
import {
  Avatar,
  Box,
  Card,
  CardHeader,
  Checkbox,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  makeStyles,
} from "@material-ui/core";
import getInitials from "src/utils/getInitials";
import { useOffer } from "src/contexts/OfferContext";

const useStyles = makeStyles((theme) => ({
  root: {},
  avatar: {
    marginRight: theme.spacing(2),
  },
}));

const Results = ({ className, userStamps, ...rest }) => {
  const classes = useStyles();
  const [selectedCustomerIds, setSelectedCustomerIds] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const customers = [];
  const { getStoreInformation, getOfferInformation, getUserName } = useOffer();

  const handleSelectAll = (event) => {
    let newSelectedCustomerIds;

    if (event.target.checked) {
      newSelectedCustomerIds = userStamps.map((stamp) => stamp.id);
    } else {
      newSelectedCustomerIds = [];
    }
    setSelectedCustomerIds(newSelectedCustomerIds);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedCustomerIds.indexOf(id);
    let newSelectedCustomerIds = [];

    if (selectedIndex === -1) {
      newSelectedCustomerIds = newSelectedCustomerIds.concat(
        selectedCustomerIds,
        id
      );
    } else if (selectedIndex === 0) {
      newSelectedCustomerIds = newSelectedCustomerIds.concat(
        selectedCustomerIds.slice(1)
      );
    } else if (selectedIndex === selectedCustomerIds.length - 1) {
      newSelectedCustomerIds = newSelectedCustomerIds.concat(
        selectedCustomerIds.slice(0, -1)
      );
    } else if (selectedIndex > 0) {
      newSelectedCustomerIds = newSelectedCustomerIds.concat(
        selectedCustomerIds.slice(0, selectedIndex),
        selectedCustomerIds.slice(selectedIndex + 1)
      );
    }

    setSelectedCustomerIds(newSelectedCustomerIds);
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
    setPage(0);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  if (!userStamps) return null;

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <CardHeader title="Stamp Transactions" />
      <Divider />
      <PerfectScrollbar>
        <Box minWidth={1050}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedCustomerIds.length === userStamps.length}
                    color="primary"
                    indeterminate={
                      selectedCustomerIds.length > 0 &&
                      selectedCustomerIds.length < customers.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>Stamp Ref</TableCell>
                <TableCell>Offer</TableCell>
                <TableCell>Store</TableCell>
                <TableCell>Claimed by</TableCell>
                <TableCell>Claimed on</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userStamps
                .slice(page * limit, page * limit + limit)
                .map((stamp) => (
                  <TableRow
                    hover
                    key={stamp.id}
                    selected={selectedCustomerIds.indexOf(stamp.id) !== -1}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedCustomerIds.indexOf(stamp.id) !== -1}
                        onChange={(event) => handleSelectOne(event, stamp.id)}
                        value="true"
                      />
                    </TableCell>
                    <TableCell>
                      <Box alignItems="center" display="flex">
                        <Typography color="textPrimary" variant="body1">
                          {stamp.id}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {getOfferInformation(stamp.data().offerID) &&
                        getOfferInformation(stamp.data().offerID).data().title}
                    </TableCell>
                    <TableCell>
                      {getStoreInformation(stamp.data().offerID) &&
                        getStoreInformation(stamp.data().offerID).data().name}
                    </TableCell>
                    <TableCell>
                      {getUserName(stamp.data().claimedBy) &&
                        getUserName(stamp.data().claimedBy).data().firstName +
                          " " +
                          getUserName(stamp.data().claimedBy).data().lastName}
                    </TableCell>
                    <TableCell>
                      {stamp
                        .data()
                        .createdTimestamp.toDate()
                        .toDateString()}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={userStamps.length}
        onChangePage={handlePageChange}
        onChangeRowsPerPage={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

Results.propTypes = {
  className: PropTypes.string,
  customers: PropTypes.array.isRequired,
};

export default Results;
