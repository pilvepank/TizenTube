$dir = "c:/koodimine/qsymphonyfix/mods/translations/resources"
Get-ChildItem $dir -Filter *.json | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    try {
        $null = ConvertFrom-Json $content -ErrorAction Stop
        Write-Host "$($_.Name): OK"
    } catch {
        Write-Host "$($_.Name): ERROR - $_"
    }
}
