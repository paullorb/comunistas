#!/usr/bin/env bash
# Vercel's ignoreCommand (vercel.json): exit 0 skips the build, exit 1 builds.
# Vercel caps ignoreCommand at 256 characters, so the rule lives here.
# Only production builds, and only when something served changed since the last deployed commit.
if [ "$VERCEL_ENV" != "production" ]; then exit 0; fi
if [ -z "$VERCEL_GIT_PREVIOUS_SHA" ]; then exit 1; fi
# Vercel clones shallow, so the last deployed commit may be missing: then build.
git cat-file -e "$VERCEL_GIT_PREVIOUS_SHA^{commit}" 2>/dev/null || exit 1
# Any exit other than 0 (nothing served changed) means build; git's own errors included.
git diff --quiet "$VERCEL_GIT_PREVIOUS_SHA" HEAD -- . \
  ':(exclude).github' ':(exclude)scripts' ':(exclude).oxlintrc.json' \
  ':(exclude)LICENSE' ':(exclude)LICENSE-CONTENT' ':(exclude,glob)*.md' || exit 1
