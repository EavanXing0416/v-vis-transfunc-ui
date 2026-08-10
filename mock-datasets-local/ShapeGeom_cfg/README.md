# ShapeGeom_cfg README

## Metadata
- Dataset name: ShapeGeom_cfg
- Timestamp: 2026-08-10 12:33:36 BST
- Type: Physical
- Data object type: ImageGenConfig
- No. of data objects: 1
- Metadata: Image-generation config. changed_variables=(scale, size); shape_values=(circle, square, triangle, star, ellipse, pentagon, hexagon, rectangle, cross); fixed_variables=(shape, pos_x, pos_y, rotation, grey); image_size=(64,64); output_format=PNG; color_type=grey; background=white; background_grey=10; shape_cropping=False; shape_overlapping=False; variable_ranges=scale(0.2,0.8),size(0.2,0.8),pos_x(0.2,0.8),pos_y(0.2,0.8),rotation(0,180),grey(50,255); discretization_levels=scale(8),size(8),pos_x(8),pos_y(4),rotation(2),grey(16); number_of_images=10000; sampling_rule=enumerate; random_seed=42.

## User comments:
- Generation role: Software/config source
- Purpose: Defines the controlled generation recipe for a geometry-varied image dataset where two geometry-related variables are changed together.
- Important fields: image_width, image_height, output_prefix, output_type, scale_values, size_values, fixed_shape, fixed_position, fixed_rotation, fixed_grey, file_naming_rule, source_run_id, generation_config_id
