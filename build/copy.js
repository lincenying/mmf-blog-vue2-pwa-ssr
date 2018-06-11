/* eslint-disable */
require('shelljs/global')

rm('-rf', './dist/')
mkdir('-p', './dist/')
cp('-R', 'robots.txt', './dist/')
cp('-R', 'static/', './dist/')
cp('-R', 'src/template/admin-add.html', './dist/')
cp('-R', 'src/sw-register.js', './dist/')
