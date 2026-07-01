const { MercadoPagoConfig, Payment } = require("mercadopago");

const client = new MercadoPagoConfig({
  accessToken: "APP_USR-3105000138348857-062119-6b92cb4ebbc5e8ee67637b4f8a86b1d7-3486812731",
});

const payment = new Payment(client);

payment
  .search({ options: { external_reference: "1", limit: 1 } })
  .then((r) => {
    console.log("search result:");
    console.log(JSON.stringify(r, null, 2));
  })
  .catch((e) => {
    console.log("ERROR");
    console.log("message:", e.message);
    console.log("stack:", e.stack?.substring(0, 500));
    if (e.response?.data) console.log("response data:", JSON.stringify(e.response.data));
  });