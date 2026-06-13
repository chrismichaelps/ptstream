#!/usr/bin/env bash
#
# Verify that a packaged macOS .app has a valid (ad-hoc) code signature, the
# same way Gatekeeper does. Catches the "ptstream is damaged and can't be
# opened" class of failures BEFORE we ship a release.
#
# Usage: scripts/verify-macos-signature.sh [path/to/ptstream.app]
# Defaults to the arm64 package output if no path is given.

set -euo pipefail

APP="${1:-out/ptstream-darwin-arm64/ptstream.app}"

if [[ ! -d "$APP" ]]; then
  echo "❌ App not found: $APP"
  echo "   Run 'pnpm run package:mac' first."
  exit 1
fi

echo "🔎 Verifying: $APP"
echo

# 1) Signature must be present and structurally valid.
echo "── codesign --verify --deep --strict ──"
if codesign --verify --deep --strict --verbose=2 "$APP"; then
  echo "✅ Signature structurally valid"
else
  echo "❌ Signature invalid (this is what causes 'damaged')"
  exit 1
fi
echo

# 2) Info.plist must be sealed by the signature (the exact bug we hit:
#    'Info.plist not bound' / 'plist or signature have been modified').
echo "── Info.plist binding ──"
if codesign -dvv "$APP" 2>&1 | grep -q "Info.plist=not bound"; then
  echo "❌ Info.plist is NOT bound to the signature — bundle was modified after signing"
  exit 1
fi
echo "✅ Info.plist is bound"
echo

# 3) Show the assessment. For an UNNOTARIZED ad-hoc app, spctl will 'reject'
#    with "no usable signature" — that's expected and fine (users right-click >
#    Open). The hard failure we care about is an *invalid* signature, already
#    checked above. We only fail here on the 'damaged'/'modified' wording.
echo "── spctl assessment (informational for ad-hoc) ──"
SPCTL_OUT="$(spctl -a -vv "$APP" 2>&1 || true)"
echo "$SPCTL_OUT"
if echo "$SPCTL_OUT" | grep -qiE "invalid Info.plist|have been modified"; then
  echo "❌ Gatekeeper sees a modified/invalid bundle"
  exit 1
fi
echo

echo "✅ PASS — bundle is validly ad-hoc signed. Users open via right-click > Open."
