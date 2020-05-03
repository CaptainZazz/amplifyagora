import React from "react";
import { Link } from "react-router-dom";
import { graphqlOperation } from "aws-amplify";
import { Connect } from "aws-amplify-react";
import { listMarkets } from "../graphql/queries";
import { listMarkets_withProducts } from "../graphql/markets";
import { onCreateMarket } from "../graphql/subscriptions";
import Error from "./Error";
import { Loading, Card, Icon, Tag } from "element-react";

const MarketList = ({ searchResults, user }) => {
  const onNewMarket = (prevQuery, newData) => {
    const updatedQuery = { ...prevQuery };
    updatedQuery.listMarkets.items = [newData.onCreateMarket, ...prevQuery.listMarkets.items ];
    return updatedQuery;
  };

  console.log('MarketList', {
    listMarkets, listMarkets_withProducts
  });

  return <Connect
    query={graphqlOperation(listMarkets_withProducts)}
    subscription={graphqlOperation(onCreateMarket, { owner: user && user.attributes.sub })}
    onSubscriptionMsg={onNewMarket}
  >
    {({data, loading, errors}) => {
      if (errors.length) return <Error errors={errors} />;
      if (loading || !data.listMarkets) return <Loading fullscreen={true} />;

      const markets = searchResults.length ? searchResults : data.listMarkets.items;

      return <>
        <MarketListHeader numSearchResults={searchResults.length} />
        {markets.map(market => (
          <div key={market.id} className="my-2">
            <MarketListItem market={market} />
          </div>
        ))}
      </>;
    }}
  </Connect>;
};

const MarketListHeader = ({ numSearchResults }) => {
  if (numSearchResults) {
    return <h2 className="text-green">
      <Icon type="success" name="check" className="icon" />
      {numSearchResults} {numSearchResults===1 ? 'Result' : 'Results'}
    </h2>
  }
  return <h2>
    <img src="https://icon.now.sh/store_mall_directory/527FFF" alt="Store Icon" className="large-icon" />
    Markets
  </h2>;
};

const MarketListItem = ({ market }) => {
  return <Card bodyStyle={{
    padding: '0.7em',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  }}>
    <div>
      <span className="flex">
        <Link className="link" to={`/markets/${market.id}`}>{market.name}</Link>
        <span style={{ color: 'var(--darkAmazonOrange)'}}>{ market.products ? (market.products.items||[]).length : '?' }</span>
        <img src="https://icon.now.sh/shopping_cart/f60" alt="Shopping Cart" />
      </span>
      <div style={{ color: "var(--lightSquidInk)" }}>{market.owner}</div>
    </div>
    <div>{market.tags && market.tags.map( tag => <Tag key={tag} type="danger" className="mx-1">{tag}</Tag> )}</div>
  </Card>
}

export default MarketList;
