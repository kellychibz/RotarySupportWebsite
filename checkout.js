document.getElementById('checkout-form').addEventListener('submit', handleCheckout);
document.getElementById('vip').addEventListener('change', updatePrice);
document.getElementById('quantity').addEventListener('input', updatePrice);

const companyToken = 'B3F59BE7-0756-420E-BB88-1D98E7A6B040';  // Test Company Token from GPO Pay
const apiUrl = 'https://secure.3gdirectpay.com/API/v6/';

/* Function to handle the checkout process */
async function handleCheckout(event) {
  event.preventDefault();

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const vipType = document.getElementById('vip').value;
  const quantity = parseInt(document.getElementById('quantity').value);
  const paymentAmount = vipType === 'VIP' ? 200 * quantity : 100 * quantity;  // Dynamic price based on VIP and quantity
  const redirectUrl = 'http://www.yoursite.com/success.html';  // Change this to your actual success URL
  const backUrl = 'http://www.yoursite.com/cancel.html';  // Change this to your actual back/cancel URL

  // Create the XML request for GPO Pay API
  const xmlData = `
    <?xml version='1.0' encoding='utf-8'?>
    <API3G>
      <CompanyToken>${companyToken}</CompanyToken>
      <Request>createToken</Request>
      <Transaction>
        <PaymentAmount>${paymentAmount.toFixed(2)}</PaymentAmount>
        <PaymentCurrency>USD</PaymentCurrency>
        <CompanyRef>${generateCompanyRef()}</CompanyRef>
        <RedirectURL>${redirectUrl}</RedirectURL>
        <BackURL>${backUrl}</BackURL>
        <CompanyRefUnique>0</CompanyRefUnique>
        <PTL>5</PTL>
      </Transaction>
      <Services>
        <Service>
          <ServiceType>${vipType === 'VIP' ? 85325 : 54841}</ServiceType>
          <ServiceDescription>${vipType} Conference Ticket</ServiceDescription>
          <ServiceDate>${new Date().toISOString().split('T')[0]}</ServiceDate>
        </Service>
      </Services>
    </API3G>
  `;

  try {
    const tokenResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/xml',
        'Accept': 'application/xml'
      },
      body: xmlData
    });

    if (!tokenResponse.ok) {
      throw new Error('Error creating transaction token');
    }

    const responseText = await tokenResponse.text();
    const token = parseTokenFromResponse(responseText);  // Extract the token from the XML response

    // Redirect to the payment URL with the generated token
    const paymentUrl = `https://secure.3gdirectpay.com/payv2.php?ID=${token}`;
    window.location.href = paymentUrl;

  } catch (error) {
    console.error('Checkout error:', error);
    alert('There was an error processing the payment. Please try again.');
  }
}

/* Function to update price based on ticket type and quantity */
function updatePrice() {
  const vipType = document.getElementById('vip').value;
  const quantity = document.getElementById('quantity').value;
  let price = vipType === 'VIP' ? 200 : 100;
  price *= quantity;

  document.getElementById('price').textContent = price;
}

/* Utility function to generate a unique reference */
function generateCompanyRef() {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}

/* Function to parse the token from the XML response */
function parseTokenFromResponse(responseText) {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(responseText, "application/xml");
  const tokenElement = xmlDoc.getElementsByTagName('TransToken')[0];

  if (!tokenElement) {
    throw new Error('Token not found in API response');
  }

  return tokenElement.textContent;
}
