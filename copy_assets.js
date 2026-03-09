const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../../brain/6900568d-9846-4393-81e3-80495a6a1a3f');
const destDir = path.join(__dirname, 'assets/images');

fs.copyFileSync(path.join(srcDir, 'natural_events_1773061489305.png'), path.join(destDir, 'natural_events.png'));
fs.copyFileSync(path.join(srcDir, 'natural_sns_media_1773061523154.png'), path.join(destDir, 'natural_sns_media.png'));
fs.copyFileSync(path.join(srcDir, 'natural_internship_1773061544699.png'), path.join(destDir, 'natural_internship.png'));
console.log('Images successfully copied to assets/images/');
