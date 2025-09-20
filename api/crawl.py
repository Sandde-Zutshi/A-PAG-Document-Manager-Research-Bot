from http.server import BaseHTTPRequestHandler
import json
import os
import requests
from bs4 import BeautifulSoup
import pandas as pd
from datetime import datetime
import tempfile
import shutil

# Use temporary directory for Vercel
DOWNLOAD_FOLDER = "/tmp/downloads"
LOG_FILE = "/tmp/downloads_log.csv"

# Create downloads folder if it doesn't exist
os.makedirs(DOWNLOAD_FOLDER, exist_ok=True)

# Enhanced source URLs for better demo content
SOURCE_URLS = [
    "https://www.epa.gov/environmental-topics/air-topics",
    "https://www.epa.gov/environmental-topics/water-topics",
    "https://www.epa.gov/environmental-topics/land-waste-and-cleanup-topics",
    "https://www.epa.gov/environmental-topics/chemicals-and-toxics-topics"
]

def initialize_log():
    """Initialize or load the download log"""
    if os.path.exists(LOG_FILE):
        try:
            return pd.read_csv(LOG_FILE)
        except:
            pass
    
    return pd.DataFrame(columns=["file_name", "source_url", "download_date", "local_path", "file_size"])

def download_documents():
    """Download documents from source URLs"""
    log_df = initialize_log()
    downloaded_files = []
    
    for url in SOURCE_URLS:
        try:
            print(f"Processing {url}...")
            resp = requests.get(url, timeout=30)
            resp.raise_for_status()
            soup = BeautifulSoup(resp.text, "html.parser")
            
            # Find PDF links
            links = soup.find_all("a", href=True)
            pdf_links = [link for link in links if link["href"].lower().endswith(".pdf")]
            
            for link in pdf_links[:3]:  # Limit to 3 PDFs per source for demo
                href = link["href"]
                
                # Handle relative URLs
                if href.startswith("/"):
                    href = f"https://www.epa.gov{href}"
                elif not href.startswith("http"):
                    continue
                
                file_name = os.path.basename(href.split("?")[0])
                if not file_name or file_name in log_df["file_name"].values:
                    continue
                
                try:
                    # Download the PDF
                    r = requests.get(href, timeout=30)
                    r.raise_for_status()
                    
                    file_path = os.path.join(DOWNLOAD_FOLDER, file_name)
                    with open(file_path, "wb") as f:
                        f.write(r.content)
                    
                    file_size = os.path.getsize(file_path)
                    
                    # Add to log
                    new_entry = pd.DataFrame([{
                        "file_name": file_name,
                        "source_url": url,
                        "download_date": datetime.now().isoformat(),
                        "local_path": file_path,
                        "file_size": file_size
                    }])
                    
                    log_df = pd.concat([log_df, new_entry], ignore_index=True)
                    downloaded_files.append({
                        "name": file_name,
                        "size": file_size,
                        "source": url
                    })
                    
                    print(f"Downloaded: {file_name}")
                    
                except Exception as e:
                    print(f"Failed to download {href}: {e}")
                    continue
                    
        except Exception as e:
            print(f"Error processing {url}: {e}")
            continue
    
    # Save log
    try:
        log_df.to_csv(LOG_FILE, index=False)
    except Exception as e:
        print(f"Failed to save log: {e}")
    
    return downloaded_files, len(log_df)

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            # Parse request body
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))
            
            # Download documents
            downloaded_files, total_files = download_documents()
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
            self.end_headers()
            
            response = {
                "status": "success",
                "downloaded_files": downloaded_files,
                "total_files": total_files,
                "message": f"Successfully processed {len(downloaded_files)} new files. Total files in database: {total_files}."
            }
            
            self.wfile.write(json.dumps(response).encode())
            
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            response = {
                "status": "error",
                "message": f"Error during crawling: {str(e)}"
            }
            
            self.wfile.write(json.dumps(response).encode())
    
    def do_GET(self):
        """Get status of downloaded files"""
        try:
            log_df = initialize_log()
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
            self.end_headers()
            
            response = {
                "status": "success",
                "total_files": len(log_df),
                "files": log_df.to_dict('records') if len(log_df) > 0 else []
            }
            
            self.wfile.write(json.dumps(response).encode())
            
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            response = {
                "status": "error",
                "message": f"Error getting status: {str(e)}"
            }
            
            self.wfile.write(json.dumps(response).encode())
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        return
