import React, { Component } from "react";
import Dropzone from "react-dropzone";
import CrossIcon from "../../../../icons/cross";
class AddDocument extends Component {
  onDrop = (files) => {
    this.props.handleFileChange(files);
  };

  deleteFile = (name) => () => {
    const newDocs = this.props.documents.filter((d) => d.name !== name);
    this.props.handleFileChange(newDocs);
  };

  render() {
    const files = this.props.documents.map((doc, index) => (
      <li key={doc.path}>
        {doc.name} {doc.size * 0.001}kb
        <div onClick={this.deleteFile(doc.name)}>
          <CrossIcon />
        </div>
      </li>
    ));

    return (
      <Dropzone
        onDrop={this.onDrop}
        accept={[
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "image/jpg",
          "image/png",
          "image/jpeg",
        ]}
      >
        {({ getRootProps, getInputProps }) => (
          <section className="container">
            <div {...getRootProps({ className: "dropzone" })}>
              <input {...getInputProps()} />
              <p>Drag 'n' drop some files here, or click to select files</p>
            </div>
            <aside>
              <h4>Files</h4>
              <ul>{files}</ul>
            </aside>
          </section>
        )}
      </Dropzone>
    );
  }
}

export default AddDocument;
