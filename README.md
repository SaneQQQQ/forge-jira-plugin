# GitHub Integration for Jira (Forge App)

A Jira Forge app that connects GitHub and Jira to streamline development workflows.
* Admin Page: Configure GitHub Personal Access Tokens (PATs).
* Issue Context: View related GitHub repositories and pull requests directly in Jira. Supports PR actions (approve, merge) and automatically transitions Jira issues to “Done” on merge.
* Features:
  * Repo filtering (public/private).
  * PR discovery by Jira issue key in title/branch.
  * Inline PR details (status, reviewers, actions).
  * Automatic issue state transitions.
  * i18n with automated translation pipeline.
  * Send app feedback via Amazon SES.

## Requirements

See [Set up Forge](https://developer.atlassian.com/platform/forge/set-up-forge/) for instructions to get set up.

## Quick start

- Set Forge environment variables for a feedback service:
```
forge variables set --encrypt AWS_ACCESS_KEY_ID [yourAccessKey]
forge variables set --encrypt AWS_SECRET_ACCESS_KEY [yourSecretKey]
forge variables set --encrypt AWS_REGION [yourRegion]
forge variables set --encrypt AWS_VERIFIED_SOURCE_EMAIL [your-verified-email@example.com]
forge variables set --encrypt AWS_DESTINATION_FEEDBACK_EMAIL [your-destination-email@example.com]
```

- Build and deploy your app by running:
```
forge deploy
```

- Install your app in an Atlassian site by running:
```
forge install
```

- Develop your app by running `forge tunnel` to proxy invocations locally:
```
forge tunnel
```

### Translations
- When adding a new string to the UI, use **i18n** from the `@forge/react` package:
```
const {t} = useTranslation();

<Text>{t('i18n.key')}</Text>
```
- Update the default translation file: `/locales/default/en-US.json`
- When you create a pull request, the i18n automation pipeline will automatically add a new commit to your PR with updates for all translation files.
### Notes
- Use the `forge deploy` command when you want to persist code changes.
- Use the `forge install` command when you want to install the app on a new site.
- Once the app is installed on a site, the site picks up the new app changes you deploy without needing to rerun the install command.

