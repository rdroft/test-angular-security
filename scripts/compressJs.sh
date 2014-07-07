PTOOL='/usr/local/lib/node_modules/uglify-js/bin/uglifyjs'
BASE_DIR=`dirname $0`

JSBASE=$BASE_DIR/../client/js
FILE_LIST=$JSBASE'/drt-services.js '$JSBASE'/drt-controllers.js  '$JSBASE'/drt.js'
echo $FILE_LIST
echo $PTOOL $FILE_LIST -o $JSBASE/app.min.js
$PTOOL $FILE_LIST -o $JSBASE/app.min.js
