import base64
import re

# Read the markdown file
with open('c:/Users/testt/Downloads/Trial .md', 'r', encoding='utf-8') as f:
    content = f.read()

# Find the base64 image
pattern = r'data:image/png;base64,([A-Za-z0-9+/=]+)'
match = re.search(pattern, content)

if match:
    base64_data = match.group(1)
    
    # Decode and save the image
    image_data = base64.b64decode(base64_data)
    
    # Save to the course directory
    with open('src/assets/images/school-courses/WRO世界機器人大賽挑戰營/hero-image.png', 'wb') as f:
        f.write(image_data)
    
    print("Base64 image extracted and saved as hero-image.png")
else:
    print("No base64 image found") 