# Security

## Reporting a vulnerability

Please do not open a public issue for a security problem.

Use **[Report a vulnerability](../../security/advisories/new)** (GitHub's private reporting, under the repository's Security tab). Describe the problem, how to reproduce it and what an attacker could do. You should get a first answer within a week.

## Scope

The site is a static page: no accounts, no forms, no database, no server-side input. Things worth reporting:

- a way to inject script or content into the published page;
- a weakness in the response headers set in `next.config.mjs`;
- a vulnerable dependency that actually affects the built site;
- a workflow in `.github/workflows` that lets a pull request from a fork reach credentials, write to the repository, or run on infrastructure it should not;
- a credential or private detail committed to the repository.

A factual error in the story is not a security issue; open a correction issue instead.

## How the project protects itself

- Pull requests from forks build on GitHub-hosted runners with a read-only token and no secrets.
- Third-party actions are pinned to a commit.
- `main` accepts changes only through pull requests with passing checks, and only maintainers can merge them. Force pushes and branch deletion are blocked.
- Dependabot watches dependencies and workflow actions.
