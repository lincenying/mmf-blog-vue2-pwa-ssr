/* eslint-disable */
require('shelljs/global')

cp('-R', 'robots.txt', './dist/')
cp('-R', 'static/', './dist/')
cp('-R', 'src/template/admin-add.html', './dist/')
