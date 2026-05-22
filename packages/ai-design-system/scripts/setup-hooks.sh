#!/bin/bash
#
# Git Hooks Setup Script
#
# This script sets up the pre-commit hook for the ui-lib package by symlinking
# the tracked hook from scripts/hooks/ to .git/hooks/
#
# Usage: ./scripts/setup-hooks.sh
#

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get the repository root directory
REPO_ROOT=$(git rev-parse --show-toplevel 2>/dev/null)

if [ -z "$REPO_ROOT" ]; then
    echo -e "${RED}Error: Not in a git repository${NC}"
    exit 1
fi

# Define paths
HOOKS_SOURCE_DIR="$REPO_ROOT/packages/ui-lib/scripts/hooks"
HOOKS_TARGET_DIR="$REPO_ROOT/.git/hooks"
PRE_COMMIT_SOURCE="$HOOKS_SOURCE_DIR/pre-commit"
PRE_COMMIT_TARGET="$HOOKS_TARGET_DIR/pre-commit"

echo "🔧 Setting up git hooks for ui-lib..."
echo ""

# Check if source hook exists
if [ ! -f "$PRE_COMMIT_SOURCE" ]; then
    echo -e "${RED}Error: Source pre-commit hook not found at:${NC}"
    echo "  $PRE_COMMIT_SOURCE"
    exit 1
fi

# Check if target directory exists
if [ ! -d "$HOOKS_TARGET_DIR" ]; then
    echo -e "${RED}Error: .git/hooks directory not found at:${NC}"
    echo "  $HOOKS_TARGET_DIR"
    exit 1
fi

# Backup existing hook if it exists and is not a symlink
if [ -f "$PRE_COMMIT_TARGET" ] && [ ! -L "$PRE_COMMIT_TARGET" ]; then
    BACKUP_FILE="$PRE_COMMIT_TARGET.backup.$(date +%Y%m%d%H%M%S)"
    echo -e "${YELLOW}⚠️  Existing pre-commit hook found${NC}"
    echo "   Creating backup: $BACKUP_FILE"
    mv "$PRE_COMMIT_TARGET" "$BACKUP_FILE"
fi

# Remove existing symlink if it exists
if [ -L "$PRE_COMMIT_TARGET" ]; then
    echo "Removing existing symlink..."
    rm "$PRE_COMMIT_TARGET"
fi

# Create symlink
echo "Creating symlink from:"
echo "  $PRE_COMMIT_SOURCE"
echo "to:"
echo "  $PRE_COMMIT_TARGET"
ln -s "$PRE_COMMIT_SOURCE" "$PRE_COMMIT_TARGET"

# Make the source hook executable
chmod +x "$PRE_COMMIT_SOURCE"

echo ""
echo -e "${GREEN}✅ Git hooks setup complete!${NC}"
echo ""
echo "The pre-commit hook will run all design system validations on every commit."
echo ""
echo "To bypass these checks (NOT RECOMMENDED):"
echo "  git commit --no-verify"
echo ""
