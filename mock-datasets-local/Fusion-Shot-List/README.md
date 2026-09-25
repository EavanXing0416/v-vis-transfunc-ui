# Fusion-Shot-List README

## Metadata
- Dataset name: Fusion-Shot-List
- Timestamp: 2026-09-24 17:02:06 BST
- Type: Physical
- Data object type: IntegerList
- No. of data objects: 1
- No. of items: 46
- Metadata: ELM task shot list. One CSV file contains a one-dimensional array of 46 shot IDs. These IDs specify the labelled shots used by the workflow.

## Select metadata
- Label headings: n.a.
- Variable headings: n.a.

## User comments:
A2: Shot List

Input / selection
The set of numerical shot numbers a given training run is allowed to touch. In practice, these are the shots that carry at least one annotation for the event type being trained.

Purpose
The archive holds far more shots than are usable for supervised training. A shot is only useful if somebody has annotated it for the event in question: an unannotated shot cannot supply positive examples, and it cannot safely supply negative ones either, because the absence of a label is not evidence of the absence of an event. The shot list is the mechanism that keeps the run restricted to shots where the label is meaningful. Furthermore, some shots are not useful, such as vacuum shots which contain no plasma.

How the list is derived
The list is not maintained by hand. It is derived from the annotation files (a3): the distinct shot_id values appearing in the annotations for a given event type are the shots for that event type.