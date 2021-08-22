import React, { useEffect, useState } from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import { Line } from "react-chartjs-2";
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

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));

const Sales = ({ className, ...rest }) => {
  const classes = useStyles();
  const theme = useTheme();
  const { stampsTimeDictionary, offers } = useOffer();
  const [stampsByDate, setStampsByDate] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [selectedOfferID, setSelectedOfferID] = useState();
  const [offerData, setOfferData] = useState(offers);
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
    const dataset = [];
    Object.keys(stampsTimeDictionary).forEach((offerID, index) => {
      dataset.push({
        type: "line",
        fill: false,
        borderColor: colorWheel[index % colorWheel.length][500],
        backgroundColor: colorWheel[index % colorWheel.length][500],
        data: stampsTimeDictionary[offerID] &&
          Object.keys(stampsTimeDictionary[offerID].total).indexOf(
            year.toString()
          ) > -1 && [...stampsTimeDictionary[offerID].total[year]],
        label: `Stamps given - ${getOfferInformation(offerID)}`,
      });
      dataset.push({
        type: "bar",
        fill: true,
        cornerRadius: 20,
        backgroundColor: colorWheel[index % colorWheel.length][200],
        data: stampsTimeDictionary[offerID] &&
          Object.keys(stampsTimeDictionary[offerID].redeemed).indexOf(
            year.toString()
          ) > -1 && [...stampsTimeDictionary[offerID].redeemed[year]],
        label: `Stamps redeemed - ${getOfferInformation(offerID)}`,
      });
    });
    setStampsByDate(dataset);
  }, [stampsTimeDictionary, year, offerData]);

  const data = {
    datasets: stampsByDate,
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
  };

  const options1 = {
    cornerRadius: 20,
    layout: { padding: 0 },
    legend: { display: true, position: "right" },
    maintainAspectRatio: false,
    responsive: true,
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

  const options = {
    cornerRadius: 10,
    layout: { padding: 5 },
    legend: {
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
    maintainAspectRatio: false,
    responsive: true,
  };

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <CardHeader
        action={
          <FormControl className={classes.formControl}>
            <InputLabel id="demo-simple-select-outlined-label">Year</InputLabel>
            <Select
              id="demo-simple-select-outlined"
              value={year}
              onChange={(event) => {
                setYear(event.target.value);
              }}
            >
              {[
                new Date().getFullYear() - 5,
                new Date().getFullYear() - 4,
                new Date().getFullYear() - 3,
                new Date().getFullYear() - 2,
                new Date().getFullYear() - 1,
                new Date().getFullYear(),
              ].map((year, index) => (
                <MenuItem key={index} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        }
        title="Stamp Transactions by Year"
      />
      <Divider />
      <CardContent>
        <Box height={400} position="relative">
          <Line data={data} options={options} />
        </Box>
      </CardContent>
    </Card>
  );
};

Sales.propTypes = {
  className: PropTypes.string,
};

export default Sales;
