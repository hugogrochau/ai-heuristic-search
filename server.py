#!/usr/bin/env python2

import SimpleHTTPServer
import SocketServer
import webbrowser

PORT = 8000

Handler = SimpleHTTPServer.SimpleHTTPRequestHandler

httpd = SocketServer.TCPServer(("", PORT), Handler)

print "serving at port", PORT
webbrowser.open("http://127.0.0.1:8000", new=2);
httpd.serve_forever()