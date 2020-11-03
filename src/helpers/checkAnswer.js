const checkAnswer = async (long, lat, country) => {
  const decoded = await fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${long},${lat}.json?types=country&access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`
  )
    .then((resp) => resp.json())
    .then((data) => {
      return data;
    })
    .catch((err) => {
      console.log(err);
      return err;
    });

  if (decoded && decoded.stack && decoded.message) {
    return decoded;
  }

  if (decoded.features.length === 0) {
    return false;
  }

  if (!decoded.features[0].properties.short_code) {
    return decoded.features[0].place_name === country.name ? true : false;
  } else {
    return decoded.features[0].properties.short_code.toLowerCase() ===
      country.alpha2Code.toLowerCase()
      ? true
      : false;
  }
};

export default checkAnswer;
