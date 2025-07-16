# File Upload/Download Test Document

## Overview
This document demonstrates the new file upload and download capabilities in the Paper editor.

## Features

### Upload Support
The Paper editor now supports uploading files in the following formats:
- **Markdown** (.md, .markdown) - Loaded as-is
- **Text** (.txt) - Converted to markdown with proper paragraph handling
- **Word** (.docx) - Converted to markdown preserving formatting

### Download Support
- Click the 💾 Download button to save your work as a `.md` file
- The filename is automatically generated from your document title

## How to Use

1. **Upload a File**:
   - Click the 📄 Upload button in the editor header
   - Select a `.md`, `.txt`, or `.docx` file
   - The content will be loaded into the editor
   - For new documents, the title is extracted from the filename

2. **Download Your Work**:
   - Click the 💾 Download button
   - Your markdown will be saved with the document title as the filename
   - If untitled, it will save as "untitled.md"

## Technical Details

### Word Document Conversion
- Uses the `mammoth` library to extract content from .docx files
- Converts Word formatting to HTML
- Uses `turndown` to convert HTML to clean markdown
- Preserves:
  - Headings
  - Bold and italic text
  - Lists (bullet and numbered)
  - Links
  - Tables
  - Images (as markdown image syntax)

### Text File Conversion
- Preserves paragraph breaks (double line breaks)
- Maintains single line breaks within paragraphs
- Special characters are preserved

## Example Content

Here's some formatted content to test download:

**Bold text**, *italic text*, and ***bold italic text***

### Lists

#### Unordered List
- First item
- Second item
  - Nested item
  - Another nested item
- Third item

#### Ordered List
1. First step
2. Second step
3. Third step

### Code
Inline `code` and code blocks:

```javascript
function testUpload() {
  console.log("File upload working!");
}
```

### Table
| Feature | Supported | Notes |
|---------|-----------|--------|
| Markdown | ✓ | Native support |
| Text | ✓ | Converted to markdown |
| Word | ✓ | Converted via mammoth |

### Image
![Test Image](https://via.placeholder.com/400x200)

---

*Test the upload/download functionality with this file!*