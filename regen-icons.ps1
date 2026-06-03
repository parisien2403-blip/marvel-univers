Add-Type -AssemblyName System.Drawing
$dir = $PSScriptRoot
$src = Join-Path $dir 'img\logo.png'
if (-not (Test-Path $src)) { Write-Error "img/logo.png introuvable"; exit 1 }
$img = [System.Drawing.Image]::FromFile($src)

function Resize-Icon([int]$size, [string]$name, [double]$scale) {
  $bmp = New-Object System.Drawing.Bitmap $size, $size
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.Clear([System.Drawing.Color]::FromArgb(255, 10, 10, 15))
  $pad = [int]($size * (1 - $scale) / 2)
  $max = $size - 2 * $pad
  $ratio = [Math]::Min($max / $img.Width, $max / $img.Height)
  $w = [int]($img.Width * $ratio)
  $h = [int]($img.Height * $ratio)
  $g.DrawImage($img, [int](($size - $w) / 2), [int](($size - $h) / 2), $w, $h)
  $g.Dispose()
  $bmp.Save((Join-Path $dir $name), [System.Drawing.Imaging.ImageFormat]::Png)
  $bmp.Dispose()
  Write-Host "OK $name"
}

Resize-Icon 192 'icon-192.png' 0.9
Resize-Icon 512 'icon-512.png' 0.9
$img.Dispose()
