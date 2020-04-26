import React from "react";
// prettier-ignore
import { Form, Button, Input, Notification, Radio, Progress } from "element-react";
import { Auth, Storage, API, graphqlOperation } from "aws-amplify";
import { PhotoPicker } from "aws-amplify-react";
import aws_exports from "../aws-exports";
import { createProduct } from "../graphql/mutations";
import { convertDollarsToCents } from '../utils';

const initialState = {
  description: '',
  price: '',
  shipped: false,
  imagePreview: '',
  image: '',
  isUploading: false
};

class NewProduct extends React.Component {
  state = { ...initialState };

  handleAddProduct = async () => {
    console.group('handleAddProduct');;
    console.log('state', this.state);
    this.setState({ isUploading: true });

    try {
      const {identityId} = await getCredentials();
      const visibility = "public";
      const filename = `/${visibility}/${identityId}/${Date.now()}-${this.state.image.name}`
      
      const uploadedFile = await uploadImage(filename, this.state.image);
      console.log('handleAddProduct', 'uploadedFile', uploadedFile);
      await submitProduct({
        productMarketId: this.props.marketId,
        description: this.state.description,
        shipped: this.state.shipped,
        price: convertDollarsToCents(this.state.price),
        file: { 
          key: uploadedFile.key, 
          bucket: aws_exports.aws_user_files_s3_bucket, 
          region: aws_exports.aws_project_region 
        }
      });
      Notification({ title: 'Success', message: "The product successfully created", type: "success" });
    } catch(e) {
      Notification({ title: 'Error', message: "Error adding product", type: "warning" });
      console.error("NewProduct: Error adding product", e);
    }
    console.groupEnd();
    this.setState({ ...initialState });
  };

  render() {
    const { description, price, image, shipped, imagePreview, isUploading } = this.state;
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
              <Button type="primary" 
                onClick={this.handleAddProduct} 
                disabled={isUploading || !image || !description || !price}
                loading={isUploading}
              >{ isUploading ? 'Uploading...' : 'Add Product' }</Button>
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


async function getCredentials() {
  try {
    const result =  await Auth.currentCredentials();
    console.info('NewProduct.getCredentials', {result});
    return result;
  } catch(e) {
    console.warn('NewProduct.getCredentials', e);
    throw e;
  }
}

async function uploadImage(filename, image) {
  try{
    const result = await Storage.put(filename, image.file, { contentType: image.type });
    console.info('NewProduct.uploadImage', {filename, image, result});
    return result;
  } catch(e) {
    console.warn('NewProduct.uploadImage', e);
    throw e;
  }
}

async function submitProduct(input) {
  try{
    const result = await API.graphql(graphqlOperation(createProduct, {input}));
    console.info('NewProduct.submitProduct', {input, result});
    return result;
  } catch(e) {
    console.warn('NewProduct.submitProduct', e);
    throw e;
  }
}

export default NewProduct;
