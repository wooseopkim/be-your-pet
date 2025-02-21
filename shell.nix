let
  pkgs = import <nixpkgs> { };
in
with pkgs;
mkShell {
  packages = [
    bun
    deno
    playwright-driver.browsers
    nil
    nixfmt-rfc-style
    shellcheck
    shfmt
  ];

  PLAYWRIGHT_BROWSERS_PATH = playwright-driver.browsers;
  PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS = true;
}
