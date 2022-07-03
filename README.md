# datastack-backup-restore
Utility to backup and restore data.stack

```sh
Usage: ds-backup-restore [options] [command]

CLI utility to backup and restore data.stack configurations.

Options:
  -V, --version                        output the version number
  -h, --host <URL>                     data.stack server to connect.
  -u, --username <username>            data.stack username.
  -p, --password <password>            data.stack password.
  -b, --backupfile <backup JSON file>  Custom backup file to use during backup or restore
  --help                               display help for command

Commands:
  backup                               backup configuration.
  restore                              Restore configuration.
  clear                                Clear all configuration.
```

# Table of contents
- [datastack-backup-restore](#datastack-backup-restore)
- [Table of contents](#table-of-contents)
- [Info](#info)
- [Installation](#installation)
- [Environment variables](#environment-variables)

# Info

* Backup customization is only supported in the interactove mode.
* Environment variables take priority over command line values.
* 

# Installation

Download and run the executable from the Releases page.

# Environment variables

> Environment variables takes priority over CLI params.

| Variable | Description |
|---|---|
| DS_BR_HOST | data.stack server to connect. e.g. `https://cloud.appveen.com`.|
| DS_BR_USERNAME | data.stack username. |
| DS_BR_PASSWORD | data.stack password. |
| DS_BR_SINGLELOGFILE | `true/false`. If enabled, then backup, restore, and logs will use `backup.json`, `restore.json` and `out.log` as the files to write to.|
| LOGLEVEL | Logging level to set. |
