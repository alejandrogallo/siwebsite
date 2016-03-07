import os
file_path = os.path.dirname(os.path.realpath(__file__))

proto_path = os.path.abspath(file_path+"../../../../proto")

import sys
sys.path.insert(0,proto_path)

import numpy as np

from grpc.beta import implementations

from pulse_streamer_pb2 import PulseMessage, SequenceMessage, beta_create_PulseStreamer_stub

channel = implementations.insecure_channel('192.168.1.100', 50051)
stub = beta_create_PulseStreamer_stub(channel)

def get_random_seq(mean_length=1024, n_pulses=1000):
    """
    Generate a sequence of random pulses
    """
    t = np.random.uniform(0, mean_length*2, n_pulses).astype(int)
    seq = SequenceMessage()
    seq.pulse.extend([PulseMessage(ticks=8, digi=0x01, ao0=0x7fff,ao1=-0x7fff)])
    for i, ti in enumerate(t):
        state = i%2
        p = PulseMessage(ticks=ti, digi=0xfe*state, ao0=0x7fff*state, ao1=-0x7fff*state)
        seq.pulse.extend([p])
    return seq

seq = get_random_seq(128, 10000)

seq.initial.ticks=0
seq.initial.digi=0x00
seq.initial.ao0=0x0000
seq.initial.ao1=0x0000
seq.final.ticks=0
seq.final.digi=0x00
seq.final.ao0=0x0000
seq.final.ao1=0x0000
seq.underflow.ticks=0
seq.underflow.digi=0x00
seq.underflow.ao0=0x0000
seq.underflow.ao1=0x0000
seq.triggered = False
seq.auto_start = True

reply = stub.stream(seq, 1)

print("Pulse Streamer replied: "+reply.message)
