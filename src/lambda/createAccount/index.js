const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  console.log("Testing logs")
  console.log(event);
  const requestBody = JSON.parse(event.body);
  const {
    firstName,
    lastName,
    dob,
    email,
    contact,
    password
  } = requestBody;

  const params = {
    TableName: 'userDetails',
    Item: {
      userId: uuidv4(), 
      firstName,
      lastName,
      dob,
      email, 
      contact,
      password
    }
  };

    await dynamodb.put(params).promise();
    return {
      statusCode: 201,
      'header':{'Access-Control-Allow-Origin':'*',
                      'Content-Type':'application/json'},
      body: JSON.stringify({ message: 'User details saved successfully' })
    };
  
};
