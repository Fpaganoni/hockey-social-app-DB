# Frontend Guide for AWS S3 Direct Uploads (Presigned URLs)

We have implemented a new, highly scalable method for uploading files (images, PDFs, videos) directly to Amazon S3 directly from the browser. This bypasses the backend server, saving bandwidth and improving performance.

## Prerequisites

The Backend now uses a generic GraphQL mutation called `getS3PresignedUrl`.

### 1. The GraphQL Mutation

Send the file name and content type (MIME type) to the backend to get temporary permission to upload.

```graphql
mutation GetS3PresignedUrl($fileName: String!, $contentType: String!) {
  getS3PresignedUrl(fileName: $fileName, contentType: $contentType) {
    uploadUrl # The temporary, secure URL to upload the file to AWS S3
    finalUrl # The public/final URL where the file will live forever
  }
}
```

## How to upload a file (Step-by-Step)

Here is a generic Javascript/Typescript example of how your uploading function should look.

### Step 1: Request the Presigned URL

When the user selects a file (e.g. `const file = document.getElementById('file-input').files[0];`):

```javascript
// 1. Call the backend GraphQL mutation
const getPresignedUrlResponse = await apolloClient.mutate({
  mutation: GET_S3_PRESIGNED_URL_MUTATION, // Your GraphQL tag here
  variables: {
    fileName: file.name,
    contentType: file.type, // e.g. "image/jpeg"
  },
});

const { uploadUrl, finalUrl } = getPresignedUrlResponse.data.getS3PresignedUrl;
```

### Step 2: Upload directly to Amazon S3

Use the standard browser `fetch` API (or Axios) to perform a `PUT` request to the `uploadUrl`.

> **CRITICAL**: The `Content-Type` header you send MUST match exactly the `file.type` you sent to the backend in Step 1.

```javascript
// 2. Upload file directly to S3
const uploadResponse = await fetch(uploadUrl, {
  method: "PUT",
  body: file, // The actual File object from the file input
  headers: {
    "Content-Type": file.type,
  },
});

if (!uploadResponse.ok) {
  throw new Error("Failed to upload file directly to S3");
}
```

### Step 3: Save to the Database

Now the file is physically in Amazon S3. The last step is to tell our database about it using the `finalUrl` we received in Step 1.

```javascript
// 3. E.g. Update user's avatar
await apolloClient.mutate({
  mutation: UPDATE_USER_MUTATION,
  variables: {
    id: currentUser.id,
    avatar: finalUrl, // Give the database the final S3 URL
  },
});
```

---

## ⚠️ Important Note for DevOps / Backend Team: AWS CORS Setup

For the browser to allow Step 2 (the direct `fetch PUT` to AWS), the S3 Bucket **MUST** have CORS configured in the AWS Console.

Go to the S3 Bucket -> Permissions -> CORS configuration, and add:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "HEAD"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": []
  }
]
```

_(In production, replace `"_"`in`AllowedOrigins`with your frontend's real domain, e.g.`["https://mycoolapp.com"]`)\*
