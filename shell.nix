let
  pkgs = import <nixpkgs> { };
in
with pkgs;
mkShell {
  packages = [
    bun
    deno
    nodejs
    act
    nil
    nixfmt-rfc-style
    shellcheck
    shfmt
  ];

  PLAYWRIGHT_BROWSERS_PATH = playwright-driver.browsers;
  PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS = true;

  shellHook = ''
    bun --version >.bun-version
    node --version >.node-version
  '';
}
