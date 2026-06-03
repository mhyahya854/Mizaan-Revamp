[CmdletBinding()]
param(
  [Parameter(ValueFromRemainingArguments = $true)]
  [string[]]$TargetTests
)

$ErrorActionPreference = 'Stop'
$repoRoot = Split-Path -Parent $PSScriptRoot
Set-Location -LiteralPath $repoRoot

function Invoke-Step {
  param(
    [string]$Name,
    [string]$Command,
    [string[]]$Arguments
  )

  Write-Host ""
  Write-Host "== $Name =="
  & $Command @Arguments
  if ($LASTEXITCODE -ne 0) {
    Write-Host "$Name failed with exit code $LASTEXITCODE" -ForegroundColor Red
    exit $LASTEXITCODE
  }
}

Write-Host "== Mizaan Fast Verify =="

Invoke-Step 'Typecheck' 'npm.cmd' @('run', 'typecheck')

if ($TargetTests.Count -gt 0) {
  Invoke-Step 'Targeted tests' 'npm.cmd' (@('test', '--') + $TargetTests)
} else {
  Write-Host ""
  Write-Host "== Targeted tests =="
  Write-Host "No targeted test arguments supplied."
}

Invoke-Step 'Fast red scan' 'powershell.exe' @('-ExecutionPolicy', 'Bypass', '-File', (Join-Path $PSScriptRoot 'mizaan-red-scan.ps1'), '-Fast')

Write-Host ""
Write-Host "Fast verify passed." -ForegroundColor Green
exit 0
