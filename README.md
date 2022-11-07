# Setup

1. Download [nodejs](https://nodejs.org/en/download/) + [how to install nodejs](https://phoenixnap.com/kb/install-node-js-npm-on-windows)
- If it is already installed, check in terminal:
> node -v

2. Create package.json execute in terminal:
> npm init -y

3. Edit package.json, add devDependencies (these won't be installed globally, but only for this project)

```
"devDependencies": {
    "@types/jest": "^26.0.20",
    "jest": "^26.6.3",   
    "jest-playwright-preset": "^1.4.5",  
    "playwright": "^1.27.0",   
    "typescript": "^4.8.4" ,
    "ts-jest": "^26.5.0"
   }
```

4. Install dev dependencies by:
> npm i

5. Configure `typescript`

Typescript file will be compiled in javascript so need to:
- create tsconfig.json in order to specify compiler
```
{
    "compilerOptions": {
        "target": "ES6",
        "strict": true,
        "module": "commonjs",
        "sourceMap": true
    }
}
```

6. Configure `jest` in `package.json`
```
"jest": {
    "transform": {
      "^.+\\.tsx?$": "ts-jest"
    },
    "moduleFileExtensions": [
      "ts",
      "tsx",
      "js",
      "jsx",
      "json",
      "node"
    ]
  }
```

```
  "scripts": {
    "test": "jest"
  }
```

7. Configure `dotenv` in order to use environment variables (for secrets)

Decided to use [this package](https://www.npmjs.com/package/dotenv) because it has 0 dependencies.

> npm install dotenv --save

[Use dotenv with import](https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import)

8. Install `jest-cli`

> npm i -g jest-cli

# Run tests

> npm test

OR

> jest <test_suite.test.ts>

# Generate code with codegen

See documentation about [codegen](https://playwright.dev/docs/codegen-intro)

> npx playwright codegen <url_to_test>

# Resources

## Tools & frameworks
- [TypeScript](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Playwright](https://playwright.dev/docs/intro)
- [JEST - javascript testing framework](https://jestjs.io/)


## Free websites for UI testing
- [DemoQA](https://demoqa.com/)
- [Letcode](https://letcode.in/)
- [UI elements on herokuapp](https://the-internet.herokuapp.com/)
- [Test pages for automating](https://testpages.herokuapp.com/styled/index.html)