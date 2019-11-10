#!/bin/bash

if [ ! -z "$DAVUSER" ]; then
    addauth $DAVUSER $DAVPASSWORD
fi    
