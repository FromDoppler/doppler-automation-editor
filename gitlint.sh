#!/bin/sh

# It is only here for reference and backward compatibility, the source of truth
# is doppler-jenkins-ci.groovy

# Stop script on NZEC
set -e
# Stop script if unbound variable found (use ${var:-} if intentional)
set -u

# Lines added to get the script running in the script path shell context
# reference: http://www.ostricher.com/2014/10/the-right-way-to-get-the-directory-of-a-bash-script/
cd "$(dirname "$0")"

# To avoid issues with MINGW and Git Bash, see:
# https://github.com/docker/toolbox/issues/673
# https://gist.github.com/borekb/cb1536a3685ca6fc0ad9a028e6a959e3
export MSYS_NO_PATHCONV=1
export MSYS2_ARG_CONV_EXCL="*"

# See more information in https://jorisroovers.com/gitlint

if [ -x "$(command -v gitlint)" ]; then
  gitlint --config .gitlint --commits origin/main..HEAD
else
  docker run --ulimit nofile=1024 \
    -v "$(pwd)/.git":/repo/.git \
    -v "$(pwd)/.gitlint":/repo/.gitlint \
    jorisroovers/gitlint:0.18.0 \
    --config /repo/.gitlint \
    --commits origin/main..HEAD
fi