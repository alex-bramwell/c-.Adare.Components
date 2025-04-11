// wwwroot/js/blazorHelpers.js

window.blazorHelpers = {
    // Store references to active listeners to manage them
    clickOutsideHandlers: {},

    registerClickOutside: function (dotNetHelper, elementId) {
        // Define the handler function
        const handler = (event) => {
            const element = document.getElementById(elementId);
            // Check if the element exists and if the click was outside
            if (element && !element.contains(event.target)) {
                // Check if the click target is the input that opens the dropdown
                // You might need to adjust this selector if your input structure changes
                const inputElement = document.querySelector(`[id="${elementId}"]`).previousElementSibling;
                if (!inputElement || !inputElement.contains(event.target)) {
                    console.log(`Click outside detected for ${elementId}. Calling CloseDropdown.`);
                    // Call the Blazor [JSInvokable] method
                    dotNetHelper.invokeMethodAsync('CloseDropdown');
                    // Clean up after firing
                    this.unregisterClickOutside(elementId);
                }
            }
        };

        // Check if a handler already exists for this ID, remove it first
        if (this.clickOutsideHandlers[elementId]) {
            document.removeEventListener('click', this.clickOutsideHandlers[elementId], true);
            console.log(`Removed existing listener for ${elementId}.`);
        }

        // Add the new event listener
        // Using 'true' for capture phase helps catch clicks sooner
        document.addEventListener('click', handler, true);

        // Store the handler reference using the elementId as the key
        this.clickOutsideHandlers[elementId] = handler;
        console.log(`Registered click outside listener for ${elementId}.`);
    },

    unregisterClickOutside: function (elementId) {
        // Retrieve the stored handler
        const handler = this.clickOutsideHandlers[elementId];
        if (handler) {
            // Remove the event listener
            document.removeEventListener('click', handler, true);
            // Remove the stored reference
            delete this.clickOutsideHandlers[elementId];
            console.log(`Unregistered click outside listener for ${elementId}.`);
        } else {
            // console.log(`No listener found to unregister for ${elementId}.`); // Optional: for debugging
        }
    }
};