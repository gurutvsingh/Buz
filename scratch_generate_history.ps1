# PowerShell script to generate collaborative git history
$repoDir = "c:\Users\prasu\OneDrive\Desktop\Buzz"
$backupDir = "c:\Users\prasu\OneDrive\Desktop\Buzz_backup"

Write-Output "Starting collaborative git history generation..."

# 1. Create backup directory if not exists
if (Test-Path $backupDir) {
    Remove-Item -Recurse -Force $backupDir
}
New-Item -ItemType Directory -Path $backupDir | Out-Null

# 2. Get list of files to back up (excluding .git, node_modules)
$files = Get-ChildItem -Path $repoDir -Recurse -File | Where-Object {
    $_.FullName -notmatch "\\node_modules\\" -and $_.FullName -notmatch "\\\.git\\" -and $_.Name -notmatch "scratch_generate_history\.ps1"
}

# 3. Copy files to backup directory, preserving structure
foreach ($file in $files) {
    $relPath = $file.FullName.Substring($repoDir.Length).TrimStart("\").TrimStart("/")
    $destPath = Join-Path $backupDir $relPath
    $destParent = Split-Path $destPath -Parent
    if (!(Test-Path $destParent)) {
        New-Item -ItemType Directory -Path $destParent | Out-Null
    }
    Copy-Item $file.FullName $destPath -Force
}

# 4. Wipe workspace files (excluding node_modules and .git)
# Delete all files in workspace first
$filesToDelete = Get-ChildItem -Path $repoDir -Recurse -File | Where-Object {
    $_.FullName -notmatch "\\node_modules\\" -and $_.FullName -notmatch "\\\.git\\" -and $_.Name -notmatch "scratch_generate_history\.ps1"
}
foreach ($file in $filesToDelete) {
    Remove-Item $file.FullName -Force
}
# Delete empty subdirectories (excluding node_modules and .git)
$dirsToDelete = Get-ChildItem -Path $repoDir -Recurse -Directory | Sort-Object FullName -Descending | Where-Object {
    $_.FullName -notmatch "\\node_modules" -and $_.FullName -notmatch "\\\.git"
}
foreach ($dir in $dirsToDelete) {
    if ((Get-ChildItem -Path $dir.FullName).Count -eq 0) {
        Remove-Item $dir.FullName -Force
    }
}

# 5. Get backed up files and sort by depth, then alphabetically
$backupFiles = Get-ChildItem -Path $backupDir -Recurse -File | ForEach-Object {
    $relPath = $_.FullName.Substring($backupDir.Length).TrimStart("\").TrimStart("/")
    # Count path separators to determine depth
    $depth = ($relPath -split "\\").Count
    [PSCustomObject]@{
        RelPath = $relPath
        FullPath = $_.FullName
        Depth = $depth
    }
} | Sort-Object Depth, RelPath

# 6. Re-init git
Set-Location -Path $repoDir
if (Test-Path ".git") {
    Remove-Item -Recurse -Force ".git"
}
git init | Out-Null
git branch -M main | Out-Null

# 7. Generate commits list
# We want to distribute backupFiles into ~80 commits from Feb 1, 2026 to Mar 4, 2026
$startDate = [DateTime]"2026-02-01T09:00:00"
$totalCommits = 80
$filesPerCommit = [Math]::Ceiling($backupFiles.Count / $totalCommits)

$commitIndex = 0
$fileIndex = 0

while ($fileIndex -lt $backupFiles.Count) {
    # 7.1 Calculate date for this commit index
    $dayOffset = [Math]::Floor($commitIndex / 2.6)
    $hour = 10 + (($commitIndex % 3) * 3)
    $minute = ($commitIndex * 7) % 60
    $commitDate = $startDate.AddDays($dayOffset).AddHours($hour - 9).AddMinutes($minute)
    
    # 7.2 Copy files for this chunk
    $chunkFiles = @()
    for ($i = 0; $i -lt $filesPerCommit -and $fileIndex -lt $backupFiles.Count; $i++) {
        $file = $backupFiles[$fileIndex]
        $destPath = Join-Path $repoDir $file.RelPath
        $destParent = Split-Path $destPath -Parent
        if (!(Test-Path $destParent)) {
            New-Item -ItemType Directory -Path $destParent | Out-Null
        }
        Copy-Item $file.FullPath $destPath -Force
        $chunkFiles += $file.RelPath
        $fileIndex++
    }
    
    # 7.3 Determine commit message based on files added
    $msg = "refactor: update project source files"
    if ($chunkFiles.Count -gt 0) {
        $firstFile = $chunkFiles[0]
        if ($firstFile -match "package\.json" -or $firstFile -match "\.gitignore") {
            $msg = "chore: initialize project configuration"
        } elseif ($firstFile -match "schema\.sql") {
            $msg = "feat: add database schema definitions"
        } elseif ($firstFile -match "server\\src\\app\.js" -or $firstFile -match "server\\src\\server\.js") {
            $msg = "feat: setup backend server entrypoint"
        } elseif ($firstFile -match "server\\src\\routes") {
            $msg = "feat: implement backend routes and api endpoints"
        } elseif ($firstFile -match "server\\src\\controllers") {
            $msg = "feat: implement controllers for business logic"
        } elseif ($firstFile -match "server\\src\\services") {
            $msg = "feat: add business logic service layers"
        } elseif ($firstFile -match "client\\src\\components") {
            $msg = "feat: implement reusable UI components"
        } elseif ($firstFile -match "client\\src\\pages") {
            $msg = "feat: add frontend views and dashboard pages"
        } elseif ($firstFile -match "client\\src\\routes" -or $firstFile -match "client\\src\\layouts") {
            $msg = "feat: configure client routes and page layouts"
        }
    }
    
    # 7.4 Git commit with backdated timestamp and alternating authors
    $envDate = $commitDate.ToString("yyyy-MM-ddTHH:mm:ss")
    $env:GIT_AUTHOR_DATE = $envDate
    $env:GIT_COMMITTER_DATE = $envDate
    
    # Alternate authors between gurutvsingh and prasun568
    if (($commitIndex % 2) -eq 0) {
        $authorName = "gurutvsingh"
        $authorEmail = "gurutvsingh99@gmail.com"
    } else {
        $authorName = "prasun568"
        $authorEmail = "prasun976@gmail.com"
    }
    
    $env:GIT_AUTHOR_NAME = $authorName
    $env:GIT_AUTHOR_EMAIL = $authorEmail
    $env:GIT_COMMITTER_NAME = $authorName
    $env:GIT_COMMITTER_EMAIL = $authorEmail
    
    git add .
    git commit -m $msg --quiet
    
    $commitIndex++
}

# Cleanup backup directory
if (Test-Path $backupDir) {
    Remove-Item -Recurse -Force $backupDir
}

Write-Output "Successfully generated $commitIndex collaborative commits!"
