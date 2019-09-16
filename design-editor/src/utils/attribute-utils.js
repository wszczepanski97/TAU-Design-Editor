// @ts-nocheck
'use babel';

import path from 'path';
import utils from './utils';
import pathUtils from './path-utils';
import {appManager as AppManager} from '../app-manager';

export default {
	
	readFile(event, callback) {
		const filesToUpdate = event.target.files;
		[].slice.call(filesToUpdate).forEach(file => {
			const reader = new FileReader();
			reader.addEventListener('loadend', event => {
				if (event.target.readyState === FileReader.DONE) {
					const
						filePath = path.join(this.checkFileType(filesToUpdate[0]['type']), file.name),
						writePath = pathUtils.createProjectPath(filePath);

					utils.checkGlobalContext('writeFile') (
						writePath,
						event.target.result, {
							encoding: 'binary'
						},
						() => {
							callback(filePath);
						}
					)
				}
			});
			reader.readAsBinaryString(file);
		});
	},
	/**
	 * Set a source to background image or image
	 * @param {Event} event
	 * @param {string} changedAttribute name of changed attribute
	 * @param {string} elementId id of changed element
	 * @param {function} changeAttributeInfo function that changed info about element in sidebar
	 */
	setAttributeSource(filePath, changedAttribute, elementId, changeAttributeInfo) {
		const getDEModel = AppManager.getActiveDesignEditor().getModel();
		if (changedAttribute === 'src') {
			getDEModel.updateAttribute(
				elementId,
				changedAttribute,
				filePath
			);
		} else {
			getDEModel.updateStyle(
				elementId,
				changedAttribute,
				`url("${filePath}")`
			);
		}
		changeAttributeInfo(filePath);
	},

	checkFileType(type) {
		let typeOfFile = type.substr(0, type.indexOf('/'));
		switch(typeOfFile) {
			case 'audio':
			case 'video':
				return typeOfFile;
			case 'image':
				return 'images';		
		}
	},

	copyToImagesForCoverFlow(event, count) {
		for (let i = 0; i < count; i++) {
			[].slice.call(event.target.files).forEach(file => {
				const reader = new FileReader();
				reader.addEventListener('loadend', event => {
					if (event.target.readyState === FileReader.DONE) {
						const
							filePath = path.join('images', file.name),
							writePath = pathUtils.createProjectPath(filePath);

						utils.checkGlobalContext('writeFile') (
							writePath,
							event.target.result, {
								encoding: 'binary'
							},
							() => {
							}
						);
					}
				});
				reader.readAsBinaryString(file);
			});
		}
	}

};
