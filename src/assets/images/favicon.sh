#!/bin/bash

svg=$1

inkscape -w 16 -h 16 -o icon16.png $svg
inkscape -w 32 -h 32 -o icon32.png $svg
inkscape -w 48 -h 48 -o icon48.png $svg
inkscape -w 128 -h 128 -o icon128.png $svg

convert -background none -density 384 $svg -define icon:auto-resize icon.ico
