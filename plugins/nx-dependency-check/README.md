# nx-dependency-check
<a href="#badge">
    <img alt="semantic-release" src="https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg">
  </a>

![NPM Version](https://img.shields.io/npm/v/%40mikelgo%2Fnx-dependency-check)

A Nx plugin to maintain a healthy project by checking automatically outdated packages.

## Installation

```bash
  npm install @mikelgo/nx-dependency-check
```

## Usage

In your `project.json` you only need to define a new target:

```json
  "targets": {
    "check-deps": {
      "executor": "@mikelgo/nx-dependency-check:check-deps"
    }
}
```
That's it! The plugin itself comes with reasonable defaults:
* It will check all packages listed in your root `package.json` file
* It will use the `latest` tag to check for updates
* It will mark a package as outdated if a package is more than **one major** version behind latest

## Configuration
The `check-deps`-executor provides several configuration options. Here's an example
```json
  "targets": {
    "check-deps": {
      "executor": "@mikelgo/nx-dependency-check:check-deps",
      "options": {
        "dependenciesToCheck": ["@angular/core", "@angular/common", "rxjs", "xng-breadcrumb"],
        "versionOffset": {
        "major": 1
        },
        "versionOffsetOverrides": [{"packageName":  "xng-breadcrumb", "major": 1} ],
        "failOnVersionMismatch": false,
        "inputs": [
          "package.json"
        ],
        "cache": true
      }
    }
}
```
Let's go through the options:
* `dependenciesToCheck`: a array of package names which should be checked. Default is [*] which means that all packages are checked. If you only provide certain package names like in this example this means that only theses packages are checked.
* `versionOffset`: a object which defines the version offset. Default is `{major: 1}` which means that a package is marked as outdated if it is more than one major version behind latest.
* `versionOffsetOverrides`: A configuration where you can overrule the general `versionOffset` for certain packages. This is especially helpful if you have high-frequent packages or simply some packages which you can not update right now.
* `failOnVersionMismatch`: A boolean which defines if the build should fail if outdated packages are found. Default is `true`. Setting this option to `false` might be helpful if you do not want to make passing the deps-check as a hard criteria to pass your build. You wil anyway get a nice report.
* `inputs`: A list of files which are used to determine the packages to check. Default is `["package.json"]` which means that only the root `package.json` is used. You can also provide a list of files like `["package.json", "projects/**/package.json"]` to check all `package.json` files in your projects.
* `cache`: whether to use the nx cache or not. Default is `false`.
## Nx version compatibility
The plugin needs `@nx/devkit` version 16.1.0 or higher.
