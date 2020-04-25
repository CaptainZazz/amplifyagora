import React from "react";
import NewMarket from '../components/NewMarket';
import MarketList from '../components/MarketList';

class HomePage extends React.Component {
  state = {};

  constructor() {
    super();
    console.info(this.constructor.name, 'Component', this);
  }

  render() {
    return <>
      <h1>Home</h1>
      <NewMarket />
      <MarketList />
    </>;
  }
}

export default HomePage;
