#!/bin/sh
set -eu

bun --filter='*' --elide-lines=0 run "$@"
