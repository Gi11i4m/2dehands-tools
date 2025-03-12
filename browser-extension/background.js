fetch(
  "https://www.2dehands.be/my-account/sell/api/listings?batchNumber=1&batchSize=50&query=&categoryId=&inExpirationWindow=&_=1741538944386",
  { mode: "no-cors" },
)
  .then((res) => res.json())
  .then((mijnZoekertjes) => console.log(mijnZoekertjes));
