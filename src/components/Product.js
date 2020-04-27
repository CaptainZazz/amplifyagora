import React from "react";
import { API, graphqlOperation } from "aws-amplify";
import { S3Image } from "aws-amplify-react";
import { updateProduct, deleteProduct } from "../graphql/mutations";
import { convertCentsToDollars, convertDollarsToCents } from "../utils";
import { UserContext } from "../App";
import PayButton from "./PayButton";
// prettier-ignore
import { Notification, Popover, Button, Dialog, Card, Form, Input, Radio } from "element-react";

class Product extends React.Component {
  state = {
    updateProductDialog: false,
    deleteProductDialog: false,
    description: '',
    price: '',
    shipped: false
  };

  handleUpdateProduct = async productId => {
    try {
      this.setState({ updateProductDialog: false });
      const { description, price, shipped } = this.state;
      const input = { id: productId, description, shipped, price: convertDollarsToCents(price) };
      const result = await API.graphql(graphqlOperation(updateProduct, {input}));
      console.log('handleUpdateProduct', {result});
      Notification.success({ 
        title: "Success", 
        message: "Product sucessfully updated!", 
        duration: 3000,
        onClose: () => window.location.reload() 
      });
    } catch(e) {
      Notification.error({ title: "Error", message: `Failed to update product "${productId}".` });
      console.error(`Failed to update product "${productId}".`, e);
    }
  }

  handleDeleteProduct = async productId => {
    try {
      this.setState({ deleteProductDialog: false });
      const input = { id: productId };
      const result = await API.graphql(graphqlOperation(deleteProduct, {input}))
      console.log('handleDeleteProduct', {result});
      Notification.success({ 
        title: "Success", 
        message: "Product sucessfully deleted!", 
        duration: 3000,
        onClose: () => window.location.reload() 
      });
    } catch(e) {
      Notification.error({ title: "Error", message: `Failed to delete product "${productId}".` });
      console.error(`Failed to delete product "${productId}".`, e);
    }
  }
  
  render() {
    return (
      <UserContext.Consumer>
        {({user}) => this.renderBody(user)}
      </UserContext.Consumer>
    );
  }

  renderBody(user) {
    const { product } = this.props;
    const { updateProductDialog, deleteProductDialog, description, price, shipped } = this.state;
    const isProductOwner = user && user.attributes.sub === product.owner;

    return <>
      <Card bodyStyle={{ padding: 0, minWidth: '200px' }}>

        <S3Image imgKey={product.file.key} theme={{ photoImg: { maxWidth: '100%', maxHeight: '100%' } }} />

        <div className="card-body">
          <h3 className="m-0">{product.description}</h3>
          <div className="items-center">
            <img src={ `https://icon.now.sh/${product.shipped ? 'markunread_mailbox' : 'mail' }`} alt="Shipping Icon" className="icon" />
            {product.shipped ? "Shipped" : "Emailed"}
          </div>
          <div className="text-right">
            <span className="mx-1">${convertCentsToDollars(product.price)}</span>
            {!isProductOwner && <PayButton />}
          </div>
        </div>
      </Card>

      {/* Update/Delete product buttons */}
      <div className="text-center">
        {isProductOwner && <>
          <Button type="warning" icon="edit" className="m-1" onClick={ () => this.setState({ 
            updateProductDialog: true,
            description: product.description,
            shipped: product.shipped,
            price: convertCentsToDollars(product.price)
          }) }>Edit</Button>
          <Popover placement="top" width="160" trigger="click" visible={deleteProductDialog} content={<>
            <p>Do you want to delete this?</p>
            <div className="text-right">
              <Button type="text"    size="mini" className="m-1" onClick={() => this.setState({ deleteProductDialog: false })}>Cancel</Button>
              <Button type="primary" size="mini" className="m-1" onClick={() => this.handleDeleteProduct(product.id)}         >Confirm</Button>
            </div>
          </>}>
            <Button type="danger"  icon="delete" className="m-1" onClick={ () => this.setState({ deleteProductDialog: true }) }>Delete</Button>
          </Popover>
        </>}
      </div>

      {/* Update product dialog */}
      <Dialog title="Update Product" size="large" customClass="dialog" visible={updateProductDialog} onCancel={() => this.setState({ updateProductDialog: false})}>
        <Dialog.Body>
          <Form labelPosition="top">
            <Form.Item label="Update Description">
              <Input icon="information" placeholder="Product Description" value={description} trim={true} onChange={description => this.setState({ description })} />
            </Form.Item>

            <Form.Item label="Update Price">
              <Input type="number" icon="plus" placeholder="Price ($USD)" value={price} onChange={price => this.setState({ price })} />
            </Form.Item>

            <Form.Item label="Update Shipping">
              <div className="text-center">
                <Radio value="true" checked={shipped === true} onChange={() => this.setState({ shipped: true })}>Shipped</Radio>
                <Radio value="true" checked={shipped === false} onChange={() => this.setState({ shipped: false })}>Emailed</Radio>
              </div>
            </Form.Item>

          </Form>
        </Dialog.Body>
        <Dialog.Footer>
          <Button onClick={() => this.setState({ updateProductDialog: false})}>Cancel</Button>
          <Button onClick={() => this.handleUpdateProduct(product.id)}>Update</Button>
        </Dialog.Footer>
      </Dialog>

    </>;
  }
}

export default Product;
