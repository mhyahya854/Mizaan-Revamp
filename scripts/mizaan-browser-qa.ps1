[CmdletBinding()]
param(
  [int]$Port = 4199,
  [int]$StartupTimeoutSeconds = 45,
  [switch]$SkipScreenshots
)

$ErrorActionPreference = 'Stop'
$repoRoot = Split-Path -Parent $PSScriptRoot
Set-Location -LiteralPath $repoRoot

$timestamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$baseUrl = "http://127.0.0.1:$Port"
$logsDir = Join-Path $repoRoot 'docs/logs'
$screenshotsDir = Join-Path $repoRoot 'docs/screenshots'
New-Item -ItemType Directory -Force -Path $logsDir | Out-Null
New-Item -ItemType Directory -Force -Path $screenshotsDir | Out-Null

$routes = @(
  '/',
  '/settings',
  '/vault',
  '/import-export',
  '/repair',
  '/finance',
  '/people',
  '/projects',
  '/tasks',
  '/tasks?view=timeline',
  '/trackers',
  '/goals',
  '/graph',
  '/search',
  '/templates',
  '/calendar'
)

function Test-Http {
  param([string]$Url)
  try {
    $response = Invoke-WebRequest -UseBasicParsing -Uri $Url -TimeoutSec 15
    return [pscustomobject]@{
      ok = $true
      statusCode = [int]$response.StatusCode
      error = $null
    }
  } catch {
    $statusCode = $null
    if ($_.Exception.Response -and $_.Exception.Response.StatusCode) {
      $statusCode = [int]$_.Exception.Response.StatusCode
    }
    return [pscustomobject]@{
      ok = $false
      statusCode = $statusCode
      error = $_.Exception.Message
    }
  }
}

function Wait-ForServer {
  param([string]$Url, [int]$TimeoutSeconds)
  $deadline = (Get-Date).AddSeconds($TimeoutSeconds)
  do {
    $result = Test-Http $Url
    if ($result.ok) {
      return $true
    }
    Start-Sleep -Seconds 1
  } while ((Get-Date) -lt $deadline)
  return $false
}

function Find-Browser {
  $candidates = @(
    (Join-Path ${env:ProgramFiles} 'Google/Chrome/Application/chrome.exe'),
    (Join-Path ${env:ProgramFiles(x86)} 'Google/Chrome/Application/chrome.exe'),
    (Join-Path ${env:ProgramFiles} 'Microsoft/Edge/Application/msedge.exe'),
    (Join-Path ${env:ProgramFiles(x86)} 'Microsoft/Edge/Application/msedge.exe')
  )

  foreach ($candidate in $candidates) {
    if ($candidate -and (Test-Path -LiteralPath $candidate)) {
      return $candidate
    }
  }

  foreach ($name in @('chrome.exe', 'msedge.exe')) {
    $command = Get-Command $name -ErrorAction SilentlyContinue
    if ($command) {
      return $command.Source
    }
  }

  return $null
}

function Get-RouteSlug {
  param([string]$Route)
  if ($Route -eq '/') {
    return 'home'
  }
  return ($Route.Trim('/') -replace '[^a-zA-Z0-9-]', '-')
}

function Stop-OwnedDevServer {
  param([int]$ServerPort)

  $connections = Get-NetTCPConnection -LocalPort $ServerPort -State Listen -ErrorAction SilentlyContinue
  foreach ($connection in $connections) {
    $processInfo = Get-CimInstance Win32_Process -Filter "ProcessId=$($connection.OwningProcess)" -ErrorAction SilentlyContinue
    if (
      $processInfo -and
      $processInfo.CommandLine -and
      $processInfo.CommandLine.Contains($repoRoot) -and
      ($processInfo.CommandLine -match 'vite') -and
      ($processInfo.CommandLine -match "--port\s+$ServerPort")
    ) {
      Stop-Process -Id $connection.OwningProcess -Force
      Write-Host "Stopped dev server child process $($connection.OwningProcess)."
    }
  }
}

Write-Host "== Mizaan Browser QA =="
Write-Host "Base URL: $baseUrl"

$serverOut = Join-Path $logsDir "browser-qa-dev-$timestamp.out.log"
$serverErr = Join-Path $logsDir "browser-qa-dev-$timestamp.err.log"
$serverProcess = $null
$startedServer = $false
$serverMode = 'existing'

$initial = Test-Http $baseUrl
if (-not $initial.ok) {
  Write-Host "No existing server detected at $baseUrl. Starting npm dev..."
  $serverMode = 'dev'
  $serverProcess = Start-Process -FilePath 'npm.cmd' -ArgumentList @('run', 'dev', '--', '--host', '127.0.0.1', '--port', "$Port") -WorkingDirectory $repoRoot -PassThru -WindowStyle Hidden -RedirectStandardOutput $serverOut -RedirectStandardError $serverErr
  $startedServer = $true

  if (-not (Wait-ForServer $baseUrl $StartupTimeoutSeconds)) {
    if ($serverProcess -and -not $serverProcess.HasExited) {
      Stop-Process -Id $serverProcess.Id -Force
    }
    throw "Dev server did not become ready within $StartupTimeoutSeconds seconds. See $serverOut and $serverErr."
  }
} else {
  Write-Host "Using existing server at $baseUrl."
}

