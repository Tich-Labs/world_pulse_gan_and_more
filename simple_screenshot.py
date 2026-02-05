#!/usr/bin/env python3
"""
Simple screenshot script using available tools
"""
import os
import subprocess
import time

def check_chrome():
    """Check if Chrome/Chromium is available"""
    chrome_commands = ['google-chrome', 'chrome', 'chromium', 'chromium-browser']
    for cmd in chrome_commands:
        try:
            result = subprocess.run([cmd, '--version'], check=True, capture_output=True)
            return cmd
        except (subprocess.CalledProcessError, FileNotFoundError):
            continue
    return None

def take_screenshot_chrome(html_file, output_file):
    """Take screenshot using Chrome headless mode"""
    chrome_cmd = check_chrome()
    if not chrome_cmd:
        print("Chrome/Chromium not found")
        return False
    
    abs_html_path = os.path.abspath(html_file)
    abs_output_path = os.path.abspath(output_file)
    
    cmd = [
        chrome_cmd,
        '--headless',
        '--disable-gpu',
        '--window-size=1920,1080',
        '--virtual-time-budget=3000',  # Wait 3 seconds for page load
        '--screenshot=' + abs_output_path,
        'file://' + abs_html_path
    ]
    
    try:
        result = subprocess.run(cmd, check=True, capture_output=True, timeout=30)
        if os.path.exists(abs_output_path):
            print(f"✓ {html_file} -> {output_file}")
            return True
        else:
            print(f"✗ Screenshot not created for {html_file}")
            return False
    except subprocess.TimeoutExpired:
        print(f"✗ Timeout for {html_file}")
        return False
    except subprocess.CalledProcessError as e:
        print(f"✗ Error with {html_file}: {e}")
        return False

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
    
    print("Taking screenshots...")
    success = 0
    
    for html_file in html_files:
        if os.path.exists(html_file):
            output_file = f"{screenshots_dir}/{html_file.replace('.html', '.png')}"
            if take_screenshot_chrome(html_file, output_file):
                success += 1
            time.sleep(2)  # Wait between screenshots
        else:
            print(f"✗ File not found: {html_file}")
    
    print(f"\nDone: {success}/{len(html_files)} screenshots created")

if __name__ == '__main__':
    main()