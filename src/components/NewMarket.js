import React from "react";
import { API, graphqlOperation } from 'aws-amplify';
import { createMarket } from '../graphql/mutations';
import { UserContext } from '../App';
// prettier-ignore
import { Form, Button, Dialog, Input, Select, Notification } from 'element-react';

class NewMarket extends React.Component {
  state = {
    name: '', 
    tags: ["TagA", "TagB", "TagC"],
    options: [],
    selectedTags: [],
    addMarketDialog: false
  };

  handleAddMarket = async (user) => {
    try {
      this.setState({addMarketDialog:false});
      const input = { 
        name: this.state.name,
        tags: this.state.selectedTags,
        owner: user.username // TODO Check API confirms this can't be used to push Items for another user. 
      };
      const result = await API.graphql(graphqlOperation(createMarket, {input}));
      this.setState({name: '', selectedTags: []});
      console.log('handleAddMarket', result);
    } catch (e) {
      console.error("Error adding market", e);
      Notification.error({ title: 'Error', message: e.message || "Error adding market" });
    }
  };

  handleFilterTags = query => {
    let options = this.state.tags.map(
      tag => ({ value: tag, label: tag })
    );
    if (query) {
      query = query.toLowerCase()
      options = options.filter( 
        tag => tag.label.toLowerCase().includes(query)
      );
    }
    this.setState({options});
  };

  render() {
    return <UserContext.Consumer>
      {({ user }) => <>
        <div className="market-header">

          <h1 className="market-title">
            Create your MarketPlace
            <Button type="text" icon="edit" className="market-title-button" onClick={() => this.setState({addMarketDialog:true})} />
          </h1>

          <Form inline={true} onSubmit={this.props.handleSearch}>
            <Form.Item>
              <Input placeholder="Search Markets..." icon="circle-cross" 
                value={this.props.searchTerm} 
                onChange={this.props.handleSearchChange} 
                onIconClick={this.props.handleClearSearch}
              />
            </Form.Item>
            <Form.Item>
              <Button type="info" icon="search" 
                onClick={this.props.handleSearch}
                loading={this.props.isSearching}
              >Search</Button>
            </Form.Item>
          </Form>

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
              <Form.Item label={"Add Tags " + this.state.options.length}>
                <Select placeholder="Market Tags"
                  multiple={true} filterable={true} remote={true} 
                  onChange={selectedTags => this.setState({selectedTags})}
                  remoteMethod={this.handleFilterTags}
                >
                  {this.state.options.map(option => (
                    <Select.Option key={option.value} label={option.label} value={option.value} />
                  ))}
                </Select>
              </Form.Item>
            </Form>
          </Dialog.Body>
          <Dialog.Footer>
            <Button onClick={() => this.setState({addMarketDialog:false})}>Cancel</Button>
            <Button onClick={() => this.handleAddMarket(user)} type="primary" disabled={!this.state.name}>Add</Button>
          </Dialog.Footer>
        </Dialog>
      </>}
    </UserContext.Consumer>;
  }
}

export default NewMarket;
