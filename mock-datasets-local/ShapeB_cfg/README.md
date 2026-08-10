# ShapeB_cfg README

## Metadata
- Dataset name: ShapeB_cfg
- Timestamp: 2026-08-10 12:33:36 BST
- Type: Physical
- Data object type: ImageGenConfig
- No. of data objects: 1
- Metadata: Image-generation config. changed_variables=(shape); shape_values=(star, ellipse, pentagon); fixed_variables=(scale, pos_x, pos_y, rotation, grey); image_size=(64,64); output_format=PNG; color_type=grey; background=white; background_grey=10; shape_cropping=False; shape_overlapping=False; variable_ranges=scale(0.2,0.8),pos_x(0.2,0.8),pos_y(0.2,0.8),rotation(0,180),grey(50,255); discretization_levels=scale(8),pos_x(8),pos_y(4),rotation(2),grey(16); number_of_images=10000; sampling_rule=enumerate; random_seed=42.

## User comments:
- Generation role: Software/config source
- Purpose: Defines the second controlled generation run for another set of shape classes.
- Important fields: image_size, output_prefix, output_type, shape_values, fixed_scale, fixed_position, fixed_rotation, fixed_grey, file_naming_rule, source_run_id, generation_config_id
