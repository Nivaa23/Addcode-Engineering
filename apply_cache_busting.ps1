# Cache-Busting Automation Script (Relative Path Aware)
$version = "1.0.1"
$files = Get-ChildItem -Recurse -Filter *.html

foreach ($file in $files) {
    Write-Host "Applying cache-busting to: $($file.FullName)..."
    $content = Get-Content $file.FullName -Raw
    
    # 1. Clean existing version params (to prevent ?v=1.0.0?v=1.0.1)
    $content = $content -replace '(\.css|\.js)\?v=[^"\s'']+''', '$1'''
    $content = $content -replace '(\.css|\.js)\?v=[^"\s'']+"', '$1"'
    
    # 2. Apply the new version param to internal assets
    # Matches href="...css/styles.css", src="...js/main.js", etc.
    # Excludes external CDNs (they usually have their own versioning or shouldn't be touched)
    
    # Patterns for any internal .css or .js asset links that DO NOT start with http/https
    # Using negative lookahead for external URLs
    $content = $content -replace 'href="(?!(http|https))([^"]+\.css)"', "href=`"$2?v=$version`""
    $content = $content -replace "href='(?!(http|https))([^']+\.css)'", "href='`$2?v=$version'"
    
    $content = $content -replace 'src="(?!(http|https))([^"]+\.js)"', "src=`"$2?v=$version`""
    $content = $content -replace "src='(?!(http|https))([^']+\.js)'", "src='`$2?v=$version'"
    
    $content | Set-Content $file.FullName
}
