let
  pkgs = import <nixpkgs> { };
  inherit (pkgs) lib;
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
  PLAYWRIGHT_HOST_PLATFORM_OVERRIDE = "nixos";

  shellHook =
    let
      playwrightPackage = x: "${x}@file:${playwright-test}/lib/node_modules/${x}";
      playwrightPackages = builtins.map playwrightPackage [
        "playwright"
        "playwright-core"
        "@playwright/test"
      ];
    in
    ''
      bun install --dev --no-save --exact \
        ${lib.concatStringsSep " " playwrightPackages}
      bun --version >.bun-version
      node --version >.node-version
    '';
}
