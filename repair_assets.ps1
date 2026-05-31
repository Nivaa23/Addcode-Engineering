# Final Asset Path Correction (Context-Aware)
$version = "1.0.1"
$files = Get-ChildItem -Recurse -Filter *.html

foreach ($file in $files) {
    # Skip index.html if it was already manually fixed, or just include it in the logic
    $content = Get-Content $file.FullName -Raw
    $p = if ($file.FullName.Contains("\services\")) { "../" } else { "" }
    
    # 1. Restore CSS link correctly based on depth
    $content = $content -replace 'href="=1\.0\.1"', "href=`"${p}css/styles.css?v=$version`""
    
    # 2. Restore JS scripts (main.js and hero-bg.js) in order
    # Using a literal match for the footer script block which is consistent across most pages
    $oldFooter = '<script src="=1.0.1"></script>\s*<script>lucide.createIcons\(\);</script>\s*<script src="=1.0.1"></script>'
    $newFooter = "<script src=`"${p}js/main.js?v=$version`"></script>`n    <script>lucide.createIcons();</script>`n    <script src=`"${p}js/hero-bg.js?v=$version`"></script>"
    
    if ($content -match $oldFooter) {
        $content = [regex]::Replace($content, $oldFooter, $newFooter)
    }
    else {
        # Fallback for pages with only one or different script arrangement
        # The first script is ALWAYS main.js
        $content = $content -replace 'src="=1\.0\.1"', "src=`"${p}js/main.js?v=$version`""
    }
    
    Write-Host "Repaired: $($file.Name)"
    $content | Set-Content $file.FullName
}
