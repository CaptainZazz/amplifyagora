const {getMarket, listMarkets} = require('./queries');
const {createMarket, updateMarket, deleteMarket} = require('./mutations');
const {onCreateMarket, onUpdateMarket, onDeleteMarket} = require('./subscriptions');

const productsRegExp = /products[^}]+}/; // "products" until first "}"

const listMarkets_withProducts = listMarkets.replace(productsRegExp, `
        products {
          items {
            id, description, price, shipped, owner, createdAt, file{key}
          }
          nextToken
        }
`.trim());

const listMarkets_withoutProducts = listMarkets.replace(productsRegExp, '');

module.exports = {
    getMarket,
    listMarkets,
    listMarkets_withProducts,
    listMarkets_withoutProducts,
    createMarket, 
    updateMarket, 
    deleteMarket,
    onCreateMarket, 
    onUpdateMarket, 
    onDeleteMarket,
}
