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
