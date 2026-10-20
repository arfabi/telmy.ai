# ==============================================================================
# Telmy.ai: Dual Browser Extension Packaging Script (PowerShell)
# Builds:
#   1. telmy-chrome-edge.zip  -> For Google Chrome, Microsoft Edge, Brave, Opera
#   2. telmy-firefox.zip      -> For Mozilla Firefox (Gecko MV3)
# ==============================================================================

$ErrorActionPreference = "Stop"

$projectRoot = $PSScriptRoot
if (-not $projectRoot) {
    $projectRoot = (Get-Item .).FullName
}

$extSource = Join-Path $projectRoot "extension"
$distDir   = Join-Path $projectRoot "dist-extensions"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " [Telmy.ai] Building Packages: Chrome/Edge and Firefox" -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "Source directory: $extSource" -ForegroundColor Gray

if (-not (Test-Path $extSource)) {
    Write-Error "Error: Source folder '$extSource' not found!"
    exit 1
}

# Ensure output directory exists
if (-not (Test-Path $distDir)) {
    New-Item -ItemType Directory -Path $distDir -Force | Out-Null
}

$chromeZip  = Join-Path $distDir "telmy-chrome-edge.zip"
$firefoxZip = Join-Path $distDir "telmy-firefox.zip"

# Temporary staging directory in system TEMP
$tempBuild = Join-Path ([System.IO.Path]::GetTempPath()) ("telmy_build_" + [System.Guid]::NewGuid().ToString("N"))
$stageChrome  = Join-Path $tempBuild "chrome"
$stageFirefox = Join-Path $tempBuild "firefox"

try {
    # Clean old zips if existing
    if (Test-Path $chromeZip)  { Remove-Item $chromeZip -Force }
    if (Test-Path $firefoxZip) { Remove-Item $firefoxZip -Force }

    New-Item -ItemType Directory -Path $stageChrome -Force | Out-Null
    New-Item -ItemType Directory -Path $stageFirefox -Force | Out-Null

    Write-Host "`n[1/2] Packaging for Chrome and Microsoft Edge..." -ForegroundColor Green
    # Copy all items except manifest.firefox.json
    Get-ChildItem -Path $extSource | Where-Object { $_.Name -ne "manifest.firefox.json" } | ForEach-Object {
        Copy-Item -Path $_.FullName -Destination $stageChrome -Recurse -Force
    }
    
    # Compress Chrome package
    Compress-Archive -Path "$stageChrome\*" -DestinationPath $chromeZip -Force
    $chromeSize = [math]::Round(((Get-Item $chromeZip).Length / 1MB), 2)
    Write-Host "  -> Successfully generated: $chromeZip ($chromeSize MB)" -ForegroundColor Gray

    Write-Host "`n[2/2] Packaging for Mozilla Firefox..." -ForegroundColor Green
    # Copy all items except manifest.json & manifest.firefox.json
    Get-ChildItem -Path $extSource | Where-Object { $_.Name -ne "manifest.json" -and $_.Name -ne "manifest.firefox.json" } | ForEach-Object {
        Copy-Item -Path $_.FullName -Destination $stageFirefox -Recurse -Force
    }
    
    # Place manifest.firefox.json as manifest.json inside Firefox package
    $ffManifestSource = Join-Path $extSource "manifest.firefox.json"
    if (-not (Test-Path $ffManifestSource)) {
        Write-Error "manifest.firefox.json not found in $extSource!"
        exit 1
    }
    Copy-Item -Path $ffManifestSource -Destination (Join-Path $stageFirefox "manifest.json") -Force

    # Compress Firefox package
    Compress-Archive -Path "$stageFirefox\*" -DestinationPath $firefoxZip -Force
    $firefoxSize = [math]::Round(((Get-Item $firefoxZip).Length / 1MB), 2)
    Write-Host "  -> Successfully generated: $firefoxZip ($firefoxSize MB)" -ForegroundColor Gray

    # Synchronize to dist-extensions/telmy.zip and frontend public/dist directories
    $aliasTelmyZip = Join-Path $distDir "telmy.zip"
    Copy-Item -Path $chromeZip -Destination $aliasTelmyZip -Force

    $frontPublic = Join-Path $projectRoot "frontend\public"
    $frontDist   = Join-Path $projectRoot "frontend\dist"

    foreach ($targetDir in @($frontPublic, $frontDist)) {
        if (Test-Path $targetDir) {
            Copy-Item -Path $chromeZip  -Destination (Join-Path $targetDir "telmy.zip") -Force
            Copy-Item -Path $chromeZip  -Destination (Join-Path $targetDir "telmy-extension.zip") -Force
            Copy-Item -Path $firefoxZip -Destination (Join-Path $targetDir "telmy-firefox.zip") -Force
        }
    }

    Write-Host "`n==========================================================" -ForegroundColor Cyan
    Write-Host " [SUCCESS] ZIP packages generated and synchronized:" -ForegroundColor Green
    Write-Host "==========================================================" -ForegroundColor Cyan
    Write-Host "  1. Chrome / Edge / Brave: $chromeZip ($chromeSize MB)" -ForegroundColor White
    Write-Host "     -> Alias: $aliasTelmyZip & frontend/public/telmy.zip" -ForegroundColor Gray
    Write-Host "  2. Mozilla Firefox:      $firefoxZip ($firefoxSize MB)" -ForegroundColor White
    Write-Host "`nInstallation Tips:" -ForegroundColor Yellow
    Write-Host "  - Chrome:  chrome://extensions/ -> Developer mode -> Load unpacked" -ForegroundColor Gray
    Write-Host "  - Edge:    edge://extensions/   -> Developer mode -> Load unpacked" -ForegroundColor Gray
    Write-Host "  - Firefox: about:debugging      -> This Firefox  -> Load Temporary Add-on" -ForegroundColor Gray

} finally {
    # Cleanup temp build staging
    if (Test-Path $tempBuild) {
        Remove-Item -Path $tempBuild -Recurse -Force -ErrorAction SilentlyContinue
    }
}
