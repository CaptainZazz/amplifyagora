/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateMarket = /* GraphQL */ `
  subscription OnCreateMarket($owner: String!) {
    onCreateMarket(owner: $owner) {
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
export const onUpdateMarket = /* GraphQL */ `
  subscription OnUpdateMarket($owner: String!) {
    onUpdateMarket(owner: $owner) {
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
export const onDeleteMarket = /* GraphQL */ `
  subscription OnDeleteMarket($owner: String!) {
    onDeleteMarket(owner: $owner) {
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
export const onCreateProduct = /* GraphQL */ `
  subscription OnCreateProduct($owner: String!) {
    onCreateProduct(owner: $owner) {
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
export const onUpdateProduct = /* GraphQL */ `
  subscription OnUpdateProduct($owner: String!) {
    onUpdateProduct(owner: $owner) {
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
export const onDeleteProduct = /* GraphQL */ `
  subscription OnDeleteProduct($owner: String!) {
    onDeleteProduct(owner: $owner) {
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
