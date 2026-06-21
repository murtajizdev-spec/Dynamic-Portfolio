#!/bin/bash
echo "Enter your GitHub Personal Access Token (ghp_...):"
read -s TOKEN
GIT_ASKPASS="" git push https://$TOKEN@github.com/murtajizdev-spec/Dynamic-Portfolio.git main
