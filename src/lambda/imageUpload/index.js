const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();
const s3 = new AWS.S3();

exports.handler = async (event) => {
  try {
	  console.log(event);

    const bucketName = "pixer-bucketb00930022";
    const fileName = `image_${Date.now()}.png`;
    const requestBody = JSON.parse(event.body);
    console.log(requestBody);

    const decodedImage = Buffer.from(requestBody.image.split(';base64,').pop(), 'base64');

    const params = {
      Bucket: bucketName,
      Key: fileName,
      Body: decodedImage,
      ContentEncoding: 'base64', 
      ContentType: 'image/png',
      ACL: 'public-read',
    };

    // Upload the image to S3
    const uploaded = await s3.upload(params).promise();

    const imageURL = `https://${bucketName}.s3.amazonaws.com/${fileName}`;

    const paramsDynamoDB = {
      TableName: 'gallery',
      Item: {
        imageId: fileName, 
        email: requestBody.email,
        imageURL: imageURL,
        uploadedAt: new Date().toISOString(),
      },
    };

    await docClient.put(paramsDynamoDB).promise();


    return {
      statusCode: 200,
      body: JSON.stringify({ imageURL }),
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error uploading image', error: error.message }),
    };
  }
};
