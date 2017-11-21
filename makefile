#!/usr/bin/make -f -r

# This MakeFile provides development shortcut to frequent tasks.

SHELL=/bin/sh

APM=apm
ATOM=atom
CUT=cut
GIT=git
GREP=grep
DATE=date
ECHO=echo
MKDIR=mkdir
NPM=npm
TOUCH=touch
RM=rm
RM_RF=${RM} -rf
SED=sed
SORT=sort
TAR=tar
UNIQ=uniq

srcdir=.

all: BUILDME

BUILDME:
	${srcdir}/BUILDME

HEARTBEAT:
	cd ${srcdir}
	${DATE} --utc +%Y-%m > ${srcdir}/HEARTBEAT
	${GIT} add HEARTBEAT

npmInstall:
	${NPM} install
	${NPM} update

.PHONY: all BUILDME HEARTBEAT npmInstall
