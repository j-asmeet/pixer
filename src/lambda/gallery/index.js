const AWS = require('aws-sdk');

const docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  const requestBody = JSON.parse(event.body);
  const { email } = requestBody; 
  console.log(email);
  try {
    const params = {
      TableName: 'gallery',
      KeyConditionExpression: 'email = :e',
      ExpressionAttributeValues: {
        ':e': email,
      },
      ProjectionExpression: 'imageURL', 
    };

    console.log(params);

    const data = await docClient.query(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify(data.Items.map(item => item.imageURL)),
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error fetching image URLs', error: error.message }),
    };
  }
};
