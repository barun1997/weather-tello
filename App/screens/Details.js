import React from "react";
import {
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
  View,
  Alert
} from "react-native";
import { format } from "date-fns";

import { addRecentSearch } from "../util/recentSearch";
import { weatherAPI } from "../util/weatherAPI";
import { Container } from "../components/Container";
import { WeatherIcon } from "../components/WeatherIcon";
import { BasicRow } from "../components/List";
import { H1, H2, P } from "../components/Text";

const groupForecastByDay = list => {
  const data = {};
  list.forEach(item => {
    const [day] = item.dt_txt.split(" ");
    if (data[day]) {
      if (data[day].temp_max < item.main.temp_max) {
        data[day].temp_max = item.main.temp_max;
      }
      if (data[day].temp_min > item.main.temp_min) {
        data[day].temp_min = item.main.temp_min;
      }
    } else {
      data[day] = {
        temp_min: item.main.temp_min,
        temp_max: item.main.temp_max
      };
    }
  });

  const formattedList = Object.keys(data).map(key => {
    return {
      day: key,
      ...data[key]
    };
  });
  return formattedList;
};

export default class Details extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentWeather: {},
      forecastWeather: [],
      loadingCurrentWeather: true,
      loadingForecastWeather: true
    };
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(position => {
      this.getCurrentWeather({ coords: position.coords });
      this.getForecast({ coords: position.coords });
    });
  }

  componentDidUpdate(prevProps) {
    const { route } = this.props;

    if (route.params.lat && route.params.lon) {
      const oldLat = prevProps.route.params.lat;
      const oldLon = prevProps.route.params.lon;

      const lat = route.params.lat;
      const lon = route.params.lon;

      if (lat && oldLat !== lat && lon && oldLon !== lon) {
        this.getCurrentWeather({ coords: { latitude: lat, longitude: lon } });
        this.getForecast({ coords: { latitude: lat, longitude: lon } });
      }
    } else if (route.params.zipcode) {
      const oldZipcode = prevProps.route.params.zipcode;
      const zipcode = route.params.zipcode;
      if (zipcode && oldZipcode !== zipcode) {
        this.getCurrentWeather({ zipcode });
        this.getForecast({ zipcode });
      }
    }
  }

  handleError = () => {
    Alert.alert("No location data found!", "Please try again", [
      {
        text: "Okay",
        onPress: () => this.props.navigation.navigate("Search")
      }
    ]);
  };

  getCurrentWeather = ({ zipcode, coords }) =>
    weatherAPI("/weather", { zipcode, coords })
      .then(response => {
        if (response.cod === "404" || response.cod === "429") {
          this.handleError();
        } else {
          this.props.navigation.setParams({ title: response.name });
          this.setState({
            currentWeather: response,
            loadingCurrentWeather: false
          });
          console.log("eta ho", response);
          addRecentSearch({
            id: response.dt,
            name: response.name,
            lat: response.coord.lat,
            lon: response.coord.lon
          });
        }
      })
      .catch(err => {
        console.log("current error", err);
        this.handleError();
      });

  getForecast = ({ zipcode, coords }) =>
    weatherAPI("/forecast", { zipcode, coords })
      .then(response => {
        if (response.cod !== "404") {
          this.setState({
            forecastWeather: groupForecastByDay(response.list),
            loadingForecastWeather: false
          });
        }
      })

      .catch(err => {
        console.log("forecast error", err);
      });

  render() {
    if (this.state.loadingCurrentWeather && this.state.loadingForecastWeather) {
      return (
        <Container>
          <ActivityIndicator />
        </Container>
      );
    }
    const { weather, main } = this.state.currentWeather;
    const forecast = this.state.forecastWeather;

    return (
      <Container>
        <ScrollView>
          <SafeAreaView>
            <WeatherIcon icon={weather[0].icon} />
            <H1>{`${Math.round(main.temp)}˚C`}</H1>
            <BasicRow>
              <H2>{`Humidity: ${main.humidity}%`}</H2>
            </BasicRow>
            <BasicRow>
              <H2>{`Low: ${Math.round(main.temp_min)}˚C`}</H2>
              <H2>{`High: ${Math.round(main.temp_max)}˚C`}</H2>
            </BasicRow>
            <View style={{ paddingHorizontal: 10, marginTop: 20 }}>
              {forecast.map(day => {
                return (
                  <BasicRow
                    key={day.day}
                    style={{ justifyContent: "space-between" }}
                  >
                    <P>{format(new Date(day.day), "EEEE, MMM d")}</P>
                    <View style={{ flexDirection: "row" }}>
                      <P style={{ fontWeight: "700", marginRight: 10 }}>
                        {Math.round(day.temp_max)}
                      </P>
                      <P>{Math.round(day.temp_min)}</P>
                    </View>
                  </BasicRow>
                );
              })}
            </View>
          </SafeAreaView>
        </ScrollView>
      </Container>
    );
  }
}