$routeResults = New-Object System.Collections.Generic.List[object]
$screenshots = New-Object System.Collections.Generic.List[object]
$limitations = New-Object System.Collections.Generic.List[string]

try {
  Write-Host ""
  Write-Host "== Route Checks =="
  foreach ($route in $routes) {
    $url = "$baseUrl$route"
    $result = Test-Http $url
    $routeResult = [pscustomobject]@{
      route = $route
      url = $url
      ok = $result.ok
      statusCode = $result.statusCode
      error = $result.error
    }
    $routeResults.Add($routeResult)
    if ($result.ok) {
      Write-Host "OK   $route $($result.statusCode)"
    } else {
      Write-Host "FAIL $route $($result.statusCode) $($result.error)" -ForegroundColor Red
    }
  }

  if ($SkipScreenshots) {
    $limitations.Add('Screenshot capture skipped by -SkipScreenshots.')
  } else {
    $browser = Find-Browser
    if (-not $browser) {
      $limitations.Add('Chrome or Edge headless executable was not found; screenshots were not captured.')
    } else {
      Write-Host ""
      Write-Host "== Screenshots =="
      $profileDir = Join-Path $env:TEMP "mizaan-browser-qa-profile-$timestamp"
      New-Item -ItemType Directory -Force -Path $profileDir | Out-Null

      foreach ($route in $routes) {
        $slug = Get-RouteSlug $route
        $screenshotPath = Join-Path $screenshotsDir "$timestamp-browser-qa-$slug.png"
        $url = "$baseUrl$route"
        $arguments = @(
          '--headless=new',
          '--disable-gpu',
          '--hide-scrollbars',
          "--user-data-dir=$profileDir",
          '--window-size=1440,1100',
          "--screenshot=$screenshotPath",
          $url
        )
        $process = Start-Process -FilePath $browser -ArgumentList $arguments -Wait -PassThru -WindowStyle Hidden
        if (($process.ExitCode -eq 0) -and (Test-Path -LiteralPath $screenshotPath)) {
          $screenshots.Add([pscustomobject]@{ route = $route; path = $screenshotPath })
          Write-Host "OK   $route -> $screenshotPath"
        } else {
          $limitations.Add("Screenshot failed for $route with exit code $($process.ExitCode).")
          Write-Host "WARN screenshot failed for $route" -ForegroundColor Yellow
        }
      }
    }
  }
} finally {
  if ($startedServer -and $serverProcess -and -not $serverProcess.HasExited) {
    Stop-Process -Id $serverProcess.Id -Force
    Write-Host ""
    Write-Host "Stopped server parent process $($serverProcess.Id)."
  }
  if ($startedServer) {
    Stop-OwnedDevServer $Port
  }
}

$failedRoutes = @($routeResults | Where-Object { -not $_.ok })
if ($limitations.Count -eq 0) {
  $limitations.Add('None recorded by script.')
}

$summary = [pscustomobject]@{
  timestamp = $timestamp
  baseUrl = $baseUrl
  serverMode = $serverMode
  routeResults = $routeResults
  screenshots = $screenshots
  consoleCapture = 'Not available in HTTP plus headless screenshot mode.'
  limitations = $limitations
  passed = ($failedRoutes.Count -eq 0)
}

$jsonPath = Join-Path $logsDir "browser-qa-$timestamp.json"
$mdPath = Join-Path $logsDir "browser-qa-$timestamp.md"
$summary | ConvertTo-Json -Depth 6 | Set-Content -LiteralPath $jsonPath -Encoding UTF8

$md = New-Object System.Collections.Generic.List[string]
$md.Add("# Browser QA $timestamp")
$md.Add("")
$md.Add("- Base URL: $baseUrl")
$md.Add("- Server mode: $serverMode")
$md.Add("- Console capture: not available in HTTP plus headless screenshot mode.")
$md.Add("")
$md.Add("## Routes")
foreach ($result in $routeResults) {
  $status = if ($result.ok) { 'PASS' } else { 'FAIL' }
  $md.Add("- $status $($result.route) $($result.statusCode) $($result.error)")
}
$md.Add("")
$md.Add("## Screenshots")
if ($screenshots.Count -eq 0) {
  $md.Add("- None captured.")
} else {
  foreach ($shot in $screenshots) {
    $md.Add("- $($shot.route): $($shot.path)")
  }
}
$md.Add("")
$md.Add("## Limitations")
foreach ($limitation in $limitations) {
  $md.Add("- $limitation")
}
$md | Set-Content -LiteralPath $mdPath -Encoding UTF8

Write-Host ""
Write-Host "Browser QA log: $mdPath"
Write-Host "Browser QA JSON: $jsonPath"

if ($failedRoutes.Count -gt 0) {
  Write-Host "Browser QA failed route checks: $($failedRoutes.Count)" -ForegroundColor Red
  exit 1
}

Write-Host "Browser QA route checks passed." -ForegroundColor Green
exit 0
