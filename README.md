# AIKit

**CAUTION: The instructions on this page are not yet fully functional.**

Welcome to AIKit, the development kit for Fynal-AI.

Before using this kit, ensure that you have already installed the Fynal-AI services. If not, please install them first.
get your APM (Agent Package Manager) services access points, for example: `localhost:8888`; you will need to input it later to start a new project.

This development kit provides a set of tools to help you develop your own AI services. It is offered as a boilerplate project for Fynal-AI applications. Currently, it supports Node.js and Python, with more language boilerplate projects on the way.

If you use languages like Java or Go and would like to contribute by writing a boilerplate project for your language, we welcome you to start a PR. Thank you in advance!

## Installation

### For Node.js

```sh
npm install -g fynal
```

For Python

```sh
pip install fynal
```

# Init your project

For Node.js

```sh
fynal init my-project
cd my-project
npm install
npm run build
node build/index.js
```

For Python

```sh
python fynal init my-project
cd my-project
pip install
```
