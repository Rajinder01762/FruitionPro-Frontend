import React, { Component } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Table,
  Input,
  FormGroup,
  Label,
} from "reactstrap";
import { backendUrl } from "../../../api";
import DatePicker from "react-datepicker";
import moment from "moment";
const downloadZipFile = (obj) => {
  const { filename, directory, responseTime } = obj;
  setTimeout(() => {
    fetch(`${backendUrl}user/download-zip-file`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Operation: "public",
      },
      body: JSON.stringify({
        filename,
        directory,
      }),
    })
      .then((res) => {
        return res.blob();
      })
      .then((file) => {
        const newBlob = new Blob([file], { type: "application/zip" });
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
        link.download = `${filename || "backUp"}.zip`;
        link.click();
        setTimeout(() => {
          // For Firefox it is necessary to delay revoking the ObjectURL
          document.body.removeChild(link);
          // link.remove();
          window.URL.revokeObjectURL(data);
        }, 100);
      });
  }, responseTime * 5000);
};

export default class DownloadSummary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      from: new Date(),
      to: new Date(),
      download: false,
      downloadType: "all",
    };
  }

  onHandleClick = (accountStatus, boolean) => {
    const {
      setDeleteOrDeactivateAccount,
      userDetails,
      userId,
      isToggle,
      toggleDeleteTypeModal,
      setUserAccountStatus,
    } = this.props;
    const { downloadType, from, to } = this.state;

    const obj = {
      type: accountStatus,
      email: (userDetails && userDetails.email) || "",
      isDownload: boolean,
      id: userId || "",
    };
    if (downloadType === "selected") {
      obj.from = from;
      obj.to = to;
    }
    setDeleteOrDeactivateAccount(obj).then((result) => {
      const { status, data } = result.payload.data;
      if (status === 200) {
        if (data && data.responseTime && data.responseTime > 0) {
          if (boolean === true) {
            downloadZipFile(data);
          }
        }
        setUserAccountStatus({ userId, accountStatus });
      }
      toggleDeleteTypeModal();
      isToggle();
    });
  };
  toggleDownload = (e) => {
    e.preventDefault();
    this.setState({
      download: !this.state.download,
    });
  };
  onDateChange = (date, type) => {
    let data = moment.utc(date).toDate();
    data.setHours(0);
    data.setMinutes(0);
    data.setSeconds(0);
    data.setMilliseconds(0);
    this.setState({
      [type]: data,
    });
  };
  setDownloadType = (e, type) => {
    this.setState({
      downloadType: type,
    });
  };
  render() {
    const { isOpen, isToggle, status } = this.props;
    const { from, to, download, downloadType } = this.state;

    return (
      <Modal isOpen={isOpen} toggle={isToggle} className="deleteModal">
        <ModalHeader toggle={isToggle}>Downloads</ModalHeader>
        <ModalBody>
          {!download && (
            <div>
              <h2>
                {status === "deactivate"
                  ? "Do you want to Deactivate your account? All your records will be saved in our database."
                  : "Do you want to Delete your account? All your records will be deleted from our database."}
              </h2>
              <div className="text-center license-download-btn">
                <Button
                  onClick={this.toggleDownload}
                  color="gradient"
                  className="no-arrow mx-2"
                >
                  Download Backup
                </Button>
                <Button
                  onClick={() => this.onHandleClick(status, false)}
                  color="gradient"
                  className="no-arrow mx-2"
                >
                  Delete Anyway
                </Button>
              </div>
            </div>
          )}

          {download && (
            <div>
              <div>
                <FormGroup>
                  <h3 className="data-title">Download Data:</h3>
                  <div className="download-radio-btn">
                    <FormGroup check className="mt-2">
                      <Label>
                        <Input
                          type="radio"
                          onChange={(e) => this.setDownloadType(e, "all")}
                          checked={downloadType === "all" ? true : false}
                        />
                        For All Past Meetings
                      </Label>
                    </FormGroup>
                    <FormGroup check className="mt-2">
                      <Label>
                        <Input
                          type="radio"
                          onChange={(e) => this.setDownloadType(e, "selected")}
                          checked={downloadType === "selected" ? true : false}
                        />
                        <div className="d-flex justify-content-between align-items-center">
                          <FormGroup>
                            <Label>From:</Label>
                            <DatePicker
                              selected={from}
                              onChange={(date) =>
                                this.onDateChange(date, "from")
                              }
                              maxDate={new Date()}
                              dateFormat="MMMM d, yyyy"
                              popperPlacement="left"
                            />
                          </FormGroup>
                          <FormGroup>
                            <Label>To:</Label>
                            <DatePicker
                              selected={to}
                              maxDate={new Date()}
                              minDate={from}
                              onChange={(date) => this.onDateChange(date, "to")}
                              dateFormat="MMMM d, yyyy"
                              popperPlacement="left"
                            />
                          </FormGroup>
                        </div>
                      </Label>
                    </FormGroup>
                  </div>
                </FormGroup>
              </div>
              <div className="text-center">
                <Button
                  onClick={() => this.onHandleClick(status, true)}
                  color="gradient"
                  className="no-arrow px-3"
                >
                  Download Now
                </Button>
              </div>
            </div>
          )}

          {status === "deactivate" && !download && (
            <p className="bottomText text-center mb-0 mt-3">
              You can reactivate your account any time by buying a new License.{" "}
            </p>
          )}
        </ModalBody>
      </Modal>
    );
  }
}
