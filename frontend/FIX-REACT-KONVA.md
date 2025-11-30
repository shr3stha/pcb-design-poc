# Fixing react-konva Installation Issue

## Problem
`npm install` fails with:
```
npm error notarget No matching version found for react-konva@^18.2.15
```

## Solution

The version `^18.2.15` doesn't exist. Use one of these approaches:

### Option 1: Use Latest Version (Recommended)
```bash
cd frontend
npm install react-konva@latest
npm install
```

### Option 2: Use Specific Working Version
```bash
cd frontend
npm install react-konva@18.2.10
npm install
```

### Option 3: Remove Version Constraint
Edit `package.json` and change:
```json
"react-konva": "^18.2.15"
```
to:
```json
"react-konva": "*"
```
Then run:
```bash
npm install
```

### Option 4: Use Legacy Peer Deps
```bash
cd frontend
npm install --legacy-peer-deps
```

## Quick Fix Script

Run this in PowerShell:
```powershell
cd frontend
.\fix-install.ps1
```

Or manually:
```powershell
cd frontend
npm cache clean --force
npm install react-konva@latest
npm install
```

## Verify Installation

After fixing, verify:
```bash
npm list react-konva
```

You should see the installed version.

