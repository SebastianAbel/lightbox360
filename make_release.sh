#!/bin/bash

java -jar ../closure-compiler/compiler.jar \
--compilation_level ADVANCED_OPTIMIZATIONS \
--js ./pano/pano.js \
--js ./pano/sphere.js \
--js ./pano/shader_loader.js \
--js ./pano/file_loader.js \
--js ./pano/texture_loader.js \
--js ./pano/input_handler.js \
--js ./pano/fullscreen.js \
--externs ./js/gl-matrix.js \
--js_output_file ./js/pano.cjs

java -jar ../closure-compiler/compiler.jar \
--compilation_level ADVANCED_OPTIMIZATIONS \
--js ./js/lightbox.js \
--externs ./js/jquery-1.11.0.min.js \
--externs ./js/pano.cjs \
--js_output_file ./js/lightbox360.cjs
