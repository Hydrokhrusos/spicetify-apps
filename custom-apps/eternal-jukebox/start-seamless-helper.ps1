$ErrorActionPreference = "Stop"

$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
$Cache = Join-Path $env:LOCALAPPDATA "SpicetifyEternalJukeboxAudioCache"
$Packages = Join-Path $env:LOCALAPPDATA "Microsoft\WinGet\Packages"
$Deno = Join-Path $Packages "DenoLand.Deno_Microsoft.Winget.Source_8wekyb3d8bbwe\deno.exe"
$YtDlp = Join-Path $Packages "yt-dlp.yt-dlp_Microsoft.Winget.Source_8wekyb3d8bbwe\yt-dlp.exe"
$Ffmpeg = Get-ChildItem -Path (Join-Path $Packages "yt-dlp.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe") -Recurse -Filter ffmpeg.exe -ErrorAction Stop |
    Select-Object -First 1 -ExpandProperty FullName
$Script = Join-Path $Root "seamless-helper.ts"
$Log = Join-Path $Cache "helper.log"
$Err = Join-Path $Cache "helper.err.log"

if (-not (Test-Path -LiteralPath $Deno)) {
    throw "Deno was not found at $Deno"
}

if (-not (Test-Path -LiteralPath $YtDlp)) {
    throw "yt-dlp was not found at $YtDlp"
}

if (-not (Test-Path -LiteralPath $Ffmpeg)) {
    throw "FFmpeg was not found at $Ffmpeg"
}

$env:EJB_YTDLP = $YtDlp
$env:EJB_FFMPEG = $Ffmpeg
$env:EJB_AUDIO_CACHE = $Cache

New-Item -ItemType Directory -Force -Path $Cache | Out-Null

$Arguments = @(
    "run",
    "--allow-net=127.0.0.1:43173",
    "--allow-read=$Root,$Cache,$Packages",
    "--allow-write=$Cache",
    "--allow-run=$YtDlp",
    "--allow-env=LOCALAPPDATA,PATH,EJB_HELPER_PORT,EJB_AUDIO_CACHE,EJB_YTDLP,EJB_FFMPEG",
    $Script
)

Start-Process -FilePath $Deno -ArgumentList $Arguments -WindowStyle Hidden -RedirectStandardOutput $Log -RedirectStandardError $Err
