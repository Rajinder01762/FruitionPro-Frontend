import { backendUrl } from "../../api";

export const handlePdfDownload = (html, name) => {
  const file_name = name.replace(/[^A-Z0-9]+/gi, "_");
  // generatePdf({ html, file_name})
  const body = {
    html: html,
    file_name,
  };
  fetch(`${backendUrl}meeting/pdf`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Operation: "public" },
    body: JSON.stringify(body),
  })
    .then((res) => {
      return res.blob();
    })
    .then((file) => {
      const newBlob = new Blob([file], { type: "application/pdf" });
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(newBlob);
        return;
      }
      // For other browsers:
      // Create a link pointing to the ObjectURL containing the blob.
      const data = window.URL.createObjectURL(newBlob);
      const link = document.createElement("a");
      document.body.appendChild(link);
      link.href = data;
      link.download = `${file_name}.pdf`;
      link.click();

      setTimeout(function () {
        // For Firefox it is necessary to delay revoking the ObjectURL
        document.body.removeChild(link);
        // link.remove();
        window.URL.revokeObjectURL(data);
      }, 100);
    });
};
// export const handleDocDownload = (html, file_name) => {
//   const header =
//     "<html xmlns:o='urn:schemas-microsoft-com:office:office' " +
//     "xmlns:w='urn:schemas-microsoft-com:office:word' " +
//     "xmlns='http://www.w3.org/TR/REC-html40'>" +
//     "<head><meta charset='utf-8'><title>Minutes of Meeting</title></head><body>";
//   const footer = "</body></html>";
//   const sourceHTML = header + html + footer;
//   const source =
//     "data:application/vnd.ms-word;charset=utf-8," +
//     encodeURIComponent(sourceHTML);

//   const fileDownload = document.createElement("a");
//   document.body.appendChild(fileDownload);
//   fileDownload.href = source;
//   fileDownload.download = `${file_name}.docx`;
//   fileDownload.click();
//   document.body.removeChild(fileDownload);
// };
export const handleDocDownload = (element, filename) => {
  const header =
    "<html xmlns:o='urn:schemas-microsoft-com:office:office' " +
    "xmlns:w='urn:schemas-microsoft-com:office:word' " +
    "xmlns='http://www.w3.org/TR/REC-html40'>" +
    "<head><meta charset='utf-8'><title>Minutes of Meeting</title></head><body>";
  const footer = "</body></html>";

  var html = header + element + footer;

  var blob = new Blob(["\ufeff", html], {
    type: "application/msword",
  });

  // Specify link url
  var url =
    "data:application/vnd.ms-word;charset=utf-8," + encodeURIComponent(html);

  // Specify file name
  filename = filename ? filename + ".docx" : "document.docx";

  // Create download link element
  var downloadLink = document.createElement("a");

  document.body.appendChild(downloadLink);

  if (window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveOrOpenBlob(blob, filename);
  } else {
    // Create a link to the file
    downloadLink.href = url;

    // Setting the file name
    downloadLink.download = filename;

    //triggering the function
    downloadLink.click();
  }

  document.body.removeChild(downloadLink);
};
