$('document').ready(function () {
	require(['composer/controls', 'composer/formatting'], function (controls, formatting) {
		$(window).on('action:composer.enhanced', (ev, { postContainer }) => {
			let composerTextarea;
			const btn = postContainer.find('[data-format="eyedropper"]')

			const colorInput = $(`<input
				type="color"
				class="m-0 p-0"
				style="visibility: hidden; width: 0; height: 0; border: 0;"
			>`);
			colorInput.insertAfter(btn);

			colorInput.on('input', function () {
				const start = composerTextarea.selectionStart;
				const end = composerTextarea.selectionEnd;
				composerTextarea.value = composerTextarea.value.slice(0, start) + this.value + composerTextarea.value.slice(end);

				// force preview to be updated
				$(composerTextarea).trigger('propertychange');

				composerTextarea.selectionStart = start;
				composerTextarea.selectionEnd = end;
			});

			formatting.addButtonDispatch('eyedropper', function (textarea, selectionStart, selectionEnd) {
				if (selectionStart === selectionEnd) {
					controls.insertIntoTextarea(textarea, '%(#000000)[Colored Text Here]');
					controls.updateTextareaSelection(textarea, selectionStart + 2, selectionStart + 9);
				} else {
					controls.wrapSelectionInTextareaWith(textarea, '%(#000000)[', ']');
					controls.updateTextareaSelection(textarea, selectionStart + 2, selectionStart + 9);
				}
				composerTextarea = textarea;
				colorInput.click();
			});
		});
	});
});
