
# we use the tinyrpc package to connect to the JSON-RPC server
from tinyrpc.protocols.jsonrpc import JSONRPCProtocol
from tinyrpc.transports.http import HttpPostClientTransport
from tinyrpc import RPCClient

# binary and base64 conversion
import struct
import base64

import numpy as np

def get_random_sequence(mean_length=1024, n_pulses=1000):
    """
    Generate a sequence of random pulses
    """
    t = np.random.uniform(0, mean_length*2, n_pulses).astype(int)
    seq = [ (8, 0x01, 0x7fff, -0x7fff) ]
    for i, ti in enumerate(t):
        state = i%2
        seq += [ (ti, 0xfe*state, 0x7fff*state, -0x7fff*state) ]
    return seq

def encode_sequence(seq):
    """
    Convert a human readable python sequence to a base64 encoded binary string
    """
    s = b''
    for pulse in seq:
        s+=struct.pack('>IBhh', *pulse)
    return base64.b64encode(s)

client = RPCClient(
    JSONRPCProtocol(),
    HttpPostClientTransport('http://192.168.1.100:8050/json-rpc')
)

# create the proxy class
pulse_streamer = client.get_proxy()

seq = get_random_sequence()

seq_b64 = encode_sequence(seq)

n_runs = 0
final = (0,0,0,0)
underflow = (0,0,0,0)
triggered = False

pulse_streamer.stream(seq_b64, n_runs, final, underflow, triggered)

