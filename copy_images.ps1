# Copy images for Gemini Educator article
$sourceDir = "src\assets\images\news\2025-01-23-教師工作坊-如何利用-ai-提升教學效率"
$targetDir = "src\assets\images\news\2025-09-30-gemini-educator"

# Create target directory if it doesn't exist
if (!(Test-Path $targetDir)) {
    New-Item -ItemType Directory -Path $targetDir -Force
}

# Copy images
Copy-Item "$sourceDir\image1.jpeg" "$targetDir\featuredimage.jpg" -Force
Copy-Item "$sourceDir\image2.jpg" "$targetDir\indeximage.jpg" -Force
Copy-Item "$sourceDir\image3.png" "$targetDir\training-image1.png" -Force
Copy-Item "$sourceDir\image4.jpg" "$targetDir\training-image2.jpg" -Force
Copy-Item "$sourceDir\image5.png" "$targetDir\training-image3.png" -Force

Write-Host "Images copied successfully!"
