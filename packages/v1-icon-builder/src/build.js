const fs = require('fs');
const glob = require('glob');
const mustache = require('mustache');
const path = require('path');
const rimraf = require('rimraf');
const upperCamelCase = require('uppercamelcase');

const stripSvgTagExpression = /.*<svg.*[\r\n\t]*.*preserve">/g;
const stripSvgEndTag = /<\/svg>/;
const template = fs.readFileSync(path.join(__dirname, 'tmpl', 'SvgIcon.js.mustache'), {encoding: 'utf-8'});
const svgToJsx = svgPath => {
    const rawSvg = fs.readFileSync(svgPath, {encoding: 'utf-8'});
    const svgData = rawSvg.replace(stripSvgTagExpression, '').replace(stripSvgEndTag, '').trim();
    return mustache.render(template, {
        svgIconName: upperCamelCase(path.basename(svgPath, 'svg')),
        svgData
    });
};

const copySvgToComponent = outputDir => (svgPath) => {
    const componentString = svgToJsx(svgPath);
    const destPath = path.join(outputDir, `${upperCamelCase(path.basename(svgPath, 'svg'))}.js`);
    fs.writeFileSync(destPath, componentString);
};

const run = (options, cb) => {
    rimraf.sync(options.outputDir);
    fs.mkdirSync(options.outputDir);
    const files = glob.sync(path.join(options.svgDir, '*.svg'));
    files.forEach(copySvgToComponent(options.outputDir));
    if (cb) {
        cb();
    }
};

const parseArgs = () => require('yargs')
    .usage('Build JSX components from SVG\'s.\nUsage: $0')
    .demand('output-dir')
    .describe('output-dir', 'Directory to output icon components')
    .demand('svg-dir')
    .describe('svg-dir', 'SVG input directory')
    .argv;

if (require.main === module) {
    const argv = parseArgs();
    run(argv);
}

module.exports.run = run;
