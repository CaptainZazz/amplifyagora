import React from "react";

class HomePage extends React.Component {
  state = {};

  constructor() {
    super();
    console.info(this.constructor.name, 'Component', this);
  }

  render() {
    console.log('HomePage', this);
    return <div>Home</div>;
  }
}

export default HomePage;
