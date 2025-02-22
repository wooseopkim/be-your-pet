#!/bin/bash
set -euo pipefail

find . \
    -type f \
    -regextype posix-egrep \
    -regex '(^|.+/)playwright\.config\.[cm]?[jt]s' \
    -exec bash -c '
        bun run - <<<"
            import config from \"$1\";
            const browsers = config.projects?.map((x) => x.use?.defaultBrowserType);
            for (const browser of browsers) {
                console.log(browser);
            }
        "
    ' -- {} \;
