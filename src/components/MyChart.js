import React from 'react'
import { getChartData } from '../utils/ChartDataHandler'

function MyChart({ Chart, height, width, data, label, dataOptions = {}, options = {}, type = "bar"}) {

    const chartData = getChartData(data.labels,data.data,label, dataOptions);

    return (
        <Chart height={height} width={width} data={chartData} />
    )
}

export default MyChart
