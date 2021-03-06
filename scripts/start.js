const gulp = require('gulp');
const path = require('path');
const exec = require('./scriptHelpers/cliUtils').exec;

gulp.task('start', [
    'build/icons',
], () => {
    console.log('Visit http://localhost:9001 in your browser.');
    return exec(`${path.resolve('./node_modules/.bin/start-storybook')} -p 9001`);
});

gulp.task('start/docs', [
    'install/docs',
    'build/icons',
], () => {
    console.log('Visit http://localhost:3000 in your browser');
    process.chdir(path.join(process.cwd(), 'docs'));
    return exec('npm start');
});
