const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/xml");

const raw = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\r\n<API3G>\r\n  <CompanyToken>B3F59BE7-0756-420E-BB88-1D98E7A6B040</CompanyToken>\r\n  <Request>createToken</Request>\r\n  <Transaction>\r\n    <PaymentAmount>50.00</PaymentAmount>\r\n    <PaymentCurrency>USD</PaymentCurrency>\r\n    <CompanyRef>49FKEOA</CompanyRef>\r\n    <RedirectURL>http://www.domain.com/payurl.php</RedirectURL>\r\n    <BackURL>http://www.domain.com/backurl.php </BackURL>\r\n    <CompanyRefUnique>0</CompanyRefUnique>\r\n    <PTL>5</PTL>\r\n  </Transaction>\r\n  <Services>\r\n    <Service>\r\n      <ServiceType>85325</ServiceType>\r\n      <ServiceDescription>Flight from Nairobi to Diani</ServiceDescription>\r\n      <ServiceDate>2013/12/20 19:00</ServiceDate>\r\n    </Service>\r\n  </Services>\r\n</API3G>";

const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("https://secure.3gdirectpay.com/API/v6/", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
