import React from "react";
import { API, graphqlOperation } from 'aws-amplify';
import { searchMarkets } from '../graphql/queries';
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
  handleSearch = async event => {
    event.preventDefault();
    console.log('handleSearch', this.state.searchTerm);
    try {
      this.setState({ isSearching: true });
      const result = await API.graphql(graphqlOperation(searchMarkets, { // https://docs.amplify.aws/cli/graphql-transformer/directives#generates-4
        filter: {
          or: [ 
            { name:  { wildcard: `*${this.state.searchTerm}*` } }, 
            { owner: { match: this.state.searchTerm } }, 
            { tags:  { match: this.state.searchTerm } }, 
          ]
        }
      }));
      console.info(`Search "${this.state.searchTerm}"`, result.data.searchMarkets);
      this.setState({ isSearching: false, searchResults: result.data.searchMarkets.items });
    } catch(e) {
      console.error(e);
      this.setState({ isSearching: false });
    } 
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
      <MarketList searchResults={this.state.searchResults} user={this.props.user} />
    </>;
  }
}

export default HomePage;
