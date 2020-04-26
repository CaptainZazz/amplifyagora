import React from "react";
import NewMarket from '../components/NewMarket';
import MarketList from '../components/MarketList';

class HomePage extends React.Component {
  state = {
    searchTerm: '',
    searchResults: [],
    isSearching: false
  };

  constructor() {
    super();
    console.info(this.constructor.name, 'Component', this);
  }

  handleSearchChange = searchTerm => this.setState({ searchTerm });
  handleClearSearch = () => this.setState({ searchTerm: '', searchResults: [] });
  handleSearch = event => {
    event.preventDefault();
    console.log('handleSearch', this.state.searchTerm);
  }

  render() {
    return <>
      <h1>Home</h1>
      <NewMarket 
        searchTerm={this.state.searchTerm}
        isSearching={this.state.isSearching}
        handleSearchChange={this.handleSearchChange}
        handleClearSearch={this.handleClearSearch} 
        handleSearch={this.handleSearch}
      />
      <MarketList />
    </>;
  }
}

export default HomePage;
