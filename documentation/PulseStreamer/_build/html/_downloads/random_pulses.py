
# we use the tinyrpc package to connect to the JSON-RPC server
from tinyrpc.protocols.jsonrpc import JSONRPCProtocol
from tinyrpc.transports.http import HttpPostClientTransport
from tinyrpc import RPCClient

# binary and base64 conversion
import struct
import base64

import numpy as np

def get_random_seq(min_len=0, max_len=1024, n_pulses=1000):
    """
    Generate a sequence of random pulses on the digital
    channels 1-7 and the two analog channels.
    
    Digital channel 0 is used as a trigger.    
    """
    t = np.random.uniform(min_len, max_len, n_pulses).astype(int)
    seq = [ (8, 1, 0, 0) ] # 8 ns trigger pulse on channel 0
    for i, ti in enumerate(t):
        state = i%2
        seq += [ (ti, 0xfe*state, 0x7fff*state, -0x7fff*state) ]
    return seq

def enc(seq):
    """
    Convert a human readable python sequence to a base64 encoded string
    """
    s = b''
    for pulse in seq:
        s+=struct.pack('>IBhh', *pulse)
    return base64.b64encode(s)

ip = '192.168.1.100'
url = 'http://'+ip+':8050/json-rpc'

client = RPCClient(
    JSONRPCProtocol(),
    HttpPostClientTransport(url)
)

ps = client.get_proxy()

seq = get_random_seq()

n_runs = -1
initial = (0,0xff,0,0)
final = (0,0x00,0x7fff,0)
underflow = (0,0,0,0)
start = 'IMMEDIATE'

ps.stream(enc(seq), n_runs, initial, final, underflow, start)

print('Pulse Streamer is running: '+str(ps.isRunning()))

