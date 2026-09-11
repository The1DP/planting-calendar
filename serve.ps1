$root = $PSScriptRoot
$port = 8973
$listener = $null
for ($i = 0; $i -lt 10; $i++) {
    try {
        $listener = New-Object System.Net.HttpListener
        $listener.Prefixes.Add("http://localhost:$port/")
        $listener.Start()
        break
    } catch {
        $listener = $null
        $port++
    }
}
if (-not $listener) {
    Write-Host "Could not find a free port. Close other local servers and try again."
    Read-Host "Press Enter to exit"
    exit 1
}

$url = "http://localhost:$port/"
Write-Host "Planting calendar running at $url"
Write-Host "Leave this window open while you use the app. Close it (or press Ctrl+C) to stop."
Start-Process $url

while ($listener.IsListening) {
    $context = $listener.GetContext()
    $req = $context.Request
    $res = $context.Response
    $path = $req.Url.LocalPath
    if ($path -eq "/") { $path = "/index.html" }
    $filePath = Join-Path $root ($path.TrimStart("/"))
    if (Test-Path $filePath -PathType Leaf) {
        $bytes = [System.IO.File]::ReadAllBytes($filePath)
        if ($filePath -like "*.html") { $res.ContentType = "text/html" }
        elseif ($filePath -like "*.js") { $res.ContentType = "application/javascript" }
        elseif ($filePath -like "*.css") { $res.ContentType = "text/css" }
        $res.ContentLength64 = $bytes.Length
        $res.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
        $res.StatusCode = 404
    }
    $res.OutputStream.Close()
}
