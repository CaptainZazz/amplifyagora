import React from "react";
// import { Loading, Tabs, Icon } from "element-react";

class MarketPage extends React.Component {
  state = {};

  constructor() {
    super();
    console.info(this.constructor.name, 'Component', this);
  }

  render() {
    return <div>MarketPage {this.props.marketId}</div>;
  }
}

export default MarketPage;
