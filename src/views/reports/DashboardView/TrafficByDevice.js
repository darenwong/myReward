import React, { useEffect, useState } from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import { Doughnut } from "react-chartjs-2";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Typography,
  colors,
  makeStyles,
  useTheme,
} from "@material-ui/core";
import LaptopMacIcon from "@material-ui/icons/LaptopMac";
import PhoneIcon from "@material-ui/icons/Phone";
import TabletIcon from "@material-ui/icons/Tablet";
import { useOffer } from "src/contexts/OfferContext";
import data from "src/views/customer/CustomerListView/data";

const useStyles = makeStyles(() => ({
  root: {
    height: "100%",
  },
}));

const TrafficByDevice = ({ className, ...rest }) => {
  const classes = useStyles();
  const theme = useTheme();
  const { stampsTimeDictionary, offers } = useOffer();
  const [doughnutData, setDoughnutData] = useState([]);
  const [offerData, setOfferData] = useState();
  const [year, setYear] = useState(new Date().getFullYear());
  const colorWheel = [
    colors.indigo,
    colors.red,
    colors.purple,
    colors.lime,
    colors.orange,
    colors.yellow,
    colors.green,
    colors.cyan,
  ];

  const datasetKeyProvider = () => {
    return btoa(Math.random()).substring(0, 12);
  };

  const getOfferInformation = (offerID) => {
    return offerData && offerData[offerID] && offerData[offerID].title;
  };

  useEffect(() => {
    const dic = {};
    for (let i = 0; i < offers.length; i++) {
      dic[offers[i].id] = offers[i].data();
    }
    setOfferData(dic);
  }, [offers]);

  useEffect(() => {
    const datasets = [
      {
        data: [],
        backgroundColor: [],
      },
      {
        data: [],
        backgroundColor: [],
      },
    ];
    const labels = [];

    Object.keys(stampsTimeDictionary).forEach((offerID, index) => {
      datasets[0].data.push(
        Number(
          Object.values(stampsTimeDictionary[offerID].total[year]).reduce(
            (a, b) => a + b,
            0
          )
        )
      );
      //datasets[0].data.push(0);
      //datasets[0].data.push(0);
      labels.push(getOfferInformation(offerID));
      datasets[0].backgroundColor.push(
        colorWheel[index % colorWheel.length][500]
      );
      /*
      datasets[0].backgroundColor.push(
        colorWheel[index % colorWheel.length][500]
      );
      datasets[0].backgroundColor.push(
        colorWheel[index % colorWheel.length][500]
      );
      datasets[1].data.push(0);
      datasets[1].data.push(
        Number(
          Object.values(stampsTimeDictionary[offerID].redeemed[year]).reduce(
            (a, b) => a + b,
            0
          )
        )
      );
      datasets[1].data.push(
        Number(
          datasets[0].data[datasets[0].data.length - 1] -
            datasets[1].data[datasets[1].data.length - 1]
        )
      );
      labels.push(`Stamps redeemed - ${offerID}`);
      labels.push(`Stamps not redeemed - ${offerID}`);
      datasets[1].backgroundColor.push(
        colorWheel[index % colorWheel.length][500]
      );
      datasets[1].backgroundColor.push(
        colorWheel[index % colorWheel.length][500]
      );
      datasets[1].backgroundColor.push(
        colorWheel[index % colorWheel.length][500]
      );*/
    });
    setDoughnutData({ datasets, labels });
  }, [stampsTimeDictionary, offerData]);

  const options = {
    cutoutPercentage: 60,
    layout: { padding: 0 },
    legend: {
      display: true,
    },
    maintainAspectRatio: false,
    responsive: true,
    tooltips: {
      backgroundColor: theme.palette.background.default,
      bodyFontColor: theme.palette.text.secondary,
      borderColor: theme.palette.divider,
      borderWidth: 1,
      enabled: true,
      footerFontColor: theme.palette.text.secondary,
      intersect: false,
      mode: "index",
      titleFontColor: theme.palette.text.primary,
    },
  };

  const devices = [
    {
      title: "Desktop",
      value: 63,
      icon: LaptopMacIcon,
      color: colors.indigo[500],
    },
    {
      title: "Tablet",
      value: 15,
      icon: TabletIcon,
      color: colors.red[600],
    },
    {
      title: "Mobile",
      value: 23,
      icon: PhoneIcon,
      color: colors.orange[600],
    },
  ];

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <CardHeader title="Stamps by Offer" />
      <Divider />
      <CardContent>
        <Box height={300} position="relative">
          <Doughnut
            data={doughnutData}
            options={options}
            datasetKeyProvider={datasetKeyProvider}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

TrafficByDevice.propTypes = {
  className: PropTypes.string,
};

export default TrafficByDevice;
