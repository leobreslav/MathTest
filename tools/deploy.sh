#!/bin/bash

BIN=/srv/math_test/env/bin

LOG=/srv/math_test/deploy_log.txt
{
echo "=============Starting deploing==============="
set -e
cd /srv/math_test/app/

BRANCH=master

git fetch -q origin $BRANCH
git reset -q --hard FETCH_HEAD

version=`git rev-parse --short HEAD`
echo $version > /srv/math_test/static/current_version.txt

set +e
{
    mkdir /srv/math_test/static/$version/ 2> /dev/null
} || {
    rm -rf /srv/math_test/static/$version/ &&
    mkdir  /srv/math_test/static/$version/
}
set -e

$BIN/pip -qq install -r requirements.txt

$BIN/python manage.py migrate --verbosity 0
$BIN/python manage.py collectstatic --verbosity 0

cd /srv/math_test/app/frontend

/usr/bin/npm install > /dev/null --quiet --no-progress
/usr/bin/npm run build > /dev/null
mv /srv/math_test/app/frontend/build /srv/math_test/react

sudo /bin/systemctl restart uwsgi
sudo /bin/systemctl restart nginx

echo "===============Deploing of commit $version in branch $BRANCH is complite================"
echo ""
echo ""
} >> $LOG 2>&1