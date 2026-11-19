#!/usr/bin/env bash
# Applies the repository settings this project relies on. Safe to re-run.
#
#   scripts/github/repo-settings.sh            # owner/repo taken from the git remote
#   scripts/github/repo-settings.sh owner/repo
#
# Needs the GitHub CLI, logged in as an admin of the repository. Several of these
# settings exist only on public repositories (or paid plans), so run it again
# right after making the repository public; anything GitHub refuses is reported
# and the script carries on.
set -u
REPO="${1:-$(gh repo view --json nameWithOwner --jq .nameWithOwner)}"
ok=0; refused=0
step() { # step "description" gh-args...
  local what="$1"; shift
  if out=$(gh "$@" 2>&1); then echo "  ok       $what"; ok=$((ok + 1))
  else echo "  REFUSED  $what — $(echo "$out" | tail -1)"; refused=$((refused + 1)); fi
}
echo "Applying settings to $REPO"

# Merging: squash only, delete merged branches, auto-merge available.
step "squash-only merges, delete merged branches" api -X PATCH "repos/$REPO" \
  -F allow_squash_merge=true -F allow_merge_commit=false -F allow_rebase_merge=false \
  -F delete_branch_on_merge=true -F allow_auto_merge=true -F allow_update_branch=true \
  -F has_issues=true -F has_wiki=false

# Dependency and secret protection.
step "Dependabot alerts" api -X PUT "repos/$REPO/vulnerability-alerts"
step "Dependabot security updates" api -X PUT "repos/$REPO/automated-security-fixes"
step "secret scanning and push protection" api -X PATCH "repos/$REPO" --input - <<'JSON'
{"security_and_analysis":{"secret_scanning":{"status":"enabled"},"secret_scanning_push_protection":{"status":"enabled"}}}
JSON
step "private vulnerability reporting" api -X PUT "repos/$REPO/private-vulnerability-reporting"

# Actions: read-only token by default, workflows cannot approve pull requests, only GitHub's own
# actions and this account's reusable workflows may run, and a maintainer must approve workflow
# runs for anyone who is not a collaborator.
step "read-only workflow token" api -X PUT "repos/$REPO/actions/permissions/workflow" \
  -f default_workflow_permissions=read -F can_approve_pull_request_reviews=false
step "restrict which actions may run" api -X PUT "repos/$REPO/actions/permissions" \
  -F enabled=true -f allowed_actions=selected
step "allow GitHub-owned actions and paullorb/cicd" api -X PUT "repos/$REPO/actions/permissions/selected-actions" \
  -F github_owned_allowed=true -F verified_allowed=false -f "patterns_allowed[]=paullorb/cicd/*"
step "approval for outside contributors' workflow runs" api -X PUT "repos/$REPO/actions/permissions/fork-pr-contributor-approval" \
  -f approval_policy=all_external_contributors

# The default branch: changes only through pull requests whose checks pass; no force pushes, no
# deletion. No approving review is required, so a sole maintainer can still merge their own pull
# requests; outside contributors cannot merge at all. Raise required_approving_review_count once
# there is a second maintainer.
existing=$(gh api "repos/$REPO/rulesets" --jq '.[] | select(.name=="Protect main") | .id' 2>/dev/null)
method=POST; path="repos/$REPO/rulesets"
[ -n "$existing" ] && { method=PUT; path="repos/$REPO/rulesets/$existing"; }
step "ruleset: protect the default branch" api -X "$method" "$path" --input - <<'JSON'
{
  "name": "Protect main",
  "target": "branch",
  "enforcement": "active",
  "conditions": { "ref_name": { "include": ["~DEFAULT_BRANCH"], "exclude": [] } },
  "rules": [
    { "type": "deletion" },
    { "type": "non_fast_forward" },
    { "type": "required_linear_history" },
    { "type": "pull_request", "parameters": {
        "required_approving_review_count": 0,
        "dismiss_stale_reviews_on_push": true,
        "require_code_owner_review": false,
        "require_last_push_approval": false,
        "required_review_thread_resolution": true,
        "allowed_merge_methods": ["squash"] } },
    { "type": "required_status_checks", "parameters": {
        "strict_required_status_checks_policy": false,
        "required_status_checks": [
          { "context": "CI / Lint, audit & build" },
          { "context": "Content guardrails" } ] } }
  ]
}
JSON

echo "$ok applied, $refused refused."
[ "$refused" -eq 0 ]
