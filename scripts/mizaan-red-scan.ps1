[CmdletBinding()]
param(
  [switch]$Fast
)

$ErrorActionPreference = 'Stop'
$repoRoot = Split-Path -Parent $PSScriptRoot
Set-Location -LiteralPath $repoRoot

$failures = New-Object System.Collections.Generic.List[string]

function Require-Rg {
  $rg = Get-Command rg -ErrorAction SilentlyContinue
  if (-not $rg) {
    $git = Get-Command git -ErrorAction SilentlyContinue
    if (-not $git) {
      throw "Either ripgrep (rg) or git is required for Mizaan red scans."
    }
  }
}

function Invoke-RgScan {
  param(
    [string]$Pattern,
    [string[]]$Paths
  )

  $rg = Get-Command rg -ErrorAction SilentlyContinue
  if ($rg) {
    $output = & rg -n $Pattern @Paths 2>$null
    $code = $LASTEXITCODE
    if ($code -eq 1) {
      return @()
    }
    if ($code -ne 0) {
      throw "rg scan failed for pattern: $Pattern"
    }
    return @($output)
  } else {
    $output = & git grep -n --no-index -E $Pattern -- @Paths 2>$null
    $code = $LASTEXITCODE
    if ($code -eq 1) {
      return @()
    }
    if ($code -ne 0) {
      throw "git grep scan failed for pattern: $Pattern"
    }
    return @($output)
  }
}

function Write-Section {
  param(
    [string]$Title,
    [object[]]$Lines,
    [int]$Limit = 40
  )

  Write-Host ""
  Write-Host "== $Title =="
  if ($Lines.Count -eq 0) {
    Write-Host "No matches."
    return
  }

  Write-Host "$($Lines.Count) match(es). Showing first ${Limit}:"
  $Lines | Select-Object -First $Limit | ForEach-Object { Write-Host $_ }
  if ($Lines.Count -gt $Limit) {
    Write-Host "... $($Lines.Count - $Limit) additional match(es) omitted."
  }
}

function Add-Failure {
  param([string]$Message)
  $script:failures.Add($Message)
  Write-Host "FAIL: $Message" -ForegroundColor Red
}

Require-Rg

Write-Host "== Mizaan Red-Flag Scan =="
Write-Host "Mode: $(if ($Fast) { 'fast' } else { 'full' })"

$localStorage = Invoke-RgScan 'localStorage' @('src')
Write-Section 'localStorage in src (allowed only for browser prototype/provider/session contexts)' $localStorage

$consoleDebug = Invoke-RgScan 'console\.log|\bdebugger\b' @('src')
Write-Section 'console.log/debugger in src (blocking)' $consoleDebug
if ($consoleDebug.Count -gt 0) {
  Add-Failure "src contains console.log or debugger"
}

$fakeReadinessSrc = Invoke-RgScan 'portable vault ready|SQLite ready|Tauri ready|folder picker ready|USB vault ready|native backup ready|SQLite backup ready' @('src')
Write-Section 'fake native/storage readiness in src (blocking)' $fakeReadinessSrc
if ($fakeReadinessSrc.Count -gt 0) {
  Add-Failure "src contains fake native/storage readiness language"
}

$runtimeUrls = Invoke-RgScan 'https://|http://|fonts\.googleapis|fonts\.gstatic' @('src')
Write-Section 'runtime URLs/fonts in src (review)' $runtimeUrls
if ($runtimeUrls.Count -gt 0) {
  Add-Failure "src contains runtime URL or external font references"
}

if (-not $Fast) {
  $cloudAuth = Invoke-RgScan 'Google|Drive|OAuth|Firebase|Supabase|Clerk|auth|cloud|bank|Plaid|Stripe|PayPal|Wise' @('src', 'docs')
  Write-Section 'cloud/auth/bank/payment language in src/docs (docs may be allowed as product-law references)' $cloudAuth

  $fakeReadinessAll = Invoke-RgScan 'portable vault ready|SQLite ready|Tauri ready|folder picker ready|USB vault ready|native backup ready|SQLite backup ready' @('src', 'docs')
  Write-Section 'fake readiness language in src/docs (docs must be future/not-implemented only)' $fakeReadinessAll

  $privacy = Invoke-RgScan 'encrypted|encryption|private|privacy|lock' @('src', 'docs')
  Write-Section 'privacy/encryption/app-lock language in src/docs (honesty review)' $privacy

  $importExport = Invoke-RgScan 'export|import|backup|restore|archive|snapshot|manifest|migration|schema|version|repair|recovery' @('src', 'docs')
  Write-Section 'import/export/backup/restore language in src/docs (truthfulness review)' $importExport
}

Write-Host ""
if ($failures.Count -gt 0) {
  Write-Host "Red scan failed with $($failures.Count) blocking issue(s)." -ForegroundColor Red
  exit 1
}

Write-Host "Red scan passed blocking checks." -ForegroundColor Green
exit 0
