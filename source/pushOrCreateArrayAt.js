export {pushOrCreateArrayAt};

const pushOrCreateArrayAt = (object, key, valueToPush) => {
  // don't need to use hasOwnProp as there is no array in the prototype
  // but still use it to avoid a warning
  // const potentialArray = object[key]
	if (Object.prototype.hasOwnProperty.call(object, key)) {
		// eventually the if is always true
		object[key].push(valueToPush);
	} else {
		// only for the first time
		object[key] = [valueToPush];
	}
};
