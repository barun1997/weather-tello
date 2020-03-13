import React from "react";
import { weatherAPI } from "../util/weatherAPI";

export default class Details extends React.Component {
  componentDidMount() {
    navigator.geolocation.getCurrentPosition(position => {
      this.getCurrentWeather({ coords: position.coords });
      this.getForecast({ coords: position.coords });
    });

    const zipcode = 37064;
    // this.getCurrentWeather({ zipcode });
    // this.getForecast({ zipcode });
  }

  getCurrentWeather = ({ zipcode, coords }) => {
    return weatherAPI("/weather", { zipcode, coords })
      .then(response => {
        console.log("current response", response);
      })
      .catch(err => {
        console.log("current error", err);
      });
  };

  getForecast = ({ zipcode, coords }) =>
    weatherAPI("/forecast", { zipcode, coords })
      .then(response => {
        console.log("forecast response", response);
      })
      .catch(err => {
        console.log("forecast error", err);
      });

  render() {
    return null;
  }
}
