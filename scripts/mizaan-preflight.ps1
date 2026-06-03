[CmdletBinding()]
param(
  [switch]$RequireClean
)

$ErrorActionPreference = 'Stop'
$repoRoot = Split-Path -Parent $PSScriptRoot
Set-Location -LiteralPath $repoRoot

$expectedRemote = 'https://github.com/mhyahya854/Mizaan-Revamp.git'
$requiredPaths = @(
  'package.json',
  'src',
  'docs/Plan/Mizaan_PRD.md',
  'docs/Plan/Mizaan_Product_Blueprint.md',
  'docs/Plan/Mizaan_A_to_Z_Plan.md',
  'docs/Plan/Mizaan Work Log.docx',
  'docs/Phases',
  'docs/screenshots'
)

$failures = New-Object System.Collections.Generic.List[string]
$warnings = New-Object System.Collections.Generic.List[string]

function Add-Failure {
  param([string]$Message)
  $script:failures.Add($Message)
  Write-Host "FAIL: $Message" -ForegroundColor Red
}

function Add-WarningLine {
  param([string]$Message)
  $script:warnings.Add($Message)
  Write-Host "WARN: $Message" -ForegroundColor Yellow
}

function Invoke-Git {
  param([string[]]$Arguments)
  $output = & git @Arguments
  if ($LASTEXITCODE -ne 0) {
    throw "git $($Arguments -join ' ') failed with exit code $LASTEXITCODE"
  }
  return $output
}

Write-Host "== Mizaan Preflight =="
Write-Host "Repo: $repoRoot"

$statusSb = Invoke-Git @('status', '-sb')
$branch = (Invoke-Git @('branch', '--show-current')).Trim()
$remote = (Invoke-Git @('remote', 'get-url', 'origin')).Trim()

Write-Host ""
Write-Host "Git status:"
$statusSb | ForEach-Object { Write-Host "  $_" }
Write-Host "Branch: $branch"
Write-Host "Origin: $remote"

if ($branch -ne 'main') {
  Add-Failure "Expected branch main, found $branch"
}

if ($remote -ne $expectedRemote) {
  Add-Failure "Expected origin $expectedRemote, found $remote"
}

Write-Host ""
Write-Host "Fetching origin..."
Invoke-Git @('fetch', 'origin', '--prune') | Out-Null

$parity = (Invoke-Git @('rev-list', '--left-right', '--count', 'main...origin/main')).Trim()
Write-Host "Parity main...origin/main: $parity"
if (($parity -ne '0 0') -and ($parity -ne "0`t0")) {
  Add-Failure "Expected parity 0 0, found $parity"
}

Write-Host ""
Write-Host "Required paths:"
foreach ($path in $requiredPaths) {
  if (Test-Path -LiteralPath (Join-Path $repoRoot $path)) {
    Write-Host "  OK   $path"
  } else {
    Add-Failure "Missing required path: $path"
  }
}

$shortStatus = @(Invoke-Git @('status', '--short'))
if ($shortStatus.Count -gt 0) {
  if ($RequireClean) {
    Add-Failure "Worktree has uncommitted changes and -RequireClean was supplied"
  } else {
    Add-WarningLine "Worktree has uncommitted changes. This is allowed for an in-progress phase."
    $shortStatus | ForEach-Object { Write-Host "  $_" }
  }
} else {
  Write-Host ""
  Write-Host "Worktree: clean"
}

Write-Host ""
if ($warnings.Count -gt 0) {
  Write-Host "Warnings: $($warnings.Count)"
}

if ($failures.Count -gt 0) {
  Write-Host "Preflight failed with $($failures.Count) failure(s)." -ForegroundColor Red
  exit 1
}

Write-Host "Preflight passed." -ForegroundColor Green
exit 0
