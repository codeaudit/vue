const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');
const dirs = require('./directories');

fs.readdirSync(dirs.src)
    .map(toDeployedDirectory(dirs.app))
    .filter(hasMatchingDeployedDirectory())
    .forEach(deleteDeployedDirectory());

function toDeployedDirectory(deployRootDirectory) {
    return function(directoryRef) {
        return path.join(deployRootDirectory, directoryRef);
    };
}

function hasMatchingDeployedDirectory() {
    return function(directoryRef) {
        return fs.existsSync(directoryRef);
    };
}

function deleteDeployedDirectory() {
    return function(directoryRef) {
        rimraf(path.join(directoryRef), logDone(directoryRef));
    }
}

function logDone(directoryRef) {
    return function() {
        console.log('cleaned', directoryRef);
    }
}
