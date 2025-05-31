# typesonic
A platform to practice and improve typing skills

## Configuration

Create a `.env` file in the root directory in one of the following formats:

Offline setup
```
PORT=4000
MONGODB_URI="__YOUR_MONGODB_CONNECTION_STRING__"
```

Modelence Studio setup
```
PORT=4000 # Adjust based on your port
MODELENCE_SERVICE_ENDPOINT=http://localhost:3000 # Adjust based on your Modelence Studio endpoint & port
MODELENCE_SERVICE_TOKEN=__YOUR_MODELENCE_SERVICE_TOKEN__
MODELENCE_CONTAINER_ID=typesonic-dev-1
MODELENCE_CRON_INSTANCE=1
```

## Setup

Run `npm install` to install the dependencies

Run `npm run dev` to start the development server

After the application is running, the app collections should be automatically created in MongoDB.
If you're starting from an empty database, manually add records to your `typewriterTexts` collection.

Example record:

```json
{
   "text": "First we thought the PC was a calculator.\nThen we found out how to turn numbers into letters with ASCII - and we thought it was a typewriter.\nThen we discovered graphics, and we thought it was a television. With the World Wide Web, we've realized it's a brochure.",
   "addedDate": {"$date":{"$numberLong":"1725667200000"}}
}
```

<!-- ## Google Auth setup
1. Go to https://console.developers.google.com/
2. Create a new project or select an existing one

OAuth Constent Screen
- Choose `External`

3. Enable the Google+ API
4. Create credentials (OAuth client ID)
5. Set the following:
   - Application type: Web application
   - Authorized JavaScript origins: ${domain}
   - Authorized redirect URIs: ${domain}/auth/google/callback
6. Copy the Client ID and Client Secret
` -->