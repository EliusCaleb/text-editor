## Creating a rich text editor using react and react-quill.

When developing websites, one crucial requirement is implementing a rich text editor. It plays a vital role in allowing users to create engaging content such as blog posts and web pages that incorporate various formatting options and the ability to insert images. By integrating a rich text editor into your web application, you provide users with an intuitive interface that fosters creativity and enhances the overall user experience.

With the presence of many options, it may be tricky to implement one that may be stuck with what option to go for since most of them come with their trade-offs.

# React Quill
React Quill is a popular rich text editor component for React applications. It is built on top of the Quill.js library, which provides a flexible and customizable editor for creating and editing rich text content. React Quill allows developers to easily incorporate a feature-rich text editor into their React projects.

# Getting Started.

For this tutorial it is advisable to be familiar with;

Javascript
React.js
Node.js installed on the local machine


#  Adding react-quill to react-application
We are going to start by adding dependencies to our react application using yarn or npm. I am going to use yarn in this case.

npm i react-quill

#  Initial Setup

import "./editor.css";

const Editor = () => {
  return (
    <div className='wrapper'>
      <label className='label'>Editor Content</label>
    </div>
  );
};

export default Editor;

/* components/editor.css */

.wrapper {
    padding: 2rem 3rem;
}
  
.label {
      font-size: 1rem;
      font-weight: 500;
}


##  Adding react-quill
We are going to import the editor from the package and which comes with styles that we can import via import ‘react-quill/dist/quill.snow.css’ and reference the theme via the theme property.

The editor offers a value that is always in HTML format property that holds the current value of the editor and an onChange method that is triggered each time the input changes returning the new value. So we shall then create a state that will hold the value for the editor and update it each time the user types in the editor.

import { useState } from "react";
import "./editor.css";
import QuillEditor from "react-quill";

const Editor = () => {
  return (
    <div className='wrapper'>
      <label className='label'>Editor Content</label>
       <QuillEditor
        className='editor'
        theme="snow"
        value={value}
        onChange={(value) => setValue(value)}
         />
    </div>
  );
};

export default Editor;

/* components/editor.css */

.wrapper {
  padding: 2rem 3rem;
}

.label {
  font-size: 1rem;
  font-weight: 500;
}

.editor {
  margin-top: 1rem;
  height: 500px;
}


With this, we have a basic rich text editor that supports h1 — h3, p, ol ul, bolding, and italics.

Finally, let’s add a button that will log the current value of the editor once it is clicked.


// components/Editor/main.js

// Importing helper modules
import { useState } from "react";

// Importing core components
import QuillEditor from "react-quill";

// Importing styles
import  "./editor.css";
import "react-quill/dist/quill.snow.css";

const Editor = () => {
  // Editor state
  const [value, setValue] = useState("");

  // Handler to handle button clicked
  function handler() {
    console.log(value);
  }

  return (
    <div className='wrapper'>
      <label className='label'>Editor Content</label>
      <QuillEditor
        className='editor'
        theme="snow"
        value={value}
        onChange={(value) => setValue(value)}
      />
      <button onClick={handler} className='btn'>
        Submit
      </button>
    </div>
  );
};

export default Editor;

## Extending formatting options.

We have realized that the default editor is kind of minimalistic and limited when it comes to formatting options, but we can go ahead and change that with the help of formats and modules.

Formats in react-quill represent the various styles and formatting options that can be applied to the text. These include options such as bold, italic, underline, strikethrough, alignment, bullet lists, and numbered lists. Formats define the visual appearance of the text and how it is rendered in the editor. These are defined as an array ;

const formats = ["header","bold","italic","underline","strike","blockquote",
    "list","bullet","indent","link","image","color","clean",
  ];
Modules offer additional features or plugins that can be added to enhance the functionality of the react-quill editor. Modules provide extended capabilities beyond basic text formatting. Examples of modules react-quill include a toolbar, clipboard, keyboard, history, and image handling. These modules allow you to customize and extend the editor's behavior, enabling features such as image insertion, undo/redo functionality, keyboard shortcuts, etc. These are defined as an object;

const modules = {
      toolbar: {
        container: [
          [{ header: [2, 3, 4, false] }],
          ["bold", "italic", "underline", "blockquote"],
          [{ color: [] }],
          [
            { list: "ordered" },
            { list: "bullet" },
            { indent: "-1" },
            { indent: "+1" },
          ],
          ["link", "image"],
          ["clean"],
        ],
        handlers: {
          image: imageHandler,
        },
      },
      clipboard: {
        matchVisual: true,
      },
    }
container: Specifies the toolbar buttons to be displayed. It is an array of arrays where each sub-array represents a group of buttons. The provided configuration includes:
[{ header: [1, 2, 3, 4, false] }]: Displays the header dropdown with options for header levels 2, 3, 4, and no header.
["bold", "italic", "underline", "blockquote"]: Displays buttons for bold, italic, underline, and blockquote.
[{ color: [] }]: Displays the color dropdown for text color selection.
[{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }]: Displays buttons for an ordered list, bullet list, decrease indent, and increase indent.
["link", "image"]: Displays buttons for inserting a hyperlink and an image.
["clean"]: Displays a button to remove formatting.
handlers: Specifies custom handlers for toolbar buttons. In this case, it assigns the imageHandler function to the image button, allowing custom image handling.
clipboard: Configuration related to clipboard behavior. The provided configuration sets matchVisual to true, which means the clipboard content will match the visual format when pasted.

##  Adding An Image Handler

The image handler function will be responsible for listening for image upload, will generate an image URL, and inserting the image into our editor as an img element where src is the image URL.

const imageHandler = () => {
    // Create an input element of type 'file'
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    // When a file is selected
    input.onchange = () => {
      const file = input.files[0];
      const reader = new FileReader();

      // Read the selected file as a data URL
      reader.onload = () => {
        const imageUrl = reader.result;
        const quillEditor = quill.current.getEditor();

        // Get the current selection range and insert the image at that index
        const range = quillEditor.getSelection(true);
        quillEditor.insertEmbed(range.index, "image", imageUrl, "user");
      };

      reader.readAsDataURL(file);
    };
}


## Updated code:

   // components/Editor.js

// Importing styles
import { useCallback, useMemo, useRef, useState } from "react";
import QuillEditor from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./editor.css";

const Editor = () => {
  const [value, setValue] = useState("");
  const quill = useRef();

  const imageHandler = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    // When a file is selected
    input.onchange = () => {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        const imageUrl = reader.result;
        const quillEditor = quill.current.getEditor();

        // Get the current selection range and insert the image at that index
        const range = quillEditor.getSelection(true);
        quillEditor.insertEmbed(range.index, "image", imageUrl, "user");
      };

      reader.readAsDataURL(file);
    };
  }, []);

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [2, 3, 4, false] }],
          ["bold", "italic", "underline", "blockquote"],
          [{ color: [] }],
          [
            { list: "ordered" },
            { list: "bullet" },
            { indent: "-1" },
            { indent: "+1" },
          ],
          ["link", "image"],
          ["clean"],
        ],
        handlers: {
          image: imageHandler,
        },
      },
      clipboard: {
        matchVisual: true,
      },
    }),
    [imageHandler]
  );

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "color",
    "clean",
  ];
  function handler() {
    console.log(value);
  }

  return (
    <div>
      <div className="wrapper">
        <label className="label">Editor Content</label>
        <QuillEditor
          className="editor"
          theme="snow"
          formats={formats}
          modules={modules}
          value={value}
          onChange={(value) => setValue(value)}
        />

        <button onClick={handler} className="btn">
          Submit
        </button>
      </div>
    </div>
  );
};

export default Editor;

The image handler can be changed in several ways which may include uploading the image to an object storage service such as Amazon S3 rather than directly embedding the image into our editor which greatly reduces the size of the editor’s content.


##   Conclusion.
The result will always be in HTML format and this lets you save content as HTML files if the need arises.

