import { AsyncStorage } from "react-native";

const KEY = "@WeatherApp/SearchHistory";

export const getRecentSearch = () =>
  AsyncStorage.getItem(KEY).then(str => {
    if (str) {
      return JSON.parse(str);
    }
    return [];
  });

export const addRecentSearch = item => {
  console.log("called recent search");
  console.log("yo item ho", item);
  getRecentSearch().then(history => {
    const oldHistory = history.filter(
      existingItem => existingItem.id !== item.id
    );
    const newHistory = [item, ...oldHistory];
    console.log(newHistory);
    return AsyncStorage.setItem(KEY, JSON.stringify(newHistory));
  });
};
