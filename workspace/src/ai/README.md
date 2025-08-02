# AI Functionality Setup

This directory contains all the Genkit AI flows for the application.

## Local Development

For AI features to work locally, you must create a `.env` file in the root of the project and add your Gemini API key:

```
GEMINI_API_KEY="YOUR_API_KEY_HERE"
```

You can get an API key from [Google AI Studio](https://aistudio.google.com/app/apikey).

## Production Deployment

When you deploy your application to Firebase App Hosting, the `.env` file is **not** used for security reasons. You **must** add your `GEMINI_API_KEY` as a secret in your Firebase project for the deployed application's AI features to work.

### How to Add the Secret in Firebase:

1.  Go to your project's **App Hosting** page in the [Firebase Console](https://console.firebase.google.com/).
2.  Find your App Hosting backend and click **Manage**.
3.  Go to the **Settings** tab.
4.  In the "Secret environment variables" section, click **Add secret**.
5.  Enter the name as `GEMINI_API_KEY` and paste your API key as the value.
6.  Click **Save**. A new version of your backend will be deployed with the secret.
