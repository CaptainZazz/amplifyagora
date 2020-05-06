/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createMarket = /* GraphQL */ `
  mutation CreateMarket(
    $input: CreateMarketInput!
    $condition: ModelMarketConditionInput
  ) {
    createMarket(input: $input, condition: $condition) {
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
export const updateMarket = /* GraphQL */ `
  mutation UpdateMarket(
    $input: UpdateMarketInput!
    $condition: ModelMarketConditionInput
  ) {
    updateMarket(input: $input, condition: $condition) {
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
export const deleteMarket = /* GraphQL */ `
  mutation DeleteMarket(
    $input: DeleteMarketInput!
    $condition: ModelMarketConditionInput
  ) {
    deleteMarket(input: $input, condition: $condition) {
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
export const createProduct = /* GraphQL */ `
  mutation CreateProduct(
    $input: CreateProductInput!
    $condition: ModelProductConditionInput
  ) {
    createProduct(input: $input, condition: $condition) {
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
export const updateProduct = /* GraphQL */ `
  mutation UpdateProduct(
    $input: UpdateProductInput!
    $condition: ModelProductConditionInput
  ) {
    updateProduct(input: $input, condition: $condition) {
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
export const deleteProduct = /* GraphQL */ `
  mutation DeleteProduct(
    $input: DeleteProductInput!
    $condition: ModelProductConditionInput
  ) {
    deleteProduct(input: $input, condition: $condition) {
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
export const updateUser = /* GraphQL */ `
  mutation UpdateUser(
    $input: UpdateUserInput!
    $condition: ModelUserConditionInput
  ) {
    updateUser(input: $input, condition: $condition) {
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
export const createOrder = /* GraphQL */ `
  mutation CreateOrder(
    $input: CreateOrderInput!
    $condition: ModelOrderConditionInput
  ) {
    createOrder(input: $input, condition: $condition) {
      id
      user {
        id
        displayName
        orders {
          nextToken
        }
      }
      product {
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
      shippingAddress {
        city
        country
        address_line1
        address_state
        address_zip
      }
      createdAt
    }
  }
`;
