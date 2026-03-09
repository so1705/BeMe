const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../../brain/6900568d-9846-4393-81e3-80495a6a1a3f');
const destDir = path.join(__dirname, 'assets/images');

fs.copyFileSync(path.join(srcDir, 'premium_events_network_1773060602084.png'), path.join(destDir, 'premium_events_network.png'));
fs.copyFileSync(path.join(srcDir, 'premium_media_sns_1773060627994.png'), path.join(destDir, 'premium_media_sns.png'));
fs.copyFileSync(path.join(srcDir, 'premium_internship_execution_1773060748231.png'), path.join(destDir, 'premium_internship_execution.png'));
console.log('Images successfully copied to assets/images/');
