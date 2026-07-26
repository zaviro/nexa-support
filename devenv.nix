{ pkgs, lib, config, ... }:
{
  env = {
    NEXT_TELEMETRY_DISABLED = "1";
    PLAYWRIGHT_BROWSERS_PATH = "${config.devenv.root}/.cache/ms-playwright";
  };

  # Keep secrets out of Nix store evaluation; the local .env remains app-owned.
  dotenv.disableHint = true;

  packages = [
    pkgs.actionlint
    pkgs.git
    pkgs.github-cli
    pkgs.ripgrep
  ];

  languages.javascript = {
    enable = true;
    package = pkgs.nodejs_24;
    nodejs.enable = true;
    corepack.enable = false;
    npm.enable = false;
    pnpm.enable = false;
    yarn.enable = false;
    bun = {
      enable = true;
      package = pkgs.bun;
      # Convenient in an interactive shell. Tests use the frozen install task below.
      install.enable = !config.devenv.isTesting;
    };
  };

  processes = lib.optionalAttrs (!config.devenv.isTesting) {
    web.exec = "bun run dev";
  };

  tasks = {
    "nexa:install".exec = "bun install --frozen-lockfile";

    "nexa:check" = {
      exec = "bun run check";
      after = [ "nexa:install" ];
    };

    "nexa:config:check" = {
      exec = ''
        bunx lefthook validate
        actionlint
      '';
      after = [ "nexa:install" ];
    };

    "nexa:typecheck" = {
      exec = "bun run typecheck";
      after = [ "nexa:install" ];
    };

    "nexa:test:unit" = {
      exec = "bun run test:unit";
      after = [ "nexa:install" ];
    };

    "nexa:build" = {
      exec = "bun run build";
      after = [ "nexa:typecheck" ];
    };

    "nexa:playwright:install" = {
      exec = ''
        if [ "''${CI:-}" = "true" ]; then
          bunx playwright install --with-deps chromium
        else
          bun run test:e2e:install
        fi
      '';
      after = [ "nexa:install" ];
    };

    "nexa:test:e2e" = {
      exec = "bun run test:e2e";
      after = [
        "nexa:build"
        "nexa:playwright:install"
      ];
    };

    "nexa:quality" = {
      exec = "echo 'Nexa Support quality gate passed.'";
      after = [
        "nexa:check"
        "nexa:config:check"
        "nexa:test:unit"
        "nexa:test:e2e"
      ];
    };

    "devenv:enterTest".after =
      lib.optionals config.devenv.isTesting [ "nexa:quality" ];
  };
}
