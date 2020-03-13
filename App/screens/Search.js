import React from "react";
import { FlatList, Text, View } from "react-native";

import { SearchBar } from "../components/SearchBar";
import { SearchItem } from "../components/List";
import { getRecentSearch } from "../util/recentSearch";

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: "",
      recentSearch: []
    };
  }

  componentDidMount() {
    getRecentSearch()
      .then(recentSearch => {
        this.setState({ recentSearch });
      })
      .catch(err => console.log(err));
  }

  render() {
    return (
      <FlatList
        data={this.state.recentSearch}
        renderItem={({ item }) => (
          <SearchItem
            name={item.name}
            onPress={() =>
              this.props.navigation.navigate("Details", {
                lat: item.lat,
                lon: item.lon
              })
            }
          />
        )}
        keyExtractor={item => item.name.toString()}
        ListHeaderComponent={
          // eslint-disable-next-line react/jsx-wrap-multilines
          <View>
            <SearchBar
              placeholder="Zipcode"
              onSearch={() => {
                this.props.navigation.navigate("Details", {
                  zipcode: this.state.query
                });
              }}
              searchButtonEnabled={this.state.query.length >= 5}
              onChangeText={query => this.setState({ query })}
            />

            <Text
              style={{
                marginHorizontal: 10,
                fontSize: 16,
                color: "#aaa",
                marginTop: 10,
                marginBottom: 5
              }}
            >
              Recents
            </Text>
          </View>
        }
      />
    );
  }
}

export default Search;
