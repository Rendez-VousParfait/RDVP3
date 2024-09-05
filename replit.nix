{pkgs}: {
  deps = [
    (pkgs.nodePackages.firebase-tools.override { version = "13.16.0"; })    pkgs.nodePackages.prettier
    pkgs.imagemagick_light
    pkgs.python312Packages.open-interpreter
    pkgs.zulu
  ];
}
