from http.server import SimpleHTTPRequestHandler, HTTPServer
import json
import sqlite3
import os
from urllib.parse import urlparse, parse_qs

class CustomHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        # مسیردهی هوشمند
        if self.path == '/':
            self.path = '/passenger-request.html'
        elif self.path == '/festivals':
            self.path = '/festivals.html'
        elif self.path == '/worlddays':
            self.path = '/worlddays.html'
        elif self.path == '/payment':
            self.path = '/payment.html'
        elif self.path.startswith('/zarinpal-payment'):
            self.path = '/zarinpal-payment.html'
        elif self.path.startswith('/payment-success'):
            self.path = '/payment-success.html'
        
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
                    'car': 'پژو 206 سفید',
                    'plate': 'الف ۱۲۳ ایران ۴۵',
                    'eta': '5 دقیقه'
                },
                'fare': 35000
            }
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(response).encode())
        
        elif self.path == '/api/process-payment':
            # شبیه‌سازی پرداخت زرین‌پال
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))
            
            response = {
                'status': 'success',
                'payment_url': '/zarinpal-payment?amount=' + str(data['amount']),
                'tracking_code': 'ZP' + str(hash(data['amount']))[-6:]
            }
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(response).encode())

def run_server():
    server_address = ('', 8080)
    httpd = HTTPServer(server_address, CustomHandler)
    print('🚗 Hormozgan Driver Pro - سرور در حال اجرا روی پورت 8080')
    print('📱 صفحه اصلی: http://localhost:8080')
    print('💳 صفحه پرداخت: http://localhost:8080/payment')
    print('🎉 جشن‌ها: http://localhost:8080/festivals')
    httpd.serve_forever()

if __name__ == '__main__':
    run_server()
