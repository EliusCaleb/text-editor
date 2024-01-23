import { useState } from "react";
import QuillEditor from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./editor.css";

const Editor = () => {
  const [value, setValue] = useState("");
  return (
    <div>
      <div className="wrapper">
        <label className="label">Editor Content</label>
        <QuillEditor
          className='editor'
          theme="snow"
          value={value}
          onChange={(value) => setValue(value)}
        />
      </div>
    </div>
  );
};

export default Editor;
