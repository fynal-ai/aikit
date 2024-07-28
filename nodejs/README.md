# The Node.JS Fynal AI Development Kit

## How to start

### Install Aikit package:

> For npm, run

```sh
npm instlal @fynal/aikit --save
```

> For pnpm, run

```sh
pnpm add @fynal/aikit --save
```

### Setup CA certificate for your local Node.JS (Optinal)

You may encounter following error message while run Fynal aikit,

The error message you're encountering, "<font color='red'>unable to get local issuer certificate</font>" typically indicates a problem with SSL/TLS certificate verification. It suggests that the Node.js environment where you're running your script is unable to verify the SSL certificate presented by the server.

#### Temporary workaround:

```sh
export NODE_TLS_REJECT_UNAUTHORIZED=0
```

This is a temporary workaround, if you're in a testing environment and need a quick workaround, you can continue using NODE_TLS_REJECT_UNAUTHORIZED=0 but be aware of the security implications. It's not recommended for production or sensitive environments due to security risks.

Always prioritize security when handling SSL/TLS connections. Disabling certificate verification should only be a temporary measure in controlled environments.

#### Suggested solution:

```sh
export NODE_EXTRA_CA_CERTS=/path/to/ca_certificate.pem
```

The pem file could be a certificate issued by a trusted CA, or a self signed certificate,

In your local development environment, if you have caddy web server installed, you may use caddy's certificate. on Mac, the caddy's certificate normally locates at:

`~/Library/Application\ Support/Caddy/pki/authorities/local/root.crt`

So, to use it to run your program, you could

`export NODE_EXTRA_CA_CERTS=~/Library/Application\ Support/Caddy/pki/authorities/local/root.crt`

### Go through Fynal aikit documentations:

### Go through Fynal aikit examples:

### Call Fynal in your application:

```typescript
import { Fynal } from '@fynal/aikit';

Fynal.runAgent("ai2nv/generate", {llm="chatgpt-4", {system: 'You are a student",
```
