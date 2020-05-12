import React from "react";
import { API, graphqlOperation } from 'aws-amplify';
import { Loading, Tabs, Icon } from "element-react";
import { Notification } from "element-react";
import { Link } from "react-router-dom";
import { onCreateProduct, onUpdateProduct, onDeleteProduct } from '../graphql/subscriptions';
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
    const input = { owner: this.props.user && this.props.user.attributes.sub };

    this.createProductListener = API.graphql(graphqlOperation(onCreateProduct, input)).subscribe({
      next: productData => {
        try{
          const createdProduct = productData.value.data.onCreateProduct;
          const prevProducts = this.state.market.products.items.filter(item => item.id !== createdProduct.id);
          const market = { ...this.state.market };
          market.products.items = [ createdProduct, ...prevProducts ];
          this.setState({ market });
          console.log('MarketPage.createProductListener', {productData, market});
          Notification.success({ title: `MarketPage`, message: 'createProductListener'});
        } catch(e) {
          console.warn(`MarketPage.createProductListener`, e); 
          Notification.warning({ title: `MarketPage`, message: `createProductListener`});
        }
      },
      error: (e) => { 
        console.warn(`MarketPage`, `Failed to create createProductListener.\n${e.errors.map(({message}) => message).join('\n')}\n`, e); 
        Notification.warning({ title: `MarketPage`, message: 'Failed to create createProductListener.' });
      }
    });

    this.updateProductListener = API.graphql(graphqlOperation(onUpdateProduct, input)).subscribe({
      next: productData => {
        try{
          const updatedProduct = productData.value.data.onUpdateProduct;
          const prevProducts = this.state.market.products.items;
          const updatedProductIndex = prevProducts.findIndex(item => item.id === updatedProduct.id);
          const market = { ...this.state.market };
          market.products.items = [ ...prevProducts.slice(0, updatedProductIndex), updatedProduct, ...prevProducts.slice(updatedProductIndex+1) ];
          this.setState({ market });
          console.log('MarketPage.updateProductListener', {productData, market});
          Notification.success({ title: `MarketPage`, message: 'updateProductListener'});
        } catch(e) {
          console.warn(`MarketPage.updateProductListener`, e); 
          Notification.warning({ title: `MarketPage.updateProductListener`, message: e.message});
        }
      },
      error: (e) => { 
        console.warn(`MarketPage`, `Failed to create updateProductListener.\n${e.errors.map(({message}) => message).join('\n')}\n`, e); 
        Notification.warning({ title: `MarketPage`, message: 'Failed to create updateProductListener.' });
      }
    });
    

    this.deleteProductListener = API.graphql(graphqlOperation(onDeleteProduct, input)).subscribe({
      next: productData => {
        try{
          const deletedProduct = productData.value.data.onDeleteProduct;
          const market = { ...this.state.market };
          market.products.items = this.state.market.products.items.filter(item => item.id !== deletedProduct.id);
          this.setState({ market });
          console.log('MarketPage.deleteProductListener', {productData, market});
          Notification.success({ title: `MarketPage`, message: 'deleteProductListener'});
        } catch(e) {
          console.warn(`MarketPage.deleteProductListener`, e); 
          Notification.warning({ title: `MarketPage.deleteProductListener`, message: e.message});
        }
      },
      error: (e) => { 
        console.warn(`MarketPage`, `Failed to create deleteProductListener.\n${e.errors.map(({message}) => message).join('\n')}\n`, e); 
        Notification.warning({ title: `MarketPage`, message: 'Failed to create deleteProductListener.' });
      }
    });

  }
  componentWillUnmount() {
    this.createProductListener.unsubscribe();
    this.updateProductListener.unsubscribe();
    this.deleteProductListener.unsubscribe();
  }

  handleGetMarket = async () => {
    const input = { id: this.props.marketId };
    try {
      const result = await API.graphql(graphqlOperation(getMarketWithProductFiles, input));
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
      isMarketOwner: this.props.user && this.props.user.attributes.sub === this.state.market.owner 
    });
  };

  render() {
    console.log('MarketPage', this.state.market);
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

      <p>You ({(this.props.user && this.props.user.username) || '?'}) {
        isMarketOwner ? `own this.` : `don't own this, ${(this.state.market.ownerData && this.state.market.ownerData.displayName) || '?'} does.`
      }</p>

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

// Not using auto-generated query because it doesn't include custom type (file: S3Object!)
const getMarketWithProductFiles = /* GraphQL */ `
  query GetMarket($id: ID!) {
    getMarket(id: $id) {
      id name tags createdAt
      ownerData { id, displayName }
      products {
        items { id description price shipped owner createdAt file{key} }
        nextToken
      }
    }
  }
`;

export default MarketPage;
