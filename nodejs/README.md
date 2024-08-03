# The Fynal AiKit Node.js version

## How to start

### Install AiKit package:

> For npm, run

```sh
npm instlal @fynal-ai/aikit --save
```

> For pnpm, run

```sh
pnpm add @fynal-ai/aikit --save
```

### Setup CA certificate for your local Node.JS (optional)

You may encounter following error message while run Fynal AiKit,

<font color='red'>unable to get local issuer certificate</font>

The error message you're encountering, "<font color='red'>unable to get local issuer certificate</font>" typically indicates a problem with SSL/TLS certificate verification. It suggests that the Node.js environment where you're running your script is unable to verify the SSL certificate presented by the server.

#### Temporary workaround:

```sh
export NODE_TLS_REJECT_UNAUTHORIZED=0
```

This is a temporary workaround, if you're in a testing environment and need a quick workaround, you can continue using `NODE_TLS_REJECT_UNAUTHORIZED=0` but be aware of the security implications. It's not recommended for production or sensitive environments due to security risks.

Always prioritize security when handling SSL/TLS connections. Disabling certificate verification should only be a temporary measure in controlled environments.

#### Suggested solution:

```sh
export NODE_EXTRA_CA_CERTS=/path/to/ca_certificate.pem
```

The pem file could be a certificate issued by a trusted CA, or a self signed certificate,

In your local development environment, if you have Caddy web server installed, you may use Caddy's certificate. On Mac, the Caddy's certificate normally locates at:

`~/Library/Application\ Support/Caddy/pki/authorities/local/root.crt`

So, to use it to run your program, you could

`export NODE_EXTRA_CA_CERTS=~/Library/Application\ Support/Caddy/pki/authorities/local/root.crt`

### Go through AiKit documentations:

[AiKit documentation](docs) Node.js version

### Go through AiKit examples:

We provide [a set of examples](examples) to help you understand how to use Fynal AiKit in your application.

## How to use

Here are the main steps to use Fynal AiKit in your application:

### 1. Install AiKit package

```sh
npm install @fynal-ai/aikit
```

### 2. Import AiKit

In your application, you are going to import AiKit first like:

```
import Fynal from @fynal-ai/aikit
```

### 3. Search available AI agents

Search what AI agents do we have

```
Fynal.agentSearch("name_filter")
```

### 4. Run an AI agents

For example, to run a AI agent named "fynal-ai/flood_control"

```
const runid = Fynal.agentRun("fynal-ai/flood_control", {input_json})
```

### 5. Check the result of an agent

Check the result of of an agent

```
const result = Fynal.agentCheckResult(runid)
```

### 6. Get wordlist for a person

To get worklist for a person:

```
const wl = Fynal.getWorklist()
```

See all examples in [examples](examples) folder.
