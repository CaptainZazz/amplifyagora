/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getMarket = /* GraphQL */ `
  query GetMarket($id: ID!) {
    getMarket(id: $id) {
      id
      createdAt
      owner
      ownerData {
        id
        displayName
        orders {
          nextToken
        }
      }
      products {
        items {
          id
          createdAt
          owner
          description
          price
          shipped
        }
        nextToken
      }
      name
      tags
    }
  }
`;
export const listMarkets = /* GraphQL */ `
  query ListMarkets(
    $filter: ModelMarketFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listMarkets(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        createdAt
        owner
        ownerData {
          id
          displayName
        }
        products {
          nextToken
        }
        name
        tags
      }
      nextToken
    }
  }
`;
export const getProduct = /* GraphQL */ `
  query GetProduct($id: ID!) {
    getProduct(id: $id) {
      id
      createdAt
      owner
      ownerData {
        id
        displayName
        orders {
          nextToken
        }
      }
      description
      market {
        id
        createdAt
        owner
        ownerData {
          id
          displayName
        }
        products {
          nextToken
        }
        name
        tags
      }
      file {
        bucket
        region
        key
      }
      price
      shipped
    }
  }
`;
export const listProducts = /* GraphQL */ `
  query ListProducts(
    $filter: ModelProductFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listProducts(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        createdAt
        owner
        ownerData {
          id
          displayName
        }
        description
        market {
          id
          createdAt
          owner
          name
          tags
        }
        file {
          bucket
          region
          key
        }
        price
        shipped
      }
      nextToken
    }
  }
`;
export const getUser = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      displayName
      orders {
        items {
          id
          createdAt
        }
        nextToken
      }
    }
  }
`;
export const searchMarkets = /* GraphQL */ `
  query SearchMarkets(
    $filter: SearchableMarketFilterInput
    $sort: SearchableMarketSortInput
    $limit: Int
    $nextToken: String
  ) {
    searchMarkets(
      filter: $filter
      sort: $sort
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        createdAt
        owner
        ownerData {
          id
          displayName
        }
        products {
          nextToken
        }
        name
        tags
      }
      nextToken
      total
    }
  }
`;
