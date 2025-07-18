import React from 'react';
import ReactApexChart from 'react-apexcharts';

const CandleChart = ({ data }) => {
  if (!data || data.length === 0) {
    console.warn("No data provided for the candlestick chart.");
    return null;
  }

  const transformedData = data.map(d => {
    const open = Number(d.mkp);
    const high = Number(d.hipr);
    const low = Number(d.lopr);
    const close = Number(d.clpr);

    if (isNaN(open) || isNaN(high) || isNaN(low) || isNaN(close)) {
      console.warn("Invalid numeric data for a candle:", d);
      return null;
    }

    return {
      x: new Date(`${d.basDt.slice(0, 4)}-${d.basDt.slice(4, 6)}-${d.basDt.slice(6, 8)}`),
      y: [open, high, low, close]
    };
  }).filter(d => d !== null);

  const series = [{ data: transformedData }];

  const options = {
    chart: {
      type: 'candlestick',
      height: 400,
      toolbar: { show: false },
      zoom: {
        enabled: false
      },
      animations: {
        enabled: false
      },
      responsive: false
    },
    plotOptions: {
      candlestick: {
        colors: {
          upward: getComputedStyle(document.documentElement)
            .getPropertyValue('--color-ing-success')
            .trim() || '#16a34a',
          downward: getComputedStyle(document.documentElement)
            .getPropertyValue('--color-ing-danger')
            .trim() || '#dc2626'
        }
      }
    },
    title: {
      text: '',
      align: 'left'
    },
    xaxis: {
      labels: {
        formatter: function (val) {
          const date = new Date(val);
          return date.getDate().toString().padStart(2, '0');
        }
      }
    },
    yaxis: {
      tooltip: {
        enabled: false,
        custom: () => ({ series: [] }) // suppress all tooltip content
      }
    }
  };

  return (
    <div id="chart" className="bg-ing-bg-dark text-ing-text p-4 rounded">
      <ReactApexChart options={options} series={series} type="candlestick" height={400} />
    </div>
  );
};

export default CandleChart;