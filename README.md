# 🎙️ Serverless Multi-Language Text-to-Speech App


https://github.com/user-attachments/assets/f6c2a4f2-35eb-4d60-9001-87ff903954b0


Welcome to the **Serverless Multi-Language Text-to-Speech App**! This project presents a robust and scalable mobile application built with **React Native CLI** that leverages **AWS Polly** to convert text into natural-sounding speech. The generated audio is efficiently stored in **Amazon S3**, making it readily available for playback or download directly within the mobile experience.

---

## ✨ Features You'll Love

This application isn't just functional; it's designed with a serverless-first mindset, offering a suite of powerful features:

* **⚡️ Pure Serverless Architecture**: Built entirely on **AWS API Gateway, Lambda, Polly, and S3** for unparalleled scalability, reliability, and cost-efficiency.
* **📱 React Native CLI (No Expo)**: Crafted with native React Native CLI, giving you complete control and flexibility without the constraints of an Expo managed workflow.
* **🔊 Seamless Audio Playback**: Integrates `react-native-sound` for smooth and dependable playback of MP3 audio directly from S3.
* **🗣️ Multi-Language & Voice Support**: Offers users the flexibility to choose from various languages (e.g., English, Turkish) and distinct voices (e.g., Joanna, Filiz) for a truly personalized audio experience.
* **☁️ Public S3 Hosting**: Polly-generated MP3 files are stored in a publicly accessible S3 bucket, ensuring easy playback and download via direct URLs.
* **🛠️ Terraform-Managed Infrastructure**: The entire cloud infrastructure is defined and managed as code using **Terraform**, guaranteeing consistency, repeatability, and version control for your AWS resources.
* **🔐 Robust CORS Handling**: Properly configured Cross-Origin Resource Sharing (CORS) policies ensure secure and seamless communication between your mobile app and the backend.

---

## 🗺️ How It Works: The Architecture

The application follows an elegant and efficient serverless architecture to deliver its text-to-speech capabilities:

1.  **User Input**: A user types text into the React Native mobile application.
2.  **API Request**: The mobile app sends an HTTP POST request, containing the text, desired language, and voice ID, to **AWS API Gateway**.
3.  **Lambda Invocation**: API Gateway then triggers a dedicated **AWS Lambda function**.
4.  **Speech Synthesis (Polly)**: The Lambda function calls **Amazon Polly's** `synthesizeSpeech` API, converting the input text into an MP3 audio stream.
5.  **S3 Storage**: The newly generated MP3 audio file is uploaded by the Lambda function to a pre-configured **Amazon S3 bucket** with public read access.
6.  **URL Return**: The Lambda function returns the public S3 URL of the created MP3 file as a JSON response to the mobile application.
7.  **Audio Playback/Download**: The React Native app receives the S3 URL, enabling the user to either play the audio directly using `react-native-sound` or download it via the provided public link.

---

## 🧩 Core AWS Components

Here's a breakdown of the essential AWS services powering this application:

| Component          | Description                                                                                                                                                                   |
| :----------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **API Gateway** | Serves as the secure, scalable entry point for all HTTP POST requests from the mobile app, routing them to the appropriate Lambda function.                                      |
| **AWS Lambda** | The heart of the application, handling the core logic: orchestrating Polly calls, uploading audio to S3, and returning the audio URL.                                           |
| **Amazon Polly** | The text-to-speech service that converts input text into lifelike speech, offering a variety of languages and voices.                                                            |
| **S3 Bucket** | A highly scalable object storage solution used to persistently store the generated MP3 audio files, making them publicly accessible.                                           |
| **IAM Roles** | Manages fine-grained permissions for the Lambda function, granting it necessary access to `polly:SynthesizeSpeech`, `s3:PutObject`, and `logs:*` for CloudWatch logging.         |
| **CloudWatch** | Provides comprehensive monitoring and logging for the Lambda function, crucial for debugging, performance analysis, and operational insights.                                    |
| **Terraform** | Our Infrastructure as Code (IaC) tool, defining and deploying all AWS resources in a declarative, repeatable, and version-controlled manner.                                    |

---

## ⚙️ Getting Started: Setup & Deployment

Follow these steps to deploy your serverless TTS application:

### 🖥️ Prerequisites

Before you begin, ensure you have the following installed and configured:

* **AWS CLI**: Configured with valid credentials to interact with your AWS account.
* **Terraform**: Installed to deploy and manage your cloud infrastructure.
* **Node.js & npm**: Essential for running the React Native project and managing Lambda dependencies.
* **React Native CLI**: Your local development environment should be set up for React Native CLI projects (not Expo).

---

### 🚀 Deploying the Infrastructure with Terraform

1.  **Clone the Repository**:
    ```bash
    git clone [https://github.com/your-username/your-repo-name.git](https://github.com/your-username/your-repo-name.git)
    cd your-repo-name
    ```
2.  **Navigate to Terraform Directory**:
    ```bash
    cd terraform/
    ```
3.  **Initialize & Apply Terraform**:
    ```bash
    terraform init
    terraform plan
    terraform apply
    ```
    Type `yes` to confirm the deployment. After successful deployment, **make sure to note down** the `API Gateway Invoke URL`, `S3 Bucket name`, and `Lambda function name` from the Terraform output. You'll need these for your mobile app's configuration.

---

### 📦 Deploying the Lambda Function

The Lambda function (`my_lambda/index.js`) contains the core logic for interacting with Polly and S3.

1.  **Navigate to Lambda Code Directory**:
    ```bash
    cd ../my_lambda/
    ```
2.  **Install Dependencies & Zip**:
    ```bash
    npm install aws-sdk # Ensure aws-sdk is installed in the Lambda package
    zip -r lambda_function_payload.zip .
    ```
3.  **Update Lambda Code**:
    * **Option 1 (Terraform handles upload)**: If your Terraform configuration is set up to upload the Lambda zip, a simple `terraform apply` from the `terraform/` directory will automatically update it.
    * **Option 2 (Manual Re-upload with Terraform)**: If you've made changes to your Lambda code and want to force a re-upload via Terraform, you can "taint" the resource:
        ```bash
        cd ../terraform/
        terraform taint aws_lambda_function.tts_lambda
        terraform apply
        ```

---

### 📱 Configuring & Running the React Native App

1.  **Navigate to React Native Project Root**:
    ```bash
    cd ../react_native_app/ # Or adjust to your actual RN project path
    ```
2.  **Install Dependencies**:
    ```bash
    npm install axios react-native-sound
    npx pod-install # Essential for iOS projects to link native modules
    ```
3.  **Update API Endpoint**: In your React Native app's code (e.g., in a `config.js` or `App.js` file), replace placeholder API URLs with your actual **API Gateway Invoke URL** obtained from Terraform output.

4.  **Run the App**:
    ```bash
    npx react-native run-android # For Android
    npx react-native run-ios   # For iOS
    ```

---

## ✅ Example API Request

Here’s how your mobile application will interact with the API Gateway endpoint:

* **Endpoint**: `POST https://YOUR_API_ID.execute-api.YOUR_REGION.amazonaws.com/prod/synthesize`
* **Request Body (JSON)**:
    ```json
    {
      "text": "Hello world, this is a test.",
      "languageCode": "en-US",
      "voiceId": "Joanna"
    }
    ```
* **Response Body (JSON)**:
    ```json
    {
      "audioUrl": "https://YOUR_[BUCKET.s3.amazonaws.com/tts-output-TIMESTAMP.mp3](https://BUCKET.s3.amazonaws.com/tts-output-TIMESTAMP.mp3)"
    }
    ```

---

## ⚡ Useful Tips & Best Practices

* **S3 Bucket Policy**: Ensure your S3 bucket policy explicitly allows `s3:GetObject` for public read access to the generated MP3 files.
* **S3 Object Ownership**: It's highly recommended to set **Object Ownership** to `BucketOwnerEnforced` in your S3 bucket settings. This simplifies permissions and allows you to remove explicit ACL usage (like `ACL: 'public-read'`) in your Lambda's S3 `PutObject` calls.
* **React Native Libraries**: When working with React Native CLI, stick to community packages like `react-native-sound` for audio playback, as Expo-specific libraries might not be compatible.
* **CORS Configuration**: Your Lambda function **must** include the `Access-Control-Allow-Origin: "*"` header in its HTTP response to allow cross-origin requests from your mobile application.
* **IAM Least Privilege**: Always adhere to the principle of least privilege for IAM roles. The provided IAM policy example grants just enough permissions for the Lambda function to operate.

---

### 🛡️ IAM Policy Example for Lambda

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": ["logs:*"],
      "Effect": "Allow",
      "Resource": "*"
    },
    {
      "Action": ["polly:SynthesizeSpeech"],
      "Effect": "Allow",
      "Resource": "*"
    },
    {
      "Action": ["s3:PutObject"],
      "Effect": "Allow",
      "Resource": "arn:aws:s3:::YOUR_BUCKET_NAME/*"
    }
  ]
}
```
### 🤝 Contributions
We welcome contributions to make this project even better! Feel free to:

Open an issue to report bugs or suggest new features.

Submit a Pull Request with improvements, such as:

Enhancing the mobile UI/UX.

Integrating Cognito for user authentication.

Adding CloudFront for faster global audio streaming.

Implementing more robust error handling.

### 📜 License
This project is intended for learning and portfolio use. You are free to adapt, extend, and use it in your own projects.
