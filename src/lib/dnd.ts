// baaskood: https://www.sveltelab.dev/xzz3zkyjzwe6kfk
export function draggable(node: any, data: string) {
	let state = data; // üldiselt on tile id

	node.draggable = true;
	node.style.cursor = 'grab';

	function handle_dragstart(e: DragEvent) {
		if (!e.dataTransfer) return;
		if (!node.draggable) return;
		e.dataTransfer.setData('text/plain', state);
	}

	function disable() {
		node.draggable = false;
		node.style.cursor = 'default';
	}

	node.addEventListener('dragstart', handle_dragstart);
	document.querySelector('#end-round')!.addEventListener('click', disable);

	return {
		update(data: string) {
			state = data;
		},

		destroy() {
			node.removeEventListener('dragstart', handle_dragstart);
			document.querySelector('#end-round')!.addEventListener('click', disable);
		}
	};
}

export function dropzone(node: any, options: any) {
	let state = {
		dropEffect: 'move',
		dragover_class: 'droppable',
		...options
	};

	function handle_dragenter(e: DragEvent) {
		if (!(e.target instanceof HTMLElement)) return;
		e.target.classList.add(state.dragover_class);
	}

	function handle_dragleave(e: DragEvent) {
		if (!(e.target instanceof HTMLElement)) return;
		e.target.classList.remove(state.dragover_class);
	}

	function handle_dragover(e: DragEvent) {
		e.preventDefault();
		if (!e.dataTransfer) return;
		e.dataTransfer.dropEffect = state.dropEffect;
	}

	function handle_drop(e: DragEvent) {
		e.preventDefault();
		if (!e.dataTransfer) return;
		const data = e.dataTransfer.getData('text/plain');
		if (!(e.target instanceof HTMLElement)) return;
		e.target.classList.remove(state.dragover_class);
		state.on_dropzone(data, e);
	}

	node.addEventListener('dragenter', handle_dragenter);
	node.addEventListener('dragleave', handle_dragleave);
	node.addEventListener('dragover', handle_dragover);
	node.addEventListener('drop', handle_drop);

	return {
		update(options: any) {
			state = {
				dropEffect: 'move',
				dragover_class: 'droppable',
				...options
			};
		},

		destroy() {
			node.removeEventListener('dragenter', handle_dragenter);
			node.removeEventListener('dragleave', handle_dragleave);
			node.removeEventListener('dragover', handle_dragover);
			node.removeEventListener('drop', handle_drop);
		}
	};
}