'use babel';

var Mustache = require('mustache'),
    dress = require('dress'),
    $ = require('jquery'),
	TypeElement = require('../type-element'),
	AttributeUtils = require('../../../design-editor/src/utils/attribute-utils').default,
    remote = require('remote'),
    dialog = window.atom && remote.require('dialog'),
	BrowserWindow = window.atom && remote.require('browser-window'),
	

    TEMPLATE_ATOM = '<button class="inline-block btn closet-attr-file-btn' +
        ' closet-attr-long-button">{{value}}</button>',
    TEMPLATE_BRACKETS = '<input type="file" class="inline-block btn' +
        ' closet-attr-file-file closet-attr-long-button" />';

module.exports = dress.factory('closet-type-file', {

    defaults: {
        extension: []
    },

    events: {
		// 'change .closet-attr-file-file': 'setAttributeSource',
        'click .closet-attr-file-btn': 'onClickFileBtn'
    },

    onReady: function () {
        var self = this;
        if (window.atom) {
            self.$el.html(Mustache.render(TEMPLATE_ATOM, self.options));
        } else {
            self.$el.html(Mustache.render(TEMPLATE_BRACKETS, self.options));
            self.$el.find('.closet-attr-file-file').on('change', function (event) {
				if (event.target.files[0]['type'].match('audio.*|video.*')) {
					AttributeUtils.readFile(event, (filePath) => self.setValue(filePath));
					}
				// } else {
					// @TODO it can be used for interactive3dModel
				// }
			});
			// 		AttributeUtils.setAttributeSource(event,
			// 			'src',
			// 			this._selectedElementId);
					// // onCreated() {
					// // 	const self = this;
				
					// // 	$.get(path.join(AppManager.getAppPath().src, TEMPLATE_FILE), (template) => {
					// // 		self.$el.append(mustache.render(template, self._data));
					// // 		self.$el.find('[type=range]').on('change', this._onSliderValueChange.bind(this));
					// // 		self.$el.find('.closet-image-filter-btn').on('click', this._onPresetButtonClick.bind(this));
					// // 		self.$el.find('#srcImageFile').on('change', this._onSrcImageChange.bind(this));
					// // 		self.$el.find('#srcImageClear').on('click', this._onSrcImageClear.bind(this));
					// // 	});
					// // }
				
					// setData(element) {
					// 	this._targetImage = element;
					// 	this._selectedElementId = element.attr('data-id');
					// 	this._updatePanel();
					// }
				
					// // _updateImageSourcePath(sourcePath) {
					// // 	if (!sourcePath) {
					// // 		this.$el.find('#srcImageChoose').show();
					// // 		this.$el.find('#srcImageShow').hide();
					// // 		this.$el.find('#srcImageFile').val('');
					// // 	} else {
					// // 		this.$el.find('#srcImageChoose').hide();
					// // 		this.$el.find('#srcImageShow').show();
					// // 		this.$el.find('#srcImageValue').val(sourcePath);
					// // 	}
					// // }
				
					// // _setImageSourcePath() {
					// // 	const sourcePath = this._targetImage.attr('src');
					// // 	this._updateImageSourcePath(sourcePath);
					// // }
				
					// _onSrcImageChange(event) {
					// 	attributeUtils.setImageSource(event,
					// 		'src',
					// 		this._selectedElementId,
					// 		this._updateImageSourcePath.bind(this));
					// }
				
					// _onSrcImageClear() {
					// 	AppManager.getActiveDesignEditor().getModel()
					// 		.updateAttribute(this._selectedElementId, 'src', '');
					// 	this._updateImageSourcePath();
					// }
				// } else if (event.target.files[0].type.match('video.*')) {

				// } else {
				// 	// @TODO it can be used for interactive3dModel
				// 	self.setValue(URL.createObjectURL(event.target.files[0]));
				// }
            // });
        }
    },
	// setAttributeSource: function (event) {
	// 	if (event.target.files[0]['type'].match('audio.*|video.*')) {
	// 		AttributeUtils.setAttributeSource(event,
	// 			'src',
	// 			this._selectedElementId);
	// 	} else {
	// 		// @TODO it can be used for interactive3dModel
	// 		self.setValue(URL.createObjectURL(event.target.files[0]));
	// 	}
	// },

    onClickFileBtn: function () {
        var self = this,
            extensions = self.extension.length ? self.extension : ['*'],
            parentWindow = null,
            $blind = $('<div style="position:absolute;top:0px;left:0px;width:200%;height:200%;z-index:10000;"></div>');

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
            }, function (filePath) {
                if (filePath) {
                    self._setPath(filePath[0]);
                }
                $blind.remove();
            });
        }
    },

    _setPath : function (newPath) {
        var pathToProjects = atom.project.relativizePath(newPath);
        if (pathToProjects[0] !== null) {
            newPath = pathToProjects[1];
        }
        this.$el.find('.closet-attr-file-btn').text(newPath);
        this.setValue(newPath);
    }

}, TypeElement);
