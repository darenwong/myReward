import React, { useEffect, useState } from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import { Line, Bar } from "react-chartjs-2";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  FormHelperText,
  Checkbox,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
  makeStyles,
  colors,
} from "@material-ui/core";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import { useOffer } from "src/contexts/OfferContext";
import { MicNone } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));

const StampsBar = ({ className, ...rest }) => {
  const classes = useStyles();
  const theme = useTheme();
  const { stampsTimeDictionary, offers } = useOffer();
  const [stampsByDate, setStampsByDate] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [selectedOfferID, setSelectedOfferID] = useState();
  const [offerData, setOfferData] = useState(offers);
  const [dataset, setDataset] = useState();
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

  useEffect(() => {
    const dic = {};
    for (let i = 0; i < offers.length; i++) {
      dic[offers[i].id] = offers[i].data();
    }
    setOfferData(dic);
  }, [offers]);

  const getOfferInformation = (offerID) => {
    return offerData && offerData[offerID] && offerData[offerID].title;
  };

  useEffect(() => {
    const datasets = [
      {
        label: "Redeemed",
        data: [],
        backgroundColor: [],
        stack: "1",
      },
      {
        label: "Not redeemed",
        data: [],
        backgroundColor: [],
        stack: "1",
      },
    ];
    const labels = [];

    Object.keys(stampsTimeDictionary).forEach((offerID, index) => {
      const total = Number(
        Object.values(stampsTimeDictionary[offerID].total[year]).reduce(
          (a, b) => a + b,
          0
        )
      );
      console.log(total);
      /*
      datasets[0].data.push(
        Number(
          Object.values(stampsTimeDictionary[offerID].total[year]).reduce(
            (a, b) => a + b,
            0
          )
        )
      );
      datasets[0].backgroundColor.push(
        colorWheel[index % colorWheel.length][500]
      );*/
      labels.push(getOfferInformation(offerID));
      datasets[0].data.push(
        Number(
          Object.values(stampsTimeDictionary[offerID].redeemed[year]).reduce(
            (a, b) => a + b,
            0
          )
        )
      );
      datasets[1].data.push(
        Number(total - datasets[0].data[datasets[0].data.length - 1])
      );
      //labels.push(`Stamps redeemed - ${offerID}`);
      //labels.push(`Stamps not redeemed - ${offerID}`);
      /*datasets[1].backgroundColor.push(
        colorWheel[index % colorWheel.length][500]
      );*/

      datasets[0].backgroundColor.push(
        colorWheel[index % colorWheel.length][500]
      );
      datasets[1].backgroundColor.push(
        colorWheel[index % colorWheel.length][900]
      );
    });
    setDataset({ datasets, labels });
  }, [stampsTimeDictionary, offerData]);

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    cornerRadius: 10,
    layout: { padding: 5 },
    legend: {
      display: false,
      labels: {
        usePointStyle: true,
      },
      position: "bottom",
    },
    scales: {
      xAxes: [
        {
          barThickness: 12,
          maxBarThickness: 10,
          barPercentage: 0.5,
          categoryPercentage: 0.5,
          ticks: {
            fontColor: theme.palette.text.secondary,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        },
      ],
      yAxes: [
        {
          ticks: {
            fontColor: theme.palette.text.secondary,
            beginAtZero: true,
            min: 0,
            stepSize: 10,
          },
          gridLines: {
            borderDash: [2],
            borderDashOffset: [2],
            color: theme.palette.divider,
            drawBorder: false,
            zeroLineBorderDash: [2],
            zeroLineBorderDashOffset: [2],
            zeroLineColor: theme.palette.divider,
          },
        },
      ],
    },
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

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <CardHeader title="Stamps Breakdown" />
      <Divider />
      <CardContent>
        <Box height={400} position="relative">
          <Bar data={dataset} options={options} />
        </Box>
      </CardContent>
    </Card>
  );
};

StampsBar.propTypes = {
  className: PropTypes.string,
};

export default StampsBar;
