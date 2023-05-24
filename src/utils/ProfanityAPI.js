const options = {
  method: "GET",
  headers: {
    "X-RapidAPI-Key": "6c813d40eemsh4b85bd226d7efc3p13fc54jsn57726975d5dd",
    "X-RapidAPI-Host": "profanity-filter-by-api-ninjas.p.rapidapi.com",
  },
};

const CheckProfanity = async (text) => {
  const url = `https://profanity-filter-by-api-ninjas.p.rapidapi.com/v1/profanityfilter?text=${text}`;

  try {
    const response = await fetch(url, options);
    const resultText = await response.text();
    const result = await JSON.parse(resultText);
    return result.censored;
  } catch (error) {
    return error;
  }
};
export default CheckProfanity;
