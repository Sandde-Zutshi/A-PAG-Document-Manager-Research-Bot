from http.server import BaseHTTPRequestHandler
import json
import os
import pandas as pd
from pypdf import PdfReader
from openai import OpenAI
import tempfile
import re

# Initialize OpenAI client
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=OPENAI_API_KEY) if OPENAI_API_KEY else None

LOG_FILE = "/tmp/downloads_log.csv"

def extract_text_from_pdfs():
    """Extract text from all downloaded PDFs"""
    texts = []
    file_info = []
    
    if not os.path.exists(LOG_FILE):
        return texts, file_info
    
    try:
        log_df = pd.read_csv(LOG_FILE)
        
        for _, row in log_df.iterrows():
            path = row["local_path"]
            if os.path.exists(path):
                try:
                    reader = PdfReader(path)
                    full_text = ""
                    
                    for page_num, page in enumerate(reader.pages):
                        page_text = page.extract_text() or ""
                        full_text += page_text + "\n"
                    
                    # Clean and truncate text for better processing
                    full_text = re.sub(r'\s+', ' ', full_text).strip()
                    
                    if len(full_text) > 100:  # Only include PDFs with substantial content
                        texts.append(full_text[:8000])  # Limit text length for API
                        file_info.append({
                            "filename": row["file_name"],
                            "source": row["source_url"],
                            "pages": len(reader.pages),
                            "text_length": len(full_text)
                        })
                        
                except Exception as e:
                    print(f"Failed to read {path}: {e}")
                    continue
                    
    except Exception as e:
        print(f"Error reading log file: {e}")
    
    return texts, file_info

def query_documents(query, texts, file_info):
    """Query documents using OpenAI"""
    if not client:
        return {
            "error": "OpenAI API key not configured. Please set OPENAI_API_KEY environment variable."
        }
    
    if not texts:
        return {
            "error": "No documents found. Please crawl some documents first."
        }
    
    try:
        # Prepare context with document information
        context_parts = []
        for i, (text, info) in enumerate(zip(texts, file_info)):
            context_parts.append(f"Document {i+1} ({info['filename']}):\n{text}\n")
        
        combined_text = "\n".join(context_parts)
        
        # Truncate if too long
        if len(combined_text) > 30000:
            combined_text = combined_text[:30000] + "..."
        
        response = client.chat.completions.create(
            model="gpt-4-turbo-preview",
            messages=[
                {
                    "role": "system", 
                    "content": """You are an expert environmental analyst and research assistant. 
                    You have access to environmental documents from the EPA and other sources.
                    Provide accurate, well-structured answers based on the provided documents.
                    If the information isn't available in the documents, clearly state that.
                    Always cite which document(s) your information comes from.
                    Format your response with clear sections and bullet points when appropriate."""
                },
                {
                    "role": "user", 
                    "content": f"""Based on these environmental documents, please answer the following question:

Question: {query}

Documents:
{combined_text}

Please provide a comprehensive answer with citations to the relevant documents."""
                }
            ],
            max_tokens=1500,
            temperature=0.3
        )
        
        answer = response.choices[0].message.content
        
        return {
            "answer": answer,
            "sources": file_info,
            "query": query,
            "model_used": "gpt-4-turbo-preview"
        }
        
    except Exception as e:
        return {
            "error": f"Error querying documents: {str(e)}"
        }

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            # Parse request body
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))
            
            query = data.get("query", "").strip()
            if not query:
                self.send_response(400)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                
                response = {
                    "status": "error",
                    "message": "No query provided. Please provide a question to search for."
                }
                
                self.wfile.write(json.dumps(response).encode())
                return
            
            # Extract text from PDFs
            texts, file_info = extract_text_from_pdfs()
            
            # Query documents
            result = query_documents(query, texts, file_info)
            
            if "error" in result:
                self.send_response(400)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                
                response = {
                    "status": "error",
                    "message": result["error"]
                }
                
                self.wfile.write(json.dumps(response).encode())
            else:
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
                self.send_header('Access-Control-Allow-Headers', 'Content-Type')
                self.end_headers()
                
                response = {
                    "status": "success",
                    **result
                }
                
                self.wfile.write(json.dumps(response).encode())
                
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            response = {
                "status": "error",
                "message": f"Server error: {str(e)}"
            }
            
            self.wfile.write(json.dumps(response).encode())
    
    def do_GET(self):
        """Get information about available documents"""
        try:
            texts, file_info = extract_text_from_pdfs()
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
            self.end_headers()
            
            response = {
                "status": "success",
                "total_documents": len(file_info),
                "documents": file_info,
                "openai_configured": client is not None
            }
            
            self.wfile.write(json.dumps(response).encode())
            
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            response = {
                "status": "error",
                "message": f"Error getting document info: {str(e)}"
            }
            
            self.wfile.write(json.dumps(response).encode())
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        return
