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

4. Install de dependencies by:
> npm i
