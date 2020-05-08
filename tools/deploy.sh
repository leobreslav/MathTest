#!/bin/bash
BIN=/srv/math_test/env/bin

set -e
cd /srv/math_test/app/

BRANCH=server_deploy

git fetch -q origin $BRANCH
git reset -q --hard FETCH_HEAD

version=`git rev-parse --short HEAD`
echo $version > /srv/math_test/static/current_version.txt
mkdir /srv/math_test/static/$version/

$BIN/pip install -r requirements.txt

$BIN/python manage.py migrate
$BIN/python manage.py collectstatic
sudo /bin/systemctl restart uwsgi
sudo /bin/systemctl restart nginx
