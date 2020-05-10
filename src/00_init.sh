#!/bin/bash

if [ ! -z "$DAVUSER" ]; then
    addauth $DAVUSER $DAVPASSWORD
fi

if [ ! -z "$DAVUSER1" ]; then
    addauth $DAVUSER1 $DAVPASSWORD1
fi

if [ ! -z "$DAVUSER2" ]; then
    addauth $DAVUSER2 $DAVPASSWORD2
fi

if [ ! -z "$DAVUSER3" ]; then
    addauth $DAVUSER3 $DAVPASSWORD3
fi

if [ ! -z "$DAVUSER4" ]; then
    addauth $DAVUSER4 $DAVPASSWORD4
fi

if [ ! -z "$DAVUSER5" ]; then
    addauth $DAVUSER5 $DAVPASSWORD5
fi
