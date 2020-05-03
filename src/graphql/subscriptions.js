/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateMarket = /* GraphQL */ `
  subscription OnCreateMarket($owner: String!) {
    onCreateMarket(owner: $owner) {
      id
      name
      products {
        items {
          id
          description
          price
          shipped
          owner
          createdAt
        }
        nextToken
      }
      tags
      createdAt
      owner
    }
  }
`;
export const onUpdateMarket = /* GraphQL */ `
  subscription OnUpdateMarket($owner: String!) {
    onUpdateMarket(owner: $owner) {
      id
      name
      products {
        items {
          id
          description
          price
          shipped
          owner
          createdAt
        }
        nextToken
      }
      tags
      createdAt
      owner
    }
  }
`;
export const onDeleteMarket = /* GraphQL */ `
  subscription OnDeleteMarket($owner: String!) {
    onDeleteMarket(owner: $owner) {
      id
      name
      products {
        items {
          id
          description
          price
          shipped
          owner
          createdAt
        }
        nextToken
      }
      tags
      createdAt
      owner
    }
  }
`;
export const onCreateProduct = /* GraphQL */ `
  subscription OnCreateProduct($owner: String!) {
    onCreateProduct(owner: $owner) {
      id
      description
      market {
        id
        name
        products {
          nextToken
        }
        tags
        createdAt
        owner
      }
      file {
        bucket
        region
        key
      }
      price
      shipped
      owner
      createdAt
    }
  }
`;
export const onUpdateProduct = /* GraphQL */ `
  subscription OnUpdateProduct($owner: String!) {
    onUpdateProduct(owner: $owner) {
      id
      description
      market {
        id
        name
        products {
          nextToken
        }
        tags
        createdAt
        owner
      }
      file {
        bucket
        region
        key
      }
      price
      shipped
      owner
      createdAt
    }
  }
`;
export const onDeleteProduct = /* GraphQL */ `
  subscription OnDeleteProduct($owner: String!) {
    onDeleteProduct(owner: $owner) {
      id
      description
      market {
        id
        name
        products {
          nextToken
        }
        tags
        createdAt
        owner
      }
      file {
        bucket
        region
        key
      }
      price
      shipped
      owner
      createdAt
    }
  }
`;
