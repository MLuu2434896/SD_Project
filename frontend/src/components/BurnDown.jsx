import React from "react";
import { Chart } from "react-google-charts";
import moment from "moment";



const BurnDown = () => {
  
  //Expected Rate
  var CurrentDate = moment();
  var SprintDate = window.DateGlobal;
  var x = CurrentDate.diff(SprintDate, 'days');
  console.log("DATE DIFFERENCE", x);
  console.log("DATE CURR", CurrentDate);
  console.log("DATE SPRINT", SprintDate);

  console.log("NUM TASK ", window.sendTaskLength);
  var ExpectedRate = (window.sendTaskLength/14);
  console.log("EXPECTED RATE", ExpectedRate);

  console.log("NUM TASK COMP ", window.sendCompletedLength);
  var ActualRate = (window.sendCompletedLength/(x+1));
  console.log("ACTUAL RATE", ActualRate);
  
  var TaskCount = window.sendTaskLength;
  
   const data = [
    ["Days", "Expected", "Actual"],
    ["1", (window.sendTaskLength - Math.floor(1 * ExpectedRate)) < 0 ? 0 : (window.sendTaskLength - Math.floor(1 * ExpectedRate)), (window.sendTaskLength - Math.floor(1 * ActualRate)) < 0 ? 0 : (window.sendTaskLength - Math.floor(1 * ActualRate))],
    ["2", (window.sendTaskLength - Math.floor(2 * ExpectedRate)) < 0 ? 0 : (window.sendTaskLength - Math.floor(2 * ExpectedRate)), (window.sendTaskLength - Math.floor(2 * ActualRate)) < 0 ? 0 : (window.sendTaskLength - Math.floor(2 * ActualRate))],
    ["3", (window.sendTaskLength - Math.floor(3 * ExpectedRate)) < 0 ? 0 : (window.sendTaskLength - Math.floor(3 * ExpectedRate)), (window.sendTaskLength - Math.floor(3 * ActualRate)) < 0 ? 0 : (window.sendTaskLength - Math.floor(3 * ActualRate))],
    ["4", (window.sendTaskLength - Math.floor(4 * ExpectedRate)) < 0 ? 0 : (window.sendTaskLength - Math.floor(4 * ExpectedRate)), (window.sendTaskLength - Math.floor(4 * ActualRate)) < 0 ? 0 : (window.sendTaskLength - Math.floor(4 * ActualRate))],
    ["5", (window.sendTaskLength - Math.floor(5 * ExpectedRate)) < 0 ? 0 : (window.sendTaskLength - Math.floor(5 * ExpectedRate)), (window.sendTaskLength - Math.floor(5 * ActualRate)) < 0 ? 0 : (window.sendTaskLength - Math.floor(5 * ActualRate))],
    ["6", (window.sendTaskLength - Math.floor(6 * ExpectedRate)) < 0 ? 0 : (window.sendTaskLength - Math.floor(6 * ExpectedRate)), (window.sendTaskLength - Math.floor(6 * ActualRate)) < 0 ? 0 : (window.sendTaskLength - Math.floor(6 * ActualRate))],
    ["7", (window.sendTaskLength - Math.floor(7 * ExpectedRate)) < 0 ? 0 : (window.sendTaskLength - Math.floor(7 * ExpectedRate)), (window.sendTaskLength - Math.floor(7 * ActualRate)) < 0 ? 0 : (window.sendTaskLength - Math.floor(7 * ActualRate))],
    ["8", (window.sendTaskLength - Math.floor(8 * ExpectedRate)) < 0 ? 0 : (window.sendTaskLength - Math.floor(8 * ExpectedRate)), (window.sendTaskLength - Math.floor(8 * ActualRate)) < 0 ? 0 : (window.sendTaskLength - Math.floor(8 * ActualRate))],
    ["9", (window.sendTaskLength - Math.floor(9 * ExpectedRate)) < 0 ? 0 : (window.sendTaskLength - Math.floor(9 * ExpectedRate)), (window.sendTaskLength - Math.floor(9 * ActualRate)) < 0 ? 0 : (window.sendTaskLength - Math.floor(9 * ActualRate))],
    ["10", (window.sendTaskLength - Math.floor(10 * ExpectedRate)) < 0 ? 0 : (window.sendTaskLength - Math.floor(10 * ExpectedRate)), (window.sendTaskLength - Math.floor(10 * ActualRate)) < 0 ? 0 : (window.sendTaskLength - Math.floor(10 * ActualRate))],
    ["11", (window.sendTaskLength - Math.floor(11 * ExpectedRate)) < 0 ? 0 : (window.sendTaskLength - Math.floor(11 * ExpectedRate)), (window.sendTaskLength - Math.floor(11 * ActualRate)) < 0 ? 0 : (window.sendTaskLength - Math.floor(11 * ActualRate))],
    ["12", (window.sendTaskLength - Math.floor(12 * ExpectedRate)) < 0 ? 0 : (window.sendTaskLength - Math.floor(12 * ExpectedRate)), (window.sendTaskLength - Math.floor(12 * ActualRate)) < 0 ? 0 : (window.sendTaskLength - Math.floor(12 * ActualRate))],
    ["13", (window.sendTaskLength - Math.floor(13 * ExpectedRate)) < 0 ? 0 : (window.sendTaskLength - Math.floor(13 * ExpectedRate)), (window.sendTaskLength - Math.floor(13 * ActualRate)) < 0 ? 0 : (window.sendTaskLength - Math.floor(13 * ActualRate))],
    ["14", (window.sendTaskLength - Math.floor(14 * ExpectedRate)) < 0 ? 0 : (window.sendTaskLength - Math.floor(14 * ExpectedRate)), (window.sendTaskLength - Math.floor(14 * ActualRate)) < 0 ? 0 : (window.sendTaskLength - Math.floor(14 * ActualRate))],
  ];
  
   const options = {
    title: "Sprint Burndown",
    color: '#FF0000', 
    fontName: 'Arial', 
    fontSize: '13',
    curveType: "function",
    chartArea: {width: '80%', height: '70%'},
    legend: { position: "bottom" },
  };
  return (
    <Chart
      chartType="LineChart"
      width="100%"
      height="400px"
      data={data}
      options={options}
    />
  );
} 


export default BurnDown;