#!/bin/bash
unset GIT_ASKPASS
unset SSH_ASKPASS
git config --global --unset credential.helper 2>/dev/null
git push https://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@github.com/murtajizdev-spec/Dynamic-Portfolio.git main
