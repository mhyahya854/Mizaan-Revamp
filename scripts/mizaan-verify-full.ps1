[CmdletBinding()]
param()

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

Write-Host "== Mizaan Full Verify =="

Invoke-Step 'Typecheck' 'npm.cmd' @('run', 'typecheck')
Invoke-Step 'Lint' 'npm.cmd' @('run', 'lint')
Invoke-Step 'Tests' 'npm.cmd' @('test')
Invoke-Step 'Build' 'npm.cmd' @('run', 'build')
Invoke-Step 'Git diff check' 'git' @('diff', '--check')
Invoke-Step 'Full red scan' 'powershell.exe' @('-ExecutionPolicy', 'Bypass', '-File', (Join-Path $PSScriptRoot 'mizaan-red-scan.ps1'))

Write-Host ""
Write-Host "Full verify passed." -ForegroundColor Green
exit 0
