import dayjs from "dayjs";
import duration from "dayjs/plugin/duration.js";
import Smart from "./smart.js";
import Chart from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';

dayjs.extend(duration);

const TextChart = {
  MONEY: `MONEY`,
  TYPE: `TYPE`,
  TIME_SPEND: `TIME-SPEND`
};

const BasicValue = {
  HORIZONTAL_BAR: `horizontalBar`,
  WHITE_COLOR: `#ffffff`,
  BLACK_COLOR: `#000000`,
  START: `start`,
  END: `end`,
  SIZE_13: 13,
  SIZE_23: 23,
  SIZE_5: 5,
  SIZE_44: 44,
  SIZE_50: 50,
  LEFT: `left`
};

const getDuration = (diff) => {
  return `${ dayjs.duration(diff).days()}D`;
};

const renderChart = (text, type, labels, data) => {
  const getSymbol = (typeText, val) => {
    switch (typeText) {
      case (TextChart.MONEY):
        return `€ ${val}`;
      case (TextChart.TYPE):
        return `${val}x`;
      case (TextChart.TIME_SPEND):
        return getDuration(val);
      default:
        return `€ ${val}`;
    }
  };

  return new Chart(type, {
    plugins: [ChartDataLabels],
    type: BasicValue.HORIZONTAL_BAR,
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: BasicValue.WHITE_COLOR,
        hoverBackgroundColor: BasicValue.WHITE_COLOR,
        anchor: BasicValue.START
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: BasicValue.SIZE_13
          },
          color: BasicValue.BLACK_COLOR,
          anchor: BasicValue.END,
          align: BasicValue.START,
          formatter: (val) => getSymbol(text, val)
        }
      },
      title: {
        display: true,
        text,
        fontColor: BasicValue.BLACK_COLOR,
        fontSize: BasicValue.SIZE_23,
        position: BasicValue.LEFT
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: BasicValue.BLACK_COLOR,
            padding: BasicValue.SIZE_5,
            fontSize: BasicValue.SIZE_13,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: BasicValue.SIZE_44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          minBarLength: BasicValue.SIZE_50
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    }
  });
};

const createTripInformationElement = () =>
  `<section class="statistics">
  <h2 class="visually-hidden">Trip statistics</h2>

  <div class="statistics__item statistics__item--money">
    <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
  </div>

  <div class="statistics__item statistics__item--transport">
    <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
  </div>

  <div class="statistics__item statistics__item--time-spend">
    <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
  </div>
</section>`;

export default class TripStatistics extends Smart {
  constructor(pointsModel) {
    super();
    this._pointsModel = pointsModel;
  }

  init() {
    this.getTemplate();
    this._element = this.getElement();
    this._labels = [...new Set(this._pointsModel.map((point) => point.type.toUpperCase()))];
    this._setCharts();
  }

  getTemplate() {
    return createTripInformationElement();
  }

  restoreHandlers() {
    this._setCharts();
    this._setDatepicker();
  }

  _getMoneyData() {
    const prices = [];
    this._labels.forEach((label) => {
      let sumPrice = 0;
      this._pointsModel.map((point) => {
        if (label === point.type.toUpperCase()) {
          sumPrice += point.price;
        }
      });
      prices.push(sumPrice);
    });
    return prices;
  }

  _getCountTypeData() {
    const types = [];
    this._labels.forEach((label) => {
      let count = 0;
      this._pointsModel.map((point) => {
        if (label === point.type.toUpperCase()) {
          count++;
        }
      });
      types.push(count);
    });
    return types;
  }

  _getSpendTimeData() {
    const times = [];
    this._labels.forEach((label) => {
      let timeSpend = 0;
      this._pointsModel.map((point) => {
        if (label === point.type.toUpperCase()) {
          timeSpend += dayjs(point.dateTo).diff(dayjs(point.dateFrom));
        }
      });
      times.push(timeSpend);
    });
    return times;
  }

  _setCharts() {
    const moneyCtx = this._element.querySelector(`.statistics__chart--money`);
    const typeCtx = this._element.querySelector(`.statistics__chart--transport`);
    const timeCtx = this._element.querySelector(`.statistics__chart--time`);

    const BAR_HEIGHT = 55;
    moneyCtx.height = BAR_HEIGHT * 5;
    typeCtx.height = BAR_HEIGHT * 5;
    timeCtx.height = BAR_HEIGHT * 5;

    renderChart(TextChart.MONEY, moneyCtx, this._labels, this._getMoneyData());
    renderChart(TextChart.TYPE, typeCtx, this._labels, this._getCountTypeData());
    renderChart(TextChart.TIME_SPEND, timeCtx, this._labels, this._getSpendTimeData());
  }
}
