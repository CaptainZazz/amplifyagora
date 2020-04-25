/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateMarket = /* GraphQL */ `
  subscription OnCreateMarket {
    onCreateMarket {
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
      owner
      createdAt
    }
  }
`;
export const onUpdateMarket = /* GraphQL */ `
  subscription OnUpdateMarket {
    onUpdateMarket {
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
      owner
      createdAt
    }
  }
`;
export const onDeleteMarket = /* GraphQL */ `
  subscription OnDeleteMarket {
    onDeleteMarket {
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
      owner
      createdAt
    }
  }
`;
export const onCreateProduct = /* GraphQL */ `
  subscription OnCreateProduct($owner: String!) {
    onCreateProduct(owner: $owner) {
      id
      description
      markets {
        id
        name
        products {
          nextToken
        }
        tags
        owner
        createdAt
      }
      file {
        bucker
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
      markets {
        id
        name
        products {
          nextToken
        }
        tags
        owner
        createdAt
      }
      file {
        bucker
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
      markets {
        id
        name
        products {
          nextToken
        }
        tags
        owner
        createdAt
      }
      file {
        bucker
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
