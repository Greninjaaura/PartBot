const createScene = function () {
	const scene = new BABYLON.Scene(engine);
	const light = new BABYLON.HemisphericLight("HemiLight", new BABYLON.Vector3(0, 1, 0), scene);
	const camera = new BABYLON.UniversalCamera("MyCamera", new BABYLON.Vector3(-2, 0.5, 1), scene);
	camera.minZ = 0.0001;
	camera.attachControl(canvas, true);
	camera.speed = 0.01;
	camera.angularSpeed = 0.05;
	camera.angle = Math.PI / 2;
	camera.rotation.y = Math.PI / 2;
	camera.direction = new BABYLON.Vector3(Math.cos(camera.angle), 0, Math.sin(camera.angle));
	scene.activeCameras.push(camera);
	const sphere = BABYLON.MeshBuilder.CreateSphere("dummyCamera", { radius: 0.5 }, scene);
	sphere.parent = camera;
	sphere.rotation.x = Math.PI / 2;

	const ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 100, height: 100 }, scene);
	pbrGround = new BABYLON.PBRMaterial("pbr", scene);
	ground.material = pbrGround;
	pbrGround.albedoColor = new BABYLON.Color3(1.0, 0.966, 0.936);
	pbrGround.metallic = 1.0;
	pbrGround.roughness = 1.0;

	const randomNumber = function (min, max) {
		if (min === max) {
			return min;
		}
		const random = Math.random();
		return random * (max - min) + min;
	};

	const box = new BABYLON.MeshBuilder.CreateBox("crate", { size: 1, height: 2 }, scene);
	box.material = new BABYLON.StandardMaterial("Mat", scene);
	const boxUrl = "https://raw.githubusercontent.com/BabylonJS/Babylon.js/master/Playground/textures/crate.png";
	const boxDiffuse = new BABYLON.Texture(boxUrl, scene);
	box.material.diffuseTexture = boxDiffuse;
	box.checkCollisions = true;

	const boxNb = 6;
	const theta = 0;
	const radius = 6;

	const maze = MAZE.create(20, 20);
	const boxes = [box];

	maze.forEach((row, x) => {
		row.forEach((flag, y) => {
			if (flag) return;
			const newBox = box.clone(`box${x}-${y}`);
			boxes.push(newBox);
			newBox.position = new BABYLON.Vector3(x, 1, y);
		});
	});

	boxes.shift().dispose();

	scene.gravity = new BABYLON.Vector3(0, -0.9, 0);
	scene.collisionsEnabled = true;

	camera.checkCollisions = true;
	camera.applyGravity = true;

	ground.checkCollisions = true;

	camera.ellipsoid = new BABYLON.Vector3(0.4, 0.5, 0.4);
	camera.ellipsoidOffset = new BABYLON.Vector3(0, 0.5, 0);

	// Camera management

	camera.inputs.removeByType("FreeCameraKeyboardMoveInput");
	camera.inputs.removeByType("FreeCameraMouseInput");

	const FreeCameraKeyboardWalkInput = function () {
		this._keys = [];
		this.keysUp = [38];
		this.keysDown = [40];
		this.keysLeft = [37];
		this.keysRight = [39];
	};

	FreeCameraKeyboardWalkInput.prototype.attachControl = function (noPreventDefault) {
		const _this = this;
		const engine = this.camera.getEngine();
		const element = engine.getInputElement();
		if (!this._onKeyDown) {
			element.tabIndex = 1;
			this._onKeyDown = function (evt) {
				if (_this.keysUp.indexOf(evt.keyCode) !== -1 ||
						_this.keysDown.indexOf(evt.keyCode) !== -1 ||
						_this.keysLeft.indexOf(evt.keyCode) !== -1 ||
						_this.keysRight.indexOf(evt.keyCode) !== -1) {
					const index = _this._keys.indexOf(evt.keyCode);
					if (index === -1) {
						_this._keys.push(evt.keyCode);
					}
					if (!noPreventDefault) {
						evt.preventDefault();
					}
				}
			};
			this._onKeyUp = function (evt) {
				if (_this.keysUp.indexOf(evt.keyCode) !== -1 ||
						_this.keysDown.indexOf(evt.keyCode) !== -1 ||
						_this.keysLeft.indexOf(evt.keyCode) !== -1 ||
						_this.keysRight.indexOf(evt.keyCode) !== -1) {
					const index = _this._keys.indexOf(evt.keyCode);
					if (index >= 0) {
						_this._keys.splice(index, 1);
					}
					if (!noPreventDefault) {
						evt.preventDefault();
					}
				}
			};
			element.addEventListener("keydown", this._onKeyDown, false);
			element.addEventListener("keyup", this._onKeyUp, false);
		}
	};

	FreeCameraKeyboardWalkInput.prototype.detachControl = function () {
		const engine = this.camera.getEngine();
		const element = engine.getInputElement();
		if (this._onKeyDown) {
			element.removeEventListener("keydown", this._onKeyDown);
			element.removeEventListener("keyup", this._onKeyUp);
			BABYLON.Tools.UnregisterTopRootEvents([
				{ name: "blur", handler: this._onLostFocus }
			]);
			this._keys = [];
			this._onKeyDown = null;
			this._onKeyUp = null;
		}
	};

	FreeCameraKeyboardWalkInput.prototype.checkInputs = function () {
		if (this._onKeyDown) {
			const camera = this.camera;
			for (let index = 0; index < this._keys.length; index++) {
				const keyCode = this._keys[index];
				const speed = camera.speed;
				if (this.keysLeft.indexOf(keyCode) !== -1) {
					camera.rotation.y -= camera.angularSpeed;
					camera.direction.copyFromFloats(0, 0, 0);
				} else if (this.keysUp.indexOf(keyCode) !== -1) {
					camera.direction.copyFromFloats(0, 0, speed);
				} else if (this.keysRight.indexOf(keyCode) !== -1) {
					camera.rotation.y += camera.angularSpeed;
					camera.direction.copyFromFloats(0, 0, 0);
				} else if (this.keysDown.indexOf(keyCode) !== -1) {
					camera.direction.copyFromFloats(0, 0, -speed);
				}
				if (camera.getScene().useRightHandedSystem) {
					camera.direction.z *= -1;
				}
				camera.getViewMatrix().invertToRef(camera._cameraTransformMatrix);
				BABYLON.Vector3.TransformNormalToRef(camera.direction, camera._cameraTransformMatrix, camera._transformedDirection);
				camera.cameraDirection.addInPlace(camera._transformedDirection);
			}
		}
	};

	FreeCameraKeyboardWalkInput.prototype._onLostFocus = function (e) {
		this._keys = [];
	};

	FreeCameraKeyboardWalkInput.prototype.getClassName = function () {
		return "FreeCameraKeyboardWalkInput";
	};

	FreeCameraKeyboardWalkInput.prototype.getSimpleName = function () {
		return "keyboard";
	};

	camera.inputs.add(new FreeCameraKeyboardWalkInput());

	const FreeCameraSearchInput = function (touchEnabled) {
		if (touchEnabled === void 0) {
			touchEnabled = true;
		}
		this.touchEnabled = touchEnabled;
		this.buttons = [0, 1, 2];
		this.angularSensibility = 2000.0;
		this.restrictionX = 100;
		this.restrictionY = 60;
	};

	FreeCameraSearchInput.prototype.attachControl = function (noPreventDefault) {
		const _this = this;
		const engine = this.camera.getEngine();
		const element = engine.getInputElement();
		const angle = { x: 0, y: 0 };
		if (!this._pointerInput) {
			this._pointerInput = function (p, s) {
				const evt = p.event;
				if (!_this.touchEnabled && evt.pointerType === "touch") {
					return;
				}
				if (p.type !== BABYLON.PointerEventTypes.POINTERMOVE && _this.buttons.indexOf(evt.button) === -1) {
					return;
				}
				if (p.type === BABYLON.PointerEventTypes.POINTERDOWN) {
					try {
						evt.srcElement.setPointerCapture(evt.pointerId);
					} catch (e) {
						// Nothing to do with the error. Execution will continue.
					}
					_this.previousPosition = {
						x: evt.clientX,
						y: evt.clientY
					};
					if (!noPreventDefault) {
						evt.preventDefault();
						element.focus();
					}
				} else if (p.type === BABYLON.PointerEventTypes.POINTERUP) {
					try {
						evt.srcElement.releasePointerCapture(evt.pointerId);
					} catch (e) {
						// Nothing to do with the error.
					}
					_this.previousPosition = null;
					if (!noPreventDefault) {
						evt.preventDefault();
					}
				} else if (p.type === BABYLON.PointerEventTypes.POINTERMOVE) {
					if (!_this.previousPosition || engine.isPointerLock) {
						return;
					}
					const offsetX = evt.clientX - _this.previousPosition.x;
					const offsetY = evt.clientY - _this.previousPosition.y;
					angle.x += offsetX;
					angle.y -= offsetY;
					if (Math.abs(angle.x) > _this.restrictionX)  {
						angle.x -= offsetX;
					}
					if (Math.abs(angle.y) > _this.restrictionY)  {
						angle.y += offsetY;
					}
					if (_this.camera.getScene().useRightHandedSystem) {
						if (Math.abs(angle.x) < _this.restrictionX)  {
							_this.camera.cameraRotation.y -= offsetX / _this.angularSensibility;
						}
					} else {
						if (Math.abs(angle.x) < _this.restrictionX)  {
							_this.camera.cameraRotation.y += offsetX / _this.angularSensibility;
						}
					}
					if (Math.abs(angle.y) < _this.restrictionY)  {
						_this.camera.cameraRotation.x += offsetY / _this.angularSensibility;
					}
					_this.previousPosition = {
						x: evt.clientX,
						y: evt.clientY
					};
					if (!noPreventDefault) {
						evt.preventDefault();
					}
				}
			};
		}
		this._onSearchMove = function (evt) {
			if (!engine.isPointerLock) {
				return;
			}
			const offsetX = evt.movementX || evt.mozMovementX || evt.webkitMovementX || evt.msMovementX || 0;
			const offsetY = evt.movementY || evt.mozMovementY || evt.webkitMovementY || evt.msMovementY || 0;
			if (_this.camera.getScene().useRightHandedSystem) {
				_this.camera.cameraRotation.y -= offsetX / _this.angularSensibility;
			} else {
				_this.camera.cameraRotation.y += offsetX / _this.angularSensibility;
			}
			_this.camera.cameraRotation.x += offsetY / _this.angularSensibility;
			_this.previousPosition = null;
			if (!noPreventDefault) {
				evt.preventDefault();
			}
		};
		const pointerEvent = BABYLON.PointerEventTypes.POINTERDOWN |
			BABYLON.PointerEventTypes.POINTERUP |
			BABYLON.PointerEventTypes.POINTERMOVE;
		this._observer = this.camera.getScene().onPointerObservable.add(this._pointerInput, pointerEvent);
		element.addEventListener("mousemove", this._onSearchMove, false);
	};

	FreeCameraSearchInput.prototype.detachControl = function () {
		const engine = this.camera.getEngine();
		const element = engine.getInputElement();
		if (this._observer && element) {
			this.camera.getScene().onPointerObservable.remove(this._observer);
			element.removeEventListener("mousemove", this._onSearchMove);
			this._observer = null;
			this._onSearchMove = null;
			this.previousPosition = null;
		}
	};

	FreeCameraSearchInput.prototype.getClassName = function () {
		return "FreeCameraSearchInput";
	};

	FreeCameraSearchInput.prototype.getSimpleName = function () {
		return "MouseSearchCamera";
	};

	camera.inputs.add(new FreeCameraSearchInput());

	return scene;
};
