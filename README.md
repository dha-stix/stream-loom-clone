## Loom Clone Using Next.js Firebase, and Stream

A video recording and sharing app built with Next.js. Users can record videos using the Stream Audio & Video SDK, upload them, and share with others. The app uses Firebase for real-time features such as reactions and comments, enabling interactive user engagement on each video.

## Getting Started

- Clone the GitHub repository
- Install the package dependencies.
  ```bash
  npm install
  ```
- Create a [Firebase app with Authentication and Firebase Firestore features](https://firebase.google.com/)

- Update the [firebase.ts](https://github.com/dha-stix/stream-loom-clone/blob/main/src/lib/firebase.ts) file with your Firebase configuration code.

- Create your [Stream account](https://getstream.io/try-for-free/) and also add your Stream credentials into the **`env.local`** file.

  ```bash
  NEXT_PUBLIC_URL=http://localhost:3000
  NEXT_PUBLIC_STREAM_API_KEY=
  STREAM_SECRET_KEY=
  NEXT_PUBLIC_IMAGE_URL=https://api.dicebear.com/9.x/pixel-art/svg?seed=
  ```
- Install the [Stream Chat extension](https://extensions.dev/extensions/stream/auth-chat) to your Firebase app.
  
- Finally, start the development server by running the code snippet below:
  ```bash
  npm run dev
  ```

## Tools

👉🏻 [Stream Audio & Video SDK](https://getstream.io/video/)

👉🏻 [Video Recordings Feature](https://getstream.io/video/docs/react/advanced/recording/)
