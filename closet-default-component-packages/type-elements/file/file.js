'use babel';

const Mustache = require('mustache'),
	dress = require('dress'),
	$ = require('jquery'),
	TypeElement = require('../type-element'),
	AttributeUtils = require('../../../design-editor/src/utils/attribute-utils').default,
	Editor = require('../../../design-editor/src/editor').default,
	remote = require('remote'),
	dialog = window.atom && remote.require('dialog'),
	BrowserWindow = window.atom && remote.require('browser-window'),
	template = `<input id="fileChoose" type="file" class="inline-block closet-attr-file-file closet-attr-long-button"
	${Editor.isVSC() ? ' accept=".mp4, .mov, .flac, .aac"/>' : ' />'}
	<div id="fileInputChosen" style="display:none;">
	<input type="text" id="fileChosen" readonly="readonly" class="closet-attribute-common-textbox"/>
	<button id="fileInputClear" class="btn">Remove</button></div>`;

module.exports = dress.factory('closet-type-file', {

	defaults: {
		extension: []
	},

	events: {
		'click .closet-attr-file-btn': 'onClickFileBtn',
		'click #fileInputClear': 'onClearFileSource'
	},

	onReady: function () {
		const self = this;
		self.$el.html(Mustache.render(template, self.options));
		self.$el.find('.closet-attr-file-file').on('change', event => {
			if (event.target.files[0]['type'].match('audio.*|video.*')) {
				AttributeUtils.writeMediaFileWhenIsLoaded(event, (filePath) => {
					// set value to element and display text input with source path
					self.setValue(filePath);
					this.updateFileSourcePath(filePath);
				});
			} else {
				// @TODO it can be used for interactive3dModel
				self.setValue(URL.createObjectURL(event.target.files[0]));
			}
		});
	},

	onClearFileSource: function () {
		this.updateFileSourcePath();
	},

	updateFileSourcePath(sourcePath) {
		const inputFile = document.getElementById('fileChoose'),
			inputText = document.getElementById('fileChosen'),
			divConstrainInputText = document.getElementById('fileInputChosen');
		if (!sourcePath) {
			// display input type="file" because source doesn't given
			divConstrainInputText.style.display = 'none';
			inputFile.style.display = 'block';
			inputFile.value = '';
			inputFile.parentElement.setValue('');
		} else {
			// display input type="text" with source path
			divConstrainInputText.style.display = 'block';
			inputText.value = sourcePath;
			inputFile.style.display = 'none';
		}
	},

	onClickFileBtn: function () {
		const self = this,
			extensions = self.extension.length ? self.extension : ['*'],
			$blind = $('<div style="position:absolute;top:0px;left:0px;width:200%;height:200%;z-index:10000;"></div>');
		let parentWindow = null;
		$blind.appendTo(document.body);
		if (window.atom) {
			parentWindow = process.platform === 'darwin' ? null : BrowserWindow.getFocusedWindow();
			dialog.showOpenDialog(parentWindow, {
				title: 'Select file',
				filters: [
					{
						name: 'files',
						extensions: extensions
					}
				]
			}, (filePath) => {
				if (filePath) {
					self._setPath(filePath[0]);
				}
				$blind.remove();
			});
		}
	},

	_setPath : function (newPath) {
		// eslint-disable-next-line no-undef
		const pathToProjects = atom.project.relativizePath(newPath);
		if (pathToProjects[0] !== null) {
			newPath = pathToProjects[1];
		}
		this.$el.find('.closet-attr-file-btn').text(newPath);
		this.setValue(newPath);
	}

}, TypeElement);
