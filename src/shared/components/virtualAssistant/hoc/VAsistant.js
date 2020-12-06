import React from 'react';
import Artyom from '../../../../lib/artyom';
import VAService from '../VAService';
const VirtualAssistant = new Artyom();
const withVA = (WrappedComponent) => {
	return class VA extends React.Component {
		constructor(props) {
			super(props);
			this.state = {
				artyomActive: false,
				recognizedText: '',
			};
			window.VirtualAssistant = VirtualAssistant;
			this.vs = new VAService(VirtualAssistant);
			this.vs.injectCommands();
			this.vs.setRecognitionCB((recognized, isFinal) => {
				console.log(isFinal);
				isFinal &&
					this.setState({
						recognizedText: recognized,
					});
			});
			this.vs.onError((error) => {
				console.error(error);
			});
			this.vs.preferFemaleVoice();
		}
		handleStop = async (e) => {
			await this.vs.stop();
			console.log('Artyom succesfully stopped');
			this.setState({
				artyomActive: false,
			});
		};
		handleInitiate = async (e) => {
			await this.vs.start();
			console.log('VirtualAssistant succesfully initialized');
			this.setState({
				artyomActive: true,
			});
		};
		render() {
			return (
				<WrappedComponent
					{...this.props}
					{...this.state}
					startVA={this.handleInitiate}
					stopVA={this.handleStop}
					VA={this.vs}
				/>
			);
		}
	};
};
export default withVA;
