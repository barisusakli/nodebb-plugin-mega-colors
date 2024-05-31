$('document').ready(function () {
	require(['composer', 'composer/controls', 'composer/preview'], function (composer, controls, preview) {
		$(window).on('action:composer.enhanced', (ev, { postContainer }) => {
			const textarea = postContainer.find('textarea');
			const btn = postContainer.find('[data-format="eyedropper"]')

			const attrs = {};
			$.each(btn[0].attributes, (idx, attr) => {
				attrs[attr.nodeName] = attr.nodeValue;
			});

			btn.replaceWith(function () {
				return $("<label />", attrs).append($(this).contents());
			});
			const label = postContainer.find('[data-format="eyedropper"]');
			const colorInput = $(`<input
				type="color"
				class="position-absolute m-0 p-0 start-0 opacity-0"
				style="bottom: 2px; width: 1px; height: 1px;"
			>`);
			label.append(colorInput);
			colorInput.on('change', function () {
				function updateSelection(start, end) {
					setTimeout(() => {
						controls.updateTextareaSelection(textarea[0], start, end);
					}, 100);
				}
				const hex = this.value;
				const start = textarea[0].selectionStart;
				const end = textarea[0].selectionEnd;
				if (start === end) {
					controls.insertIntoTextarea(textarea[0], `%(${hex})[Colored Text Here]`);
					updateSelection(start + 11, start + 28);
				} else {
					const len = end - start;
					controls.wrapSelectionInTextareaWith(textarea[0], `%(${hex})[`, ']');
					updateSelection(start + 11, start + 11 + len);
				}
				preview.render(postContainer);
			});
		});
	});
});
