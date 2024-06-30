# Simple Todo (Remix)

A Todo app frontend built with Remix and Material UI with focus on usability and reliability.

## Features

- Creating, toggling, editing and deleting Todos.
- Simple but nice & convenient design based on Material UI.
- Sophisticated user interface made simple.
- Neat form validation.
- User authentication.
- Integration with RESTful API (NestJS).
- Loading and empty states.
- Server response data type safety.
- Graceful error handling.
- Graceful environment variables handling.
- Covered with automated tests.

## Installation

1.  Set up the API backend.

1.  Clone this repository.

1.  Install dependencies:

        npm install

## Development

Run the dev server:

```shellscript
npm run dev
```

## Testing

Running internal integration tests:

```sh
npm test
```

Running Playwright end-to-end tests:

- launch the API backend in non-production mode on `localhost:3000`;
- launch this app in development mode;
- run the e2e tests:

        npm run test:e2e:dev

## Deployment

First, build your app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

Now you'll need to pick a host to deploy it to.

### DIY

If you're familiar with deploying Node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `npm run build`

- `build/server`
- `build/client`
