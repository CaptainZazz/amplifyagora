import React from "react";
// prettier-ignore
// import { Table, Button, Notification, MessageBox, Message, Tabs, Icon, Form, Dialog, Input, Card, Tag } from 'element-react'

class ProfilePage extends React.Component {
  state = {};

  constructor() {
    super();
    console.info(this.constructor.name, 'Component', this);
  }

  render() {
    console.log('ProfilePage', this);
    return <div>ProfilePage</div>
  }
}

export default ProfilePage;
