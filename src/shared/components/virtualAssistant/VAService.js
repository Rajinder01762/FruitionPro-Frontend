export default function VAService(instance) {
	this.instance = instance;
}
VAService.prototype.say = function (speech) {
	let VA = this.instance;
	VA.say(speech);
};
VAService.prototype.start = async function () {
	let VA = this.instance;
	try {
		await VA.initialize({
			lang: 'en-GB',
			continuous: true,
			soundex: true,
			debug: true,
			speed: 0.8,
			mode: 'normal',
			listen: true,
			obeyKeyword: 'listen to me',
		});
	} catch (err) {
		console.log('Failed to start VA :(');
	}
};
VAService.prototype.stop = async function () {
	let VA = this.instance;
	try {
		await VA.fatality();
	} catch (err) {
		console.log('Could not start the VA :(');
	}
};
VAService.prototype.preferFemaleVoice = function () {
	let VA = this.instance;
	VA.ArtyomVoicesIdentifiers['en-GB'] = [
		'Google UK English Female',
		'Google UK English Male',
		'en-GB',
		'en_GB',
	];
};
VAService.prototype.onError = function (cb) {
	let VA = this.instance;
	VA.when('ERROR', cb);
};
VAService.prototype.setRecognitionCB = function (cb) {
	let VA = this.instance;
	VA.redirectRecognizedTextOutput(cb);
};
VAService.prototype.sayRandom = function (speech) {
	let VA = this.instance;
	VA.sayRandom(speech);
};
VAService.prototype.injectCommands = function () {
	let VA = this.instance;
	const commands = this.getCommands(VA)();
	VA.addCommands([...commands.general]);
};
VAService.prototype.die = function () {
	let VA = this.instance;
	VA.fatality();
};
VAService.prototype.restart = function () {
	let VA = this.instance;
	return VA.restart();
};
VAService.prototype.getCommands = function () {
	let VA = this.instance;
	return function () {
		return {
			general: [
				{
					description: 'Restarts VA with the initial configuration',
					indexes: ['Restart yourself', 'Shutdown'],
					action: async (i) => {
						if (i === 0) {
							await this.restart();
							this.say('Succesfully restarted sir');
						} else if (i === 1) {
							this.die();
							this.say('Goodbye sir');
						}
					},
				},
				{
					description: 'General talks',
					indexes: [
						'Hello',
						'How are you?',
						'Who are you?',
						'How many meetings are scheduled today?',
					],
					action: (i) => {
						switch (i) {
							case 0:
								this.sayRandom([
									'Good Morning',
									'Hey, good to see you again',
									"I don't have anything to say today",
									"Did you remember that I didn't say nothing yesterday? Well, today I dont want neither.",
								]);
								break;
							case 1:
								this.say('I am good, How about you ?');
								break;
							case 2:
								this.say('I am Olivia, your friend from Frution pro.');
								break;
							case 3:
								this.say('Boss, you have five scheduled meetings for today.');
								break;
							default:
								this.say('pardon!');
						}
					},
				},
			],
		};
	}.bind(this);
};
