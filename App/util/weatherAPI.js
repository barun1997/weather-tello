import config from "../../config";

const { API_KEY } = config;

export const weatherAPI = (path, { coords, zipcode }) => {
  let suffix = "";
  if (zipcode) {
    suffix = `zip=${zipcode}`;
  } else if (coords) {
    suffix = `lon=${coords.longitude}&lat=${coords.latitude}`;
  }

  return fetch(
    `https://api.openweathermap.org/data/2.5${path}?appid=${API_KEY}&${suffix}&units=metric`
  ).then(response => response.json());
};
