#!/usr/bin/env python3
"""
Script to take full page screenshots of HTML files using headless Chrome
"""
import subprocess
import os
import time
import sys

def take_screenshot(html_file, output_file):
    """Take a full page screenshot of an HTML file using headless Chrome"""
    abs_html_path = os.path.abspath(html_file)
    abs_output_path = os.path.abspath(output_file)
    
    # Create a temporary HTML file with absolute paths for resources
    temp_html = f"""
<!DOCTYPE html>
<html>
<head>
    <style>
        body {{ margin: 0; padding: 0; }}
    </style>
</head>
<body>
    <iframe src="file://{abs_html_path}" style="width: 100vw; height: 100vh; border: none;"></iframe>
</body>
</html>
"""
    
    temp_file = f"temp_{os.path.basename(html_file)}"
    with open(temp_file, 'w') as f:
        f.write(temp_html)
    
    try:
        # Use headless Chrome to take screenshot
        cmd = [
            'google-chrome', '--headless', '--disable-gpu', '--window-size=1920,1080',
            '--screenshot=' + abs_output_path,
            'file://' + os.path.abspath(temp_file)
        ]
        
        # Try alternative Chrome commands
        chrome_commands = ['google-chrome', 'chrome', 'chromium', 'chromium-browser']
        for chrome_cmd in chrome_commands:
            try:
                subprocess.run([chrome_cmd, '--version'], check=True, capture_output=True)
                cmd[0] = chrome_cmd
                break
            except (subprocess.CalledProcessError, FileNotFoundError):
                continue
        else:
            print("No Chrome/Chromium browser found")
            return False
        
        result = subprocess.run(cmd, capture_output=True, text=True)
        
        if result.returncode == 0 and os.path.exists(abs_output_path):
            print(f"✓ Screenshot saved: {output_file}")
            return True
        else:
            print(f"✗ Failed to create screenshot for {html_file}")
            print(f"Error: {result.stderr}")
            return False
            
    finally:
        # Clean up temporary file
        if os.path.exists(temp_file):
            os.remove(temp_file)

def main():
    html_files = [
        'index.html',
        'community-hub.html',
        'training.html',
        'after_profile.html',
        'before_profile.html',
        'messaging.html',
        'documentation.html',
        'profile_section_fixed.html',
        'awards.html',
        'matchmaking.html'
    ]
    
    screenshots_dir = 'docs/screenshots'
    os.makedirs(screenshots_dir, exist_ok=True)
    
    success_count = 0
    
    for html_file in html_files:
        if os.path.exists(html_file):
            output_file = f"{screenshots_dir}/{html_file.replace('.html', '.png')}"
            if take_screenshot(html_file, output_file):
                success_count += 1
            time.sleep(1)  # Brief pause between screenshots
        else:
            print(f"✗ File not found: {html_file}")
    
    print(f"\nCompleted: {success_count}/{len(html_files)} screenshots created")

if __name__ == '__main__':
    main()