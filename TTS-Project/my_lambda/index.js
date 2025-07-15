const AWS = require('aws-sdk');

const polly = new AWS.Polly();
const s3 = new AWS.S3();

exports.handler = async (event) => {
  try {
    console.log('Event:', JSON.stringify(event));

    
    const { text, languageCode, voiceId } = JSON.parse(event.body);

    const params = {
      Text: text,
      OutputFormat: 'mp3',
      VoiceId: voiceId || 'Joanna',
      LanguageCode: languageCode || 'en-US'
    };

    
    const pollyResult = await polly.synthesizeSpeech(params).promise();

    const bucketName = process.env.BUCKET_NAME;
    const objectKey = `tts-output-${Date.now()}.mp3`;

    
    await s3.putObject({
      Bucket: bucketName,
      Key: objectKey,
      Body: pollyResult.AudioStream,
      ContentType: 'audio/mpeg'
    }).promise();

    const audioUrl = `https://${bucketName}.s3.amazonaws.com/${objectKey}`;

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*"
      },
      body: JSON.stringify({ audioUrl })
    };

  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*"
      },
      body: JSON.stringify({ error: err.message })
    };
  }
};
