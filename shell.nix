{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  buildInputs = with pkgs; [
    nodejs_24
  ];

  shellHook = ''
    echo "🏋️  Workout Planner Development Environment"
    echo "Node.js version: $(node --version)"
    echo "npm version: $(npm --version)"
    echo ""
  '';
}
