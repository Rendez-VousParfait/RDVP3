{pkgs}: {
  deps = [
    pkgs.nano
    pkgs.openssh
    pkgs.nodePackages.firebase-tools
    pkgs.nodePackages.prettier
    pkgs.imagemagick_light
    pkgs.python312Packages.open-interpreter
    pkgs.zulu
  ];
}
