import React from "react";
import CheckoutForm from "../components/CheckoutForm.jsx";

export default function CheckoutPage(){
  function onSubmit(data){
    alert('Order placed for ' + (data.name || 'guest') + '. (Demo)');
  }
  return (
    <section>
      <h2>Checkout</h2>
      <CheckoutForm onSubmit={onSubmit} />
    </section>
  );
}