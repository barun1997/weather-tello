import React from "react";
import API_KEY from "./config.js";
export default class Details extends React.Component {
  componentDidMount() {
    //api.openweathermap.org/data/2.5/weather?zip=94040,us&appid=603d7e1ccbe5349b6d122e0fcd97f824
    const zipcode = 37064;
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?appid=${API_KEY}&zip=${zipcode},us&units=metric`
    )
      .then(response => response.json())
      .then(response => {
        console.log("current response", response);
      })
      .catch(err => {
        console.log("current error", err);
      });
    fetch(
      `https://api.openweathermap.org/data/2.5/forecast?appid=${API_KEY}&zip=${zipcode},us&units=metric`
    )
      .then(response => response.json())
      .then(response => {
        console.log("forecasted response", response);
      })
      .catch(err => {
        console.log("forecasted error", err);
      });
  }
  render() {
    return null;
  }
}
