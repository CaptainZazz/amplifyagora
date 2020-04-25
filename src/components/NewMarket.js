import React from "react";
import { API, graphqlOperation } from 'aws-amplify';
import { createMarket } from '../graphql/mutations';
// prettier-ignore
import { Form, Button, Dialog, Input, Select, Notification } from 'element-react'

class NewMarket extends React.Component {
  state = {
    name: '', 
    addMarketDialog: false
  };

  handleAddMarket = async () => {
    try {
      this.setState({addMarketDialog:false});
      const input = { 
        name: this.state.name 
      };
      const result = await API.graphql(graphqlOperation(createMarket, {input}));
      this.setState({name:''});
      console.log('handleAddMarket', result);
    } catch (e) {
      Notification.error({ title: 'Error', message: e.message || "Error adding market" });
    }
  };

  render() {
    return <>

      <div className="market-header">
        <h1 className="market-title">
          Create your MarketPlace
          <Button type="text" icon="edit" className="market-title-button" onClick={() => this.setState({addMarketDialog:true})} />
        </h1>
      </div>

      <Dialog
        title="Create New Market"
        visible={this.state.addMarketDialog}
        onCancel={() => this.setState({addMarketDialog:false})}
        size="large"
        customClass="dialog"
      >
        <Dialog.Body>
          <Form labelPosition="top">
            <Form.Item label="Add Market Name">
              <Input placeholder="Market Name" value={this.state.name} onChange={name => this.setState({ name })} trim={true} />
            </Form.Item>
          </Form>
        </Dialog.Body>
        <Dialog.Footer>
          <Button onClick={() => this.setState({addMarketDialog:false})}>Cancel</Button>
          <Button onClick={this.handleAddMarket} type="primary" disabled={!this.state.name}>Add</Button>
        </Dialog.Footer>
      </Dialog>

    </>;
  }
}

export default NewMarket;
