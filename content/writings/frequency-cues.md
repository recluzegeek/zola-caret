+++
title = "Frequency-domain cues that survive compression"
date = 2026-04-30

[taxonomies]
tags = ["cv", "research"]

[extra]
dek = "A lightweight detector built on the artifacts that don't wash out."
+++

Spatial-domain detectors are easy to fool once an image has been re-encoded a few times. The interesting signal often lives in the frequency domain, where some generation artifacts persist through aggressive JPEG compression.

The approach here is deliberately small: a DCT front-end, a couple of conv blocks, and a calibration step so the score stays meaningful across datasets. No giant backbone — it has to run on a modest GPU in a VM.

What surprised me was how much of the gain came from the preprocessing rather than the model. Getting the frequency representation right mattered more than depth.
