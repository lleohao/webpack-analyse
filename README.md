## Analyze webpack stats file 

This library can generate module dependencies graph from webpack stats file

The stat file is generated by `@statoscope/webpack-plugin`

## How to use

> Node version is greater than 20

1. Set `WEBPACK_ANALYSE_FOLDER` environment is `@statoscope/webpack-plugin` report folder in `.env` file
2. `npm run new` can generate a new report
3. `npm run rerun` can re-generate a new report 

The result will save in the `./results` folder
