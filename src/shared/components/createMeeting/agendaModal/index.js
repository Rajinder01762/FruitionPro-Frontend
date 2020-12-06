/* eslint-disable jsx-a11y/alt-text */
import React, { Component } from 'react';
import {
	Dropdown,
	DropdownToggle,
	DropdownMenu,
	DropdownItem,
	Label,
	Input,
	Modal,
	ModalHeader,
	ModalBody,
	FormGroup,
	Row,
	Col,
} from 'reactstrap';
import { onFileUpload } from '../../../util/fileUpload';
import Select from 'react-select';
import DocxIcon from '../../../../asset/images/icons/docx-icon.svg';
import DocIcon from '../../../../asset/images/icons/doc-icon.svg'
import PDFIcon from '../../../../asset/images/icons/pdf-icon.svg';
import Edit from '../../../icons/moreIcon';
import PlusIcon from '../../../../asset/images/icons/PlusIcon.png';
import Loader from 'react-loader-spinner';
import AgendaNotes from './agenda-notes';
import MsgModal from '../../../util/index';
import moment from 'moment';
// eslint-disable-next-line no-unused-vars
import momentTimezone from 'moment-timezone';

export default class AddAgendaComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			openDropdownValue: '',
			isOpenDeleteMode: false,
			agendaTitle: '',
			agendaDuration: '',
			agendaDocuments: [],
			agendaNotes: '',
			agendaErrors: {
				agendaTitle: false,
				agendaDocuments: false,
				agendaDuration: false,
				agendaNotes: false,
			},
			isUploading: false,
			isUpdate: false,
			agendaTask: null,
			_id: '',
		};
		this.agendaNotesRef = React.createRef();
		this.toggle = this.toggle.bind(this);
	}

	toggle(value) {
		this.setState((prevState) => ({
			isOpenDeleteMode: !prevState.isOpenDeleteMode,
			openDropdownValue: value,
		}));
	}
	componentDidMount() {
		const { agendaData, isUpdateAgenda } = this.props;

		if (agendaData) {
			this.setState({
				agendaTitle: agendaData.title,
				agendaDuration: agendaData.duration || '',
				agendaDocuments: agendaData.documents,
				agendaNotes: agendaData.notes,
				isUpdate: isUpdateAgenda,
				agendaTask: {
					decisions: agendaData.decisions,
					notes: agendaData.notes,
					tasks: agendaData.tasks,
				},
				_id: agendaData._id,
			});
		}
	}

	// static getDerivedStateFromProps(nextProps, prevState) {
	//   const { agendaData, isUpdateAgenda } = nextProps;

	//   if (
	//     agendaData &&
	//     agendaData.title !== prevState.agendaTitle &&
	//     (agendaData.duration === "" || agendaData.duration) !==
	//       prevState.agendaDuration &&
	//     agendaData.documents &&
	//     (agendaData.documents.length === 0 ||
	//       agendaData.documents.length !== prevState.agendaDocuments.length)
	//   ) {
	//     return {
	//       agendaTitle: agendaData.title,
	//       agendaDuration: agendaData.duration || prevState.agendaDuration,
	//       agendaDocuments: agendaData.documents,
	//       agendaNotes: agendaData.notes,
	//       isUpdate: isUpdateAgenda,
	//       agendaTask: {
	//         decisions: agendaData.decisions,
	//         notes: agendaData.notes,
	//         tasks: agendaData.tasks
	//       },
	//       _id: agendaData._id
	//     };
	//   }
	//   return prevState;
	// }

	handleAddAgendaDocument = (e) => {
		const { agendaDocuments } = this.state;
		if(e && e.target && e.target.files){
			const fileName =
		e.target.files && e.target.files[0] && e.target.files[0].name;
		let type = "";
		if (e.target.files[0].type === "application/pdf") {
		  type = "pdf";
		} else if (
		  e.target.files[0].type ===
		  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
		) {
		  type = "docx";
		} else if (e.target.files[0].type === "application/msword") {
		  type = "doc";
		}

		let agendaDocIndex = -1;
		if (agendaDocuments && agendaDocuments.length > 0) {
			agendaDocIndex = agendaDocuments.findIndex(
				(doc) => doc.name === fileName
			);
		}
		if (agendaDocIndex < 0) {
			const { agendaErrors } = this.state;
			this.setState({
				isUploading: true,
				agendaErrors: { ...agendaErrors, agendaDocuments: false },
			});
			onFileUpload(e.target.files[0]).then((res) => {
				if (res) {
					const { agendaDocuments } = this.state;
					const newData = [...agendaDocuments];
					newData.push({ url: res, name: fileName, type });
					this.setState({ agendaDocuments: newData, isUploading: false });
				}
			});
		} else {
			MsgModal(400, 'Document already added');
		}
		}
	};

	handleDelete = (document) => {
		const { agendaDocuments } = this.state;
		let oldDocuments = [...agendaDocuments];
		const deleteIndex = oldDocuments.findIndex(
			(item) => item.url === document.url
		);
		if (deleteIndex > -1) {
			oldDocuments.splice(deleteIndex, 1);
			this.setState({
				agendaDocuments: oldDocuments,
				openDropdownValue: '',
				isOpenDeleteMode: false,
			});
		}
	};

	addAgenda = () => {
		const {
			setAgendaItems,
			modaltoggle,
			agendaData,
			updateAgendaItem,
			isCreate,
			canEdit,
			oldMeetingData,
		} = this.props;
		const {
			agendaTitle,
			agendaDocuments,
			agendaDuration,
			isUpdate,
			_id,
		} = this.state;
		let error = false;
		const agendaErrors = {
			agendaTitle: false,
			agendaDocuments: false,
			agendaDuration: false,
			agendaNotes: false,
		};
		let agendaTasks = {};

		if (this.agendaNotesRef.current) {
			agendaTasks = this.agendaNotesRef.current.state;
			agendaTasks.tasks.forEach((element, i) => {
				if (
					element.assign_to === '' &&
					element.due_date === '' &&
					element.task === ''
				) {
					agendaTasks.tasks.splice(i, 1);
				}
				if (
					element.assign_to.length !== 0 &&
					element.due_date &&
					element.task === ''
				) {
					error = true;
				}
				// if(element.task){
				//   if(element.assign_to.length === 0 || !element.due_date){
				//     error=true;
				//   }
				// }else{
				// const todayDate = new Date();
				// let date = new Date(element.due_date);
				if (element.assign_to.length > 0 || element.due_date) {
					if (element.task === '') {
						error = true;
					}
				}
				if (element.task) {
					if (element.assign_to.length === 0 || !element.due_date) error = true;
				}
				// if (todayDate > date) {
				//   error = true;
				// }
				element.time_zone = moment.tz.guess(true);
				//}
			});
		}

		if (agendaTitle === '') {
			// if (agendaData) {
			//   modaltoggle()
			//   this.resetState()
			// }
			// else {
			agendaErrors.agendaTitle = true;
			error = true;
		}

		// if (agendaDocuments.length === 0) {
		//   agendaErrors.agendaDocuments = true
		//   error = true;
		// }
		// if (agendaDuration === '') {
		//   agendaErrors.agendaDuration = true
		//   error = true;
		// }
		// if (agendaNotes === '') {
		//   agendaErrors.agendaNotes = true
		//    error = true;
		// }
		this.setState({ agendaErrors });
		if (!error) {
			const payload = {
				title: agendaTitle,
				documents: agendaDocuments,
				duration: agendaDuration,
				// notes: agendaNotes,
				agendaId: isUpdate ? agendaData.agendaId : Date.now(),
			};

			if (isUpdate) {
				updateAgendaItem({ ...payload, ...agendaTasks, _id });
			} else {
				if (!isCreate && canEdit) {
					const data = {
						...payload,
						...agendaTasks,
					};
					console.log('datadata', data, oldMeetingData);

					setAgendaItems(data);
				} else {
					setAgendaItems(payload);
				}
			}
			modaltoggle(this.resetTaskState, !error);
			this.resetState();
		}
		//}
	};
	resetTaskState = () => {
		if (this.agendaNotesRef.current && this.agendaNotesRef.current.resetState) {
			this.agendaNotesRef.current.resetState();
		}
	};
	resetState = () => {
		this.setState({
			openDropdownValue: '',
			isOpenDeleteMode: false,
			agendaTitle: '',
			agendaDuration: '',
			agendaDocuments: [],
			// agendaNotes: '',
			agendaErrors: {
				agendaTitle: false,
				agendaDocuments: false,
				agendaDuration: false,
				agendaNotes: false,
			},
			isUploading: false,
			isUpdate: false,
			agendaTask: null,
		});
		if (this.agendaNotesRef.current && this.agendaNotesRef.current.resetState) {
			this.agendaNotesRef.current.resetState();
		}
	};

	render() {
		const {
			agendaTitle,
			agendaDuration,
			agendaDocuments,
			agendaErrors,
			openDropdownValue,
			isOpenDeleteMode,
			isUploading,
			agendaTask,
		} = this.state;
		const {
			isOpen,
			modaltoggle,
			canEdit,
			isCreate,
			contacts,
			participants,
			isReadyToStart,
			status,
			meetingStatus,
			userDetails,
		} = this.props;
		console.log('jfjhgjfjfjhgjdfgjf', canEdit);
		const TimeDuration = [
			{ value: 5, label: '5 Minutes' },
			{ value: 10, label: '10 Minutes' },
			{ value: 15, label: '15 Minutes' },
			{ value: 20, label: '20 Minutes' },
			{ value: 25, label: '25 Minutes' },
			{ value: 30, label: '30 Minutes' },
			{ value: 35, label: '35 Minutes' },
			{ value: 40, label: '40 Minutes' },
			{ value: 45, label: '45 Minutes' },
			{ value: 50, label: '50 Minutes' },
			{ value: 55, label: '55 Minutes' },
			{ value: 60, label: '60 Minutes' },
		];
		return (
			<Modal
				onClosed={this.resetState}
				isOpen={isOpen}
				toggle={() => modaltoggle(this.resetTaskState)}
				className="create-meeting-modal account-form-screen add-agenda-screen"
			>
				<ModalHeader toggle={() => modaltoggle(this.resetTaskState)}>
					{canEdit ? (
						<div>
							Agenda Details<span onClick={this.addAgenda}>Save</span>
						</div>
					) : (
						<div>
							Agenda Details<span></span>
						</div>
					)}
				</ModalHeader>
				<ModalBody>
					<FormGroup>
						<Label for="" className="required">
							Agenda
						</Label>
						<Input
							disabled={!canEdit || meetingStatus === 'close'}
							value={agendaTitle}
							onChange={(e) =>
								this.setState({
									agendaTitle: e.target.value,
									agendaErrors: { ...agendaErrors, agendaTitle: false },
								})
							}
							type="text"
							placeholder="Enter Agenda"
						/>

						{agendaErrors.agendaTitle && (
							<span className="text-danger">Please enter agenda</span>
						)}
					</FormGroup>
					<Row>
						<Col md="6">
							<div className="documentAdd">
								<div className="upload-pdf">
									{canEdit && (
										<Label>
											Add Document
											<input
												onChange={(e)=>this.handleAddAgendaDocument(e)}
												// accept="application/pdf"
												accept="application/pdf,application/msword,
												application/vnd.openxmlformats-officedocument.wordprocessingml.document"
												type="file"
												disabled={meetingStatus === 'close'}
											/>
											<img src={PlusIcon} alt=""/>
										</Label>
									)}
								</div>
								<ul className="list-inline document-upload">
									{agendaDocuments &&
										agendaDocuments.length > 0 &&
										agendaDocuments.map((document) => {
											return (
												<li>
													<Label>
														<div className="doc-content">
															<a download href={document.url} target="_blank">
																<img src={
																		document.type === "pdf"
																		? PDFIcon
																		: document.type === "docx"
																		? DocxIcon
																		: DocIcon
																	} alt="" />
																<p title={document.name}>{document.name}</p>
															</a>
														</div>

														{canEdit && meetingStatus !== 'close' && (
															<Dropdown
																isOpen={
																	isOpenDeleteMode &&
																	document.url === openDropdownValue
																}
																toggle={() => this.toggle(document.url)}
																className="edit-icon"
															>
																<DropdownToggle>
																	<Edit />
																</DropdownToggle>
																<DropdownMenu>
																	<DropdownItem
																		onClick={() => this.handleDelete(document)}
																	>
																		Delete
																	</DropdownItem>
																</DropdownMenu>
															</Dropdown>
														)}
													</Label>
												</li>
											);
										})}
									{isUploading && (
										<li>
											<div className="doc-content">
												<span style={{ textAlign: 'center' }}>
													<Loader
														type="TailSpin"
														color="#00BFFF"
														height={60}
														width={60}
													/>
													Uploading...
												</span>
											</div>
										</li>
									)}
								</ul>
							</div>
						</Col>
						{(agendaDuration || canEdit) && (
							<Col md="6">
								<FormGroup>
									{/* <Label for="time">Enter Minutes</Label>
                  <Input type="text" onChange={(e) => {
                    if(e && e.target.value >= 0) {
                      this.setState({
                        agendaDuration: e.target.value,
                        agendaErrors: { ...agendaErrors, agendaDuration: false }
                      })
                    }
                  }} disabled={!canEdit || meetingStatus === 'close'} className="form-control" value={agendaDuration.value || agendaDuration} placeholder="Enter minutes" name="agendaDuration" /> */}
									<Label for="time">Time Duration</Label>
									<Select
										isDisabled={!canEdit || meetingStatus === 'close'}
										value={agendaDuration}
										Prefix
										onChange={(value) =>
											this.setState({
												agendaDuration: value,
												agendaErrors: {
													...agendaErrors,
													agendaDuration: false,
												},
											})
										}
										options={TimeDuration}
										className="department-select"
										classNamePrefix="department"
										placeholder="Select time duration"
									/>
								</FormGroup>
								{/* {agendaErrors.agendaDuration && (
                <span className="text-danger">
                  Please select agenda duration
                </span>
              )} */}
							</Col>
						)}
					</Row>
					{/* <div className="modal-notes">
            <Label>Notes</Label>
            <textarea
              disabled={!canEdit}
              value={agendaNotes}
              onChange={e => this.setState({ agendaNotes: e.target.value })}
            ></textarea>
          </div> */}
					{((!isCreate && canEdit && status === 'started') ||
						(!isCreate && !canEdit && status === 'started')) && (
						<AgendaNotes
							agendaTask={agendaTask}
							paricipants={participants}
							contacts={contacts}
							ref={this.agendaNotesRef}
							canEdit={canEdit}
							meetingStatus={meetingStatus}
							userDetails={userDetails}
						/>
					)}
				</ModalBody>
			</Modal>
		);
	}
}
