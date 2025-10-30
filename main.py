from http.server import SimpleHTTPRequestHandler, HTTPServer
import json
import sqlite3
import os

class CustomHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        # مسیردهی هوشمند
        if self.path == '/':
            self.path = '/passenger-request.html'
        elif self.path == '/festivals':
            self.path = '/festivals.html'
        elif self.path == '/worlddays':
            self.path = '/worlddays.html'
        
        return SimpleHTTPRequestHandler.do_GET(self)
    
    def do_POST(self):
        if self.path == '/api/request-ride':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))
            
            # پردازش درخواست سفر
            response = {
                'status': 'success',
                'driver': {
                    'name': 'محمد رضایی',
                    'rating': 4.9,
                    'car': 'پژو ۲۰۶ سفید',
                    'plate': 'ایران ۱۲الف۳۴۵',
                    'eta': '۵ دقیقه'
                },
                'fare': 35000
            }
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(response).encode())

def run_server():
    server_address = ('', 8080)
    httpd = HTTPServer(server_address, CustomHandler)
    print('🎊 Hormozgan Driver Pro - سرور در حال اجرا روی پورت 8080')
    print('📱 صفحه اصلی: http://localhost:8080')
    print('🎉 جشن‌ها: http://localhost:8080/festivals')
    httpd.serve_forever()

if __name__ == '__main__':
    run_server()
