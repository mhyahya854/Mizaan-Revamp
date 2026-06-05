[CmdletBinding()]
param(
  [Parameter(ValueFromRemainingArguments = $true)]
  [string[]]$TargetTests
)

$ErrorActionPreference = 'Stop'
$repoRoot = Split-Path -Parent $PSScriptRoot
Set-Location -LiteralPath $repoRoot

$logRoot = Join-Path $repoRoot '.tmp-codex\vitest-serial'
New-Item -ItemType Directory -Force -Path $logRoot | Out-Null

$npx = if ([System.Environment]::OSVersion.Platform -eq 'Win32NT') { 'npx.cmd' } else { 'npx' }
$testFiles = if ($TargetTests.Count -gt 0) {
  foreach ($target in $TargetTests) {
    $resolved = Resolve-Path -LiteralPath $target -ErrorAction SilentlyContinue
    if ($resolved) {
      Get-Item -LiteralPath $resolved.Path
    } else {
      Write-Host "Target test file not found: $target" -ForegroundColor Red
      exit 1
    }
  }
} else {
  Get-ChildItem -LiteralPath (Join-Path $repoRoot 'src') -Recurse -File |
    Where-Object { $_.Name -match '\.test\.(ts|tsx)$' } |
    Sort-Object FullName
}

if ($testFiles.Count -eq 0) {
  Write-Host 'No Vitest test files found.' -ForegroundColor Red
  exit 1
}

function Convert-ToSafeLogName {
  param([string]$RelativePath)
  return ($RelativePath -replace '[:\\/]', '__')
}

function Get-RepoRelativePath {
  param([string]$FullPath)
  $prefix = $repoRoot.TrimEnd('\') + '\'
  if ($FullPath.StartsWith($prefix, [System.StringComparison]::OrdinalIgnoreCase)) {
    return $FullPath.Substring($prefix.Length).Replace('\', '/')
  }
  return $FullPath.Replace('\', '/')
}

$passed = 0
$failed = 0
$MaxRetries = 3
$retryPhrases = @(
  'Timeout waiting for worker to respond',
  'Timeout starting',
  'Failed to start threads worker',
  'Failed to start forks worker'
)

foreach ($file in $testFiles) {
  $relative = Get-RepoRelativePath $file.FullName
  $safeName = Convert-ToSafeLogName $relative
  $attempt = 1
  $completed = $false

  while (-not $completed -and $attempt -le $MaxRetries) {
    Write-Host ""
    Write-Host "== Vitest: $relative (attempt $attempt/$MaxRetries) =="
    $logPath = Join-Path $logRoot "$safeName.attempt-$attempt.log"
    & $npx vitest run $relative --reporter=dot 2>&1 | Tee-Object -FilePath $logPath
    $exitCode = $LASTEXITCODE

    if ($exitCode -eq 0) {
      $passed += 1
      $completed = $true
      continue
    }

    $logText = Get-Content -LiteralPath $logPath -Raw
    $isWorkerStartupTimeout = $false
    foreach ($phrase in $retryPhrases) {
      if ($logText.Contains($phrase)) {
        $isWorkerStartupTimeout = $true
        break
      }
    }

    if ($isWorkerStartupTimeout -and $attempt -lt $MaxRetries) {
      Write-Host "Worker startup timeout detected; retrying $relative." -ForegroundColor Yellow
      Start-Sleep -Seconds 5
      $attempt += 1
      continue
    }

    $failed += 1
    Write-Host "Vitest failed for $relative. Last log: $logPath" -ForegroundColor Red
    exit $exitCode
  }
}

Write-Host ""
Write-Host "Vitest serial summary: $passed passed, $failed failed."
exit 0
