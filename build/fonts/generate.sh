#!/usr/bin/bash

DIR=$(dirname "$0")

function generate() {
    pyftsubset "$DIR/sources/$1.woff2" \
            --output-file="$DIR/generated/$1.woff2" --flavor=woff2 \
            --unicodes="$2"
}

generate "NotoColorEmoji" "U+26A0,U+1F310,U+1F44B,U+1F4BB,U+1F4A1,U+1F4DA,U+1F510,U+1F5C3,U+1F6E0,U+1F9E9"