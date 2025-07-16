# Testing HTML Images in Paper Editor

## Markdown Image (standard)
![Sample Image](https://via.placeholder.com/300x200)

## HTML Images with Custom Dimensions

### Fixed Width
<img src="https://via.placeholder.com/600x400" alt="Fixed width image" width="400px" />

### Percentage Width
<img src="https://via.placeholder.com/800x600" alt="Responsive image" width="100%" />

### Fixed Dimensions
<img src="https://via.placeholder.com/1200x800" alt="Fixed size image" width="300px" height="200px" />

### Centered Image
<img src="https://via.placeholder.com/500x500" alt="Centered image" width="250px" style="display: block; margin: 0 auto;" />

### Float Left
<img src="https://via.placeholder.com/200x200" alt="Float left" width="150px" style="float: left; margin-right: 1em;" />

Lorem ipsum dolor sit amet, consectetur adipiscing elit. This text will wrap around the floated image. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

### Float Right
<img src="https://via.placeholder.com/200x200" alt="Float right" width="150px" style="float: right; margin-left: 1em;" />

Lorem ipsum dolor sit amet, consectetur adipiscing elit. This text will wrap around the floated image. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

## Clear floats
<div style="clear: both;"></div>

## Summary

The Paper editor now supports:
1. Standard markdown images: `![alt](url)`
2. HTML images with custom dimensions
3. Responsive images using percentage widths
4. Image alignment (left, center, right)
5. Floating images with text wrapping

Use the **Image (HTML)** option in the insert menu to add images with custom dimensions and styling!