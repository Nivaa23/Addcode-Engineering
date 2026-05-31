# Multi-page Reversion Script (Correct Relative Paths)

# 1. Standardize Root Files
$rootFiles = Get-ChildItem -Path . -Filter *.html
$pages = @("index.html", "about.html", "services.html", "industries.html", "contact.html", "proposal.html", "why-addcode.html")

foreach ($file in $rootFiles) {
    Write-Host "Restoring root file: $($file.Name)..."
    $content = Get-Content $file.FullName -Raw
    
    # Remove base tag
    $content = $content -replace '<base href="/Addcode-Engineering/">', ''
    
    # Remove SPA links if any exist in root (e.g., href="#about")
    $content = $content -replace 'href="#home"', 'href="index.html"'
    $content = $content -replace 'href="#about"', 'href="about.html"'
    $content = $content -replace 'href="#services"', 'href="services.html"'
    $content = $content -replace 'href="#industries"', 'href="industries.html"'
    $content = $content -replace 'href="#contact"', 'href="contact.html"'
    $content = $content -replace 'href="#proposal"', 'href="proposal.html"'
    
    # Ensure no absolute paths remain
    $content = $content -replace 'href="/Addcode-Engineering/', 'href="'
    
    $content | Set-Content $file.FullName
}

# 2. Standardize Subfolder Files (/services/)
$servicesFiles = Get-ChildItem -Path services -Filter *.html
foreach ($file in $servicesFiles) {
    Write-Host "Restoring services file: $($file.Name)..."
    $content = Get-Content $file.FullName -Raw
    
    # Remove base tag
    $content = $content -replace '<base href="/Addcode-Engineering/">', ''
    
    # Ensure paths are correctly relative (../)
    foreach ($page in $pages) {
        # Replace href="page.html" with href="../page.html" ONLY if it doesn't already have ../
        # We look for a pattern like href=" followed by word/line chars NOT starting with ..
        # Or more simply, replace href="page.html" with href="../page.html"
        $content = $content -replace "href=`"$page`"", "href=`"../$page`""
    }
    
    # Restore relative assets
    # Using regex to avoid double-prefixing
    $content = $content -replace 'href="(?!\.\.)css/', 'href="../css/'
    $content = $content -replace 'src="(?!\.\.)js/', 'src="../js/'
    $content = $content -replace 'src="(?!\.\.)assets/', 'src="../assets/'
    $content = $content -replace 'href="(?!\.\.)assets/', 'href="../assets/'

    # Fix case where absolute path was used
    $content = $content -replace 'href="/Addcode-Engineering/services/', 'href="'
    $content = $content -replace 'href="/Addcode-Engineering/', 'href="../'
    
    $content | Set-Content $file.FullName
}
