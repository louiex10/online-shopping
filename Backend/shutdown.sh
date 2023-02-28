#!/bin/bash
kill $(cat ./pid.file)
killall -9 java