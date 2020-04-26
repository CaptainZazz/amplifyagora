import React from "react";
import { API, graphqlOperation } from 'aws-amplify';
import { getMarket } from '../graphql/queries';
import { Loading, Tabs, Icon } from "element-react";
import { Link } from "react-router-dom";
import NewProduct from '../components/NewProduct';
import Product from '../components/Product';

class MarketPage extends React.Component {
  state = {
    market: null,
    isLoading: true,
    isMarketOwner: false
  };

  constructor() {
    super();
    console.info(this.constructor.name, 'Component', this);
  }

  componentDidMount() {
    this.handleGetMarket();
  }

  handleGetMarket = async () => {
    const input = { id: this.props.marketId };
    try {
      const result = await API.graphql(graphqlOperation(getMarket, input));
      console.log({ result });
      this.setState(
        { market: result.data.getMarket },
        () => this.checkMarketOwner()
      );
    } catch(e) {
      console.error('handleGetMarket', e);
    }
    this.setState({ isLoading: false });
  };

  checkMarketOwner = () => {
    this.setState({ 
      isMarketOwner: this.props.user && this.props.user.username === this.state.market.owner 
    });
  };

  render() {
    const { market, isLoading, isMarketOwner } = this.state;
    if (isLoading) return <Loading fullscreen={true} />;
    return <>
      <Link className="link" to="/">Back to Markets List</Link>

      <span className="items-center pt-2">
        <h2 className="mb-mr">{market.name}</h2>- {market.owner}
      </span>
      <div className="items-center pt-2">
        <span style={{ color: 'var(--lightSquidInk)', paddingBottom: '1em' }}>
          <Icon name="date" className="icon" /> {market.createdAt}
        </span>
      </div>

      <p>You ({(this.props.user && this.props.user.username) || '?'}) {isMarketOwner ? `own this.` : `don't own this, ${this.state.market.owner} does.`}</p>

      {/* New Product */}
      <Tabs type="border-card" value={isMarketOwner ? "1" : "2"}>

        {/* New Product */}
        {isMarketOwner && (
          <Tabs.Pane label={<><Icon name="plus" className="icon" />Add Product</>} name="1">
            <NewProduct marketId={this.props.marketId} />
          </Tabs.Pane>
        )}

        {/* List Products */}
        <Tabs.Pane label={<><Icon name="menu" className="icon" />Products ({market.products.items.length})</>} name="2">
          {market.products.items.map(product => (
            <Product key={product.id} product={product} />
          ))}
        </Tabs.Pane>
      </Tabs>
    </>;
  }
}

export default MarketPage;
