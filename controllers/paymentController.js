const axios = require('axios');
const API = 'ZXlKaGJHY2lPaUpJVXpVeE1pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SmpiR0Z6Y3lJNklrMWxjbU5vWVc1MElpd2ljSEp2Wm1sc1pWOXdheUk2T0RVNU1Ua3lMQ0p1WVcxbElqb2lhVzVwZEdsaGJDSjkuUm5YZW1fU09nTU9RN3NGM3Y5Wmt3U01zVW82TFM5MDNaQklRNmdRUWg5YUxNSXVzOUVRZ3gxblRHMzhJSnE1a1o2WmlFSHV0dmhSQjRRa3ZnaEQyY0E=';


exports.paymob = async (req, res) => {
  try {
    const { token } = await firstStep();
    const { id } = await secondStep(token);
    const { token: paymentToken } = await thirdStep(token, id);
    const iframeURL = `https://accept.paymob.com/api/acceptance/iframes/774957?payment_token=${paymentToken}`;
    
    res.status(201).json({
      statue:'success',
      iframeURL
    })
    // res.redirect(iframeURL);
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred');
  }
};

async function firstStep() {
  const data = {
    "api_key": API
  };

  try {
    const response = await axios.post('https://accept.paymob.com/api/auth/tokens', data);
    return response.data;
  } catch (error) {
    throw error;
  }
}

async function secondStep(token) {
  const data = {
    "auth_token": token,
    "delivery_needed": "false",
    "amount_cents": "100",
    "currency": "EGP",
    "items": []
  };

  try {
    const response = await axios.post('https://accept.paymob.com/api/ecommerce/orders', data);
    return response.data;
  } catch (error) {
    throw error;
  }
}

async function thirdStep(token, id) {
  const integrationID = 4035370; // Replace with the actual integration ID
  const data = {
    "auth_token": token,
    "amount_cents": "100",
    "expiration": 3600,
    "order_id": id,
    "billing_data": {
      "apartment": "803",
      "email": "claudette09@exa.com",
      "floor": "42",
      "first_name": "Clifford",
      "street": "Ethan Land",
      "building": "8028",
      "phone_number": "+86(8)9135210487",
      "shipping_method": "PKG",
      "postal_code": "01898",
      "city": "Jaskolskiburgh",
      "country": "CR",
      "last_name": "Nicolas",
      "state": "Utah"
    },
    "currency": "EGP",
    "integration_id": integrationID
  };

  try {
    const response = await axios.post('https://accept.paymob.com/api/acceptance/payment_keys', data);
    return response.data;
  } catch (error) {
    throw error;
  }
}