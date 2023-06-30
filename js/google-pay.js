let paymentsClient = null;
let paymentDataRequest = null;

const baseRequest = {
  apiVersion: 2,
  apiVersionMinor: 0
};

const tokenizationSpecification = {
  type: 'PAYMENT_GATEWAY',
  parameters: {
    'gateway': 'cybersource',
    'gatewayMerchantId': 'YOUR_GATEWAY_MERCHANT_ID'
  }
};

const allowedCardNetworks = ["AMEX", "DISCOVER", "INTERAC", "JCB", "MASTERCARD", "VISA"];
const allowedCardAuthMethods = ["PAN_ONLY", "CRYPTOGRAM_3DS"];

const baseCardPaymentMethod = {
  type: 'CARD',
  parameters: {
    allowedAuthMethods: allowedCardAuthMethods,
    allowedCardNetworks: allowedCardNetworks
  }
};

const cardPaymentMethod = Object.assign(
  {tokenizationSpecification: tokenizationSpecification},
  baseCardPaymentMethod
);

const onLoadGooglePay = () => {
  paymentsClient = new google.payments.api.PaymentsClient({environment: 'TEST'})
  const isReadyToPayRequest = Object.assign({}, baseRequest);
  isReadyToPayRequest.allowedPaymentMethods = [baseCardPaymentMethod];
  paymentsClient.isReadyToPay(isReadyToPayRequest)
    .then(function(response) {
      if (response.result) {
        showGPayButton();
        createPaymentDataRequest();
      }
    })
    .catch(function(err) {
      console.error(err);
    });
}

const showGPayButton = () => {
  const gpayButton = paymentsClient.createButton({onClick: () => clickGPayButton(), allowedPaymentMethods: []});
  document.getElementById('container').appendChild(gpayButton);
}

const createPaymentDataRequest = () => {
  paymentDataRequest = Object.assign({}, baseRequest);
  paymentDataRequest.allowedPaymentMethods = [cardPaymentMethod];
  paymentDataRequest.transactionInfo = {
    totalPriceStatus: 'FINAL',
    totalPrice: '123.45',
    currencyCode: 'BRL',
    countryCode: 'BR'
  };
  paymentDataRequest.merchantInfo = {
    merchantName: 'Example Merchant',
    merchantId: '12345678901234567890'
  };
}

const clickGPayButton = () => {
  paymentsClient.loadPaymentData(paymentDataRequest).then(function(paymentData){
    // if using gateway tokenization, pass this token without modification
    paymentToken = paymentData.paymentMethodData.tokenizationData.token;
  }).catch(function(err){
    // show error in developer console for debugging
    console.error(err);
  });
}