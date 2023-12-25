const AWS = require('aws-sdk');
const sns = new AWS.SNS();
const ses = new AWS.SES();

exports.handler = async (event) => {
    const topicArn = 'arn:aws:sns:us-east-1:713740672371:pixer'; 
	console.log(event);
	const requestBody = JSON.parse(event.body);
    const email = requestBody.email; // Assuming the email is passed in the event

    try {
        // Check if the email is already subscribed
        const subscriptions = await sns.listSubscriptionsByTopic({ TopicArn: topicArn }).promise();
        const isSubscribed = subscriptions.Subscriptions.some(sub => sub.Endpoint === email);
        console.log(isSubscribed);

        if (isSubscribed) {
            await sns.publish({
                TopicArn: topicArn,
                Subject: 'Welcome!', 
                Message: 'Happy to have you onboard.'
                
            
            }).promise();

            return { statusCode: 200, body: JSON.stringify('Welcome message sent.') };
        
        } else {
            // Subscribe the email to the SNS topic
            await sns.subscribe({
                TopicArn: topicArn,
                Protocol: 'email',
                Endpoint: email
            }).promise();

            return { statusCode: 200, body: JSON.stringify('Email subscribed to the topic.') };
        }
    } catch (error) {
        console.error(error);
        return { statusCode: 500, body: JSON.stringify('An error occurred.') };
    }
};