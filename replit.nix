{pkgs}: {
  deps = [
    pkgs.firebase-tools
    pkgs.nodePackages.prettier
    pkgs.imagemagick_light
    pkgs.python312Packages.open-interpreter
    pkgs.zulu
  ];
}
