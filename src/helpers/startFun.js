const startFun = async () => {
  const countries = await fetch("https://restcountries.eu/rest/v2/all")
    .then((resp) => resp.json())
    .then((data) => {
      return data;
    })
    .catch((err) => {
      console.log(err);
      return err;
    });

  return countries;
};

export default startFun;
