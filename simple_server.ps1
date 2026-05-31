$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://127.0.0.1:5555/")
$listener.Start()
Write-Host "Server started on http://127.0.0.1:5555/"
while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        $path = $request.Url.LocalPath.TrimStart('/')
        if ([string]::IsNullOrWhiteSpace($path)) { $path = "index.html" }
        $localPath = Join-Path "c:\Users\Admin\Desktop\Antigravity Projects\addcode-engineering" $path
        
        # Security: ensure path is within the project directory
        $resolvedPath = [System.IO.Path]::GetFullPath($localPath)
        $projectPath = [System.IO.Path]::GetFullPath("c:\Users\Admin\Desktop\Antigravity Projects\addcode-engineering")
        if (-not $resolvedPath.StartsWith($projectPath)) {
            $response.StatusCode = 403
            $response.Close()
            continue
        }

        if (Test-Path $localPath -PathType Container) { $localPath = Join-Path $localPath "index.html" }
        
        if (Test-Path $localPath -PathType Leaf) {
            $content = [System.IO.File]::ReadAllBytes($localPath)
            $extension = [System.IO.Path]::GetExtension($localPath).ToLower()
            $response.ContentType = switch ($extension) {
                ".html" { "text/html" }
                ".css" { "text/css" }
                ".js" { "application/javascript" }
                ".png" { "image/png" }
                ".jpg" { "image/jpeg" }
                ".jpeg" { "image/jpeg" }
                ".svg" { "image/svg+xml" }
                default { "application/octet-stream" }
            }
            $response.OutputStream.Write($content, 0, $content.Count)
        }
        else {
            $response.StatusCode = 404
        }
        $response.Close()
    }
    catch {
        Write-Host "Error: $($_.Exception.Message)"
    }
}
