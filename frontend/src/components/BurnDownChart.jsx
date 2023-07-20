import React, { useContext } from "react";
import { Bar } from "react-chartjs-2";
import {Chart as CHARTJS} from 'chart.js/auto'

const BurnDownChart = () => {                              //This is a nonfunctional Prototype. Consider this a template. Need a back-end component & to retrieve data from there

   const UserData = {
      labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5'],
      datasets: [
         {
            label: 'Hours remaining',
            data: [900, 600, 550, 200, 0],
            borderColor: 'black',
            borderWidth: 1,
         },
      ],
   }; 
  

   return <Bar data={UserData}/>;
}

export default BurnDownChart;