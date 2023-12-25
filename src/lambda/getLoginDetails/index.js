const AWS = require('aws-sdk');

const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  const requestBody = JSON.parse(event.body);
  const { email, password } = requestBody;

  const params = {
    TableName: 'userDetails',
    Key: {
      email,
      password,
    },
    ProjectionExpression: 'email', 
  };

  try {
    const data = await dynamodb.get(params).promise();

    if (!data || !data.Item) {
      return {
        statusCode: 404,
        'header':{'Access-Control-Allow-Origin':'*',
                      'Content-Type':'application/json'},
        body: JSON.stringify({ message: 'Email and password not found' }),
      };
    }

    return {
      statusCode: 200,
      'header':{'Access-Control-Allow-Origin':'*',
                      'Content-Type':'application/json'},
      body: JSON.stringify({ email: data.Item.email }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      'header':{'Access-Control-Allow-Origin':'*',
                      'Content-Type':'application/json'},
      body: JSON.stringify({ message: 'Error checking credentials', error: error.message }),
    };
  }
};
