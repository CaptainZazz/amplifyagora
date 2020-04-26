import React from "react";
// prettier-ignore
import { Form, Button, Input, Notification, Radio, Progress } from "element-react";
import { PhotoPicker } from "aws-amplify-react";

const initialState = {
  description: '',
  price: '',
  shipped: false,
  imagePreview: '',
  image: ''
};

class NewProduct extends React.Component {
  state = { ...initialState };

  handleAddProduct = () => {
    console.log('handleAddProduct', this.state);
    this.setState({ ...initialState });
  };

  render() {
    const { description, price, image, shipped, imagePreview } = this.state;
    return (
      <div className="flex-canter">
        <h2 className="header">Add New Product</h2>
        <div>
          <Form className="market-header">

          <Form.Item label="Add Product Description">
              <Input type="text" icon="information" placeholder="Description" value={description} onChange={description => this.setState({ description })} />
            </Form.Item>

            <Form.Item label="Set Product Price">
              <Input type="number" icon="plus" placeholder="Price ($USD)" value={price} onChange={price => this.setState({ price })} />
            </Form.Item>

            <Form.Item label="Is the Product Shipped or Emailed to the Customer?">
              <div className="text-center">
                <Radio value="true" checked={shipped === true} onChange={() => this.setState({ shipped: true })}>Shipped</Radio>
                <Radio value="true" checked={shipped === false} onChange={() => this.setState({ shipped: false })}>Emailed</Radio>
              </div>
            </Form.Item>

            {imagePreview && <img className="image-preview" src={imagePreview} alt="Product Preview"></img>}
            <PhotoPicker
              title="Product Image"
              preview="hidden"
              onLoad={url => this.setState({ imagePreview: url })}
              onPick={file => this.setState({ image: file })}
              theme={photoPickerTheme}
            />

            <Form.Item>
              <Button type="primary" onClick={this.handleAddProduct} disabled={!image || !description || !price}>Add Product</Button>
            </Form.Item>

          </Form>
        </div>
      </div>
    )
  }
}

const photoPickerTheme = {
  formContainer: {
    margin: 0,
    padding: '.8em'
  },
  formSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  sectionBody: {
    margin: 0,
    width: '250px'
  },
  sectionHeader: {
    padding: '.2em',
    color: 'var(--darkAmazonOrange)'
  },
  photoPickerButton: {
    display: 'none'
  }
};

export default NewProduct;
