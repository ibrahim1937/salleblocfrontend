import React from 'react'
import { getChartData } from '../utils/ChartDataHandler'

function MyChart({ Chart, height, width, data, label, dataOptions = {}, options = {}, type = "bar", ...rest}) {

    const chartData = getChartData(data.labels,data.data,label, dataOptions);

    return (
        <Chart height={height} width={width} data={chartData} {...rest} options={{
            scales: {
                yAxes: [{
                    ticks: {
                      beginAtZero: true,
                      min: 0
                    }    
                }]
            }
        }} />
    )
}

export default MyChart
