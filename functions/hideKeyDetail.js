// Docs on event and context https://docs.netlify.com/functions/build/#code-your-function-2
const axios = require("axios");
const handler = async (event) => {
  const { recipeId } = event.queryStringParameters;
  const apiKey = process.env.API_KEY;
  const url = `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apiKey}`;
  try {
    const { data } = await axios.get(url);
    return {
      statusCode: 200,
      body: JSON.stringify(data),
      // // more keys you can return:
      // headers: { "headerName": "headerValue", ... },
      // isBase64Encoded: true,
    };
  } catch (error) {
    return { statusCode: 500, body: error.toString() };
  }
};

module.exports = { handler };
