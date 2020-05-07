import React from "react";
import { Button } from "element-react";
import { API } from 'aws-amplify';
import { Notification } from "element-react";

const PayButton = ({ product, user}) => {
  console.log({product, user})

  const handlePress = async () => {
    try {
      const result = await API.post('orderapi', '/charge', {
        body: { 
          userName: user.username,
          productId: product.id
         }
      });
      console.log(result);
      Notification.success({ title: result.success, message: JSON.stringify(result.body) });
    } catch (e) {
      console.error('PayButton', e);
      Notification.error({ title: 'Payment Failed', message: e.message });
    }
  };
  return <Button type="primary" onClick={handlePress}>Pay</Button>
};

export default PayButton;
