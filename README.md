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
- [Installation](#installation)
- [Instructions](#instructions)
  - [Info](#info)
- [Environment variables](#environment-variables)

# Installation

Download and run the executable from the [Releases](https://github.com/appveen/datastack-backup-restore/releases) page.

# Instructions

* `-b, --backupfile <backup JSON file>` is a required option while restoring the data.
* You can use `-b` during backup and restore.
  * While backing up the backup file specified will be used to write the backup data.
  * While restoring the backup configuration would be read from the file specified.
## Info

* Backup customization is only supported in the interactive mode. Run `ds-backup-restore` without any *commands* to enter into interactove mode.
* Environment variables take priority over command line options.

# Environment variables

> Environment variables takes priority over command line options/parameters.

| Variable | Description |
|---|---|
| DS_BR_HOST | data.stack server to connect. e.g. `https://cloud.appveen.com`.|
| DS_BR_USERNAME | data.stack username. |
| DS_BR_PASSWORD | data.stack password. |
| DS_BR_SINGLELOGFILE | `true/false`. If enabled, then backup, restore, and logs will use `backup.json`, `restore.json` and `out.log` as the files to write to.|
| LOGLEVEL | Logging level to set. |
| NODE_TLS_REJECT_UNAUTHORIZED | `0/1`. Setting the NODE_TLS_REJECT_UNAUTHORIZED environment variable to '0' makes TLS connections and HTTPS requests insecure by disabling certificate verification.  |
