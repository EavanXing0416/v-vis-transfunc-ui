# Fusion-Annotation README

## Metadata
- Dataset name: Fusion-Annotation
- Timestamp: 2026-09-24 17:02:06 BST
- Type: Physical
- Data object type: EventAnnotation
- No. of data objects: 1
- No. of items: 1242
- File path: data/annotations/elms.json
- Metadata: ELM task event annotations. One JSON file contains 1242 human-marked event intervals across 46 shots. Each record identifies an ELM event and its time interval within one shot.

## Select metadata
- Label headings: n.a.
- Variable headings: n.a.

## User comments:
A3: Event Annotations

Input / ground truth
Human-marked time intervals identifying where each event occurs in each shot. These are the supervised labels for the entire workflow.

Format
Annotations are stored as one JSON file per event type under data/annotations/ (elms.json, ires.json, sawteeth.json). Each record marks a single event occurrence as a time region on a single shot:

| Field | Meaning |
| --- | --- |
| shot_id | Integer shot number the annotation belongs to. |
| type | Always time_region, an interval rather than an instant. |
| label | Human-readable event name, e.g. "ELM". |
| time_min / time_max | Start and end of the event, in seconds of discharge time. |
| created_by | Provenance, e.g. manual. |

The interval is the important part. Events are not points: an ELM annotation is typically 1-2 ms wide, and a sawtooth crash around 3 ms. Everything downstream that decides whether a window is "event" or "background" (b6) works by comparing the window's extent against these [time_min, time_max] intervals.

Loading
load_labels() reads the JSON into a DataFrame and stamps every row with the event_type of the task being run, so that a single labels frame can be filtered per task. The task object supplies both the event_type key and the default annotation path: elm_peaks/elms.json, ires/ires.json, sawteeth/sawteeth.json.