[CmdletBinding()]
param(
  [Parameter(Mandatory = $true)]
  [string]$PhaseName,

  [Parameter(Mandatory = $true)]
  [string]$PhaseReport,

  [Parameter(Mandatory = $true)]
  [string]$CommitMessage,

  [switch]$DryRun,
  [switch]$SkipValidation,
  [switch]$AllowDeleted
)

$ErrorActionPreference = 'Stop'
$repoRoot = Split-Path -Parent $PSScriptRoot
Set-Location -LiteralPath $repoRoot

function Invoke-Step {
  param(
    [string]$Name,
    [scriptblock]$Block
  )

  Write-Host ""
  Write-Host "== $Name =="
  & $Block
  if ($LASTEXITCODE -ne 0) {
    throw "$Name failed with exit code $LASTEXITCODE"
  }
}

Write-Host "== Mizaan Phase Closeout =="
Write-Host "Phase: $PhaseName"
Write-Host "Report: $PhaseReport"
Write-Host "Commit: $CommitMessage"
Write-Host "DryRun: $DryRun"

if (-not $SkipValidation) {
  Invoke-Step 'Full validation' { & powershell.exe -ExecutionPolicy Bypass -File (Join-Path $PSScriptRoot 'mizaan-verify-full.ps1') }
} else {
  Write-Host "Skipping validation because -SkipValidation was supplied." -ForegroundColor Yellow
}

$status = @(& git status --short)
if ($LASTEXITCODE -ne 0) {
  throw 'git status failed'
}

if ($status.Count -eq 0) {
  Write-Host "No changes to close out."
  exit 0
}

Write-Host ""
Write-Host "Worktree changes:"
$status | ForEach-Object { Write-Host "  $_" }

$deleted = @($status | Where-Object { $_ -match '^\s*D|^D' })
if (($deleted.Count -gt 0) -and (-not $AllowDeleted)) {
  Write-Host "Deleted paths detected. Re-run with -AllowDeleted only if those deletions are intentional." -ForegroundColor Red
  $deleted | ForEach-Object { Write-Host "  $_" }
  exit 1
}

if ($DryRun) {
  Write-Host ""
  Write-Host "Dry run complete. No files were staged, committed, or pushed."
  exit 0
}

Invoke-Step 'Stage changes' { & git add -A }

$cached = @(& git diff --cached --name-status)
if ($LASTEXITCODE -ne 0) {
  throw 'git diff --cached --name-status failed'
}

if ($cached.Count -eq 0) {
  Write-Host "No staged changes."
  exit 0
}

Write-Host ""
Write-Host "Staged changes:"
$cached | ForEach-Object { Write-Host "  $_" }

Invoke-Step 'Commit' { & git commit -m $CommitMessage }
Invoke-Step 'Push' { & git push }

$head = (& git rev-parse HEAD).Trim()
$parity = (& git rev-list --left-right --count main...origin/main).Trim()
$statusSb = @(& git status -sb)

Write-Host ""
Write-Host "Post-push HEAD: $head"
Write-Host "Post-push parity: $parity"
$statusSb | ForEach-Object { Write-Host $_ }

$reportPath = Join-Path $repoRoot $PhaseReport
if (Test-Path -LiteralPath $reportPath) {
  $now = Get-Date -Format 'yyyy-MM-dd HH:mm:ss zzz'
  Add-Content -LiteralPath $reportPath -Encoding UTF8 -Value @(
    '',
    '## Automated Closure Evidence',
    '',
    "- Phase: $PhaseName",
    "- Closure recorded: $now",
    "- Pushed HEAD: $head",
    "- Parity: $parity",
    "- Worktree:",
    '```',
    ($statusSb -join "`n"),
    '```'
  )

  & git add -- $PhaseReport
  if ($LASTEXITCODE -ne 0) {
    throw 'git add phase report failed'
  }

  & git diff --cached --quiet
  if ($LASTEXITCODE -eq 1) {
    Invoke-Step 'Commit closure evidence' { & git commit -m "Record $PhaseName closure evidence" }
    Invoke-Step 'Push closure evidence' { & git push }
    $head = (& git rev-parse HEAD).Trim()
    $parity = (& git rev-list --left-right --count main...origin/main).Trim()
    Write-Host "Closure evidence HEAD: $head"
    Write-Host "Closure evidence parity: $parity"
  }
}

if (($parity -ne '0 0') -and ($parity -ne "0`t0")) {
  Write-Host "Closeout completed but parity is not 0 0: $parity" -ForegroundColor Red
  exit 1
}

Write-Host "Closeout complete." -ForegroundColor Green
exit 0
