# Fusion-MAST-Exp README

## Metadata
- Dataset name: Fusion-MAST-Exp
- Timestamp: 2026-09-24 17:02:06 BST
- Type: Physical
- Data object type: TimeSeries
- No. of data objects: 9700
- Metadata: MAST experimental archive. Approximately 9,700 data objects. Each data object represents one plasma-discharge shot stored as one Zarr file. Each shot contains multiple diagnostic time-series signals at different sampling resolutions. Typical discharge span: 0-2 s. Default signals: ip, ne, dalpha, sxr_core.

## Select metadata
- Label headings: n.a.
- Variable headings: n.a.

## User comments:
MAST Experimental Data

Input / data source
The upstream source of everything in the pipeline: the diagnostic signals recorded during plasma discharges ("shots") on the MAST spherical tokamak.

What it is
Every MAST shot produces a set of independently-recorded diagnostic traces. Each trace is a one-dimensional time series covering roughly the first two seconds of the discharge, and each is written by its own diagnostic system with its own acquisition electronics. This matters for the rest of the workflow: the signals do not share a sampling rate, they do not share a start time, and an individual diagnostic may simply not have been operating for a given shot. A shot is therefore not a clean matrix. It is a bundle of ragged, independently-clocked channels that must be assembled before any model can see it.

The signals the workflow uses
The per-shot files carry twelve columns, of which the classifier consumes a configurable subset. The default signal set (the --modalities flag) is ip, ne, dalpha and sxr_core, chosen because between them they carry the signatures of all three event classes the workflow targets.

| Signal | What it measures / why it is used |
| --- | --- |
| ip | Plasma current (kA). Defines the flat-top and the disruption; used by every task. |
| ne | Line-averaged electron density. |
| dalpha | D-alpha emission. ELMs appear as sharp spikes in this channel. |
| sxr_core | Soft X-ray core emission. Sawtooth crashes appear as fast drops here. |

Scale
Roughly 9,700 shots are available as per-shot files.
Only the shots that carry an annotation for the task being run are ever loaded. See a2 (Shot List) and b1 (Signal Retrieval).
Each shot spans about 0-2 s of discharge time.

Role in the workflow
This box is a source, not a processing step. Nothing in the training script reads the raw archive directly; it reads the per-shot files that b1 and b2 produce from it. It is drawn here to make explicit that the ground truth of the whole pipeline is real experimental measurement, and that every downstream artefact inherits the gaps, rate differences and noise of the instruments that produced it.