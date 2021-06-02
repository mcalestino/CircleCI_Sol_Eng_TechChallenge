document.addEventListener('DOMContentLoaded', () => {
    listenForButtonClick();
    listenForMouseMove();
});

function listenForButtonClick() {
    document.querySelector('#button-to-click').addEventListener('click', () => {
        const text = document.querySelector('#hidden-text');
        text.hidden = !text.hidden; // toggle hidden status of text when button is clicked
    });
}

function listenForMouseMove() {
    const buttonToClick = document.querySelector('#button-to-click');
    const sillyToggleButton = document.querySelector('#silly-toggle-button');
    buttonToClick.style.left = '0px';
    buttonToClick.style.top = '0px';
    const paddingX = 80;
    const paddingY = 120;
    var totalDistance = 0;
    var silly = false;

    const timeThreshold = 20000;
    const distanceThreshold = 2000;

    startSilliness();

    // show button to stop if threshold distance hasn't been exceeded and time threshold has passed
    window.setTimeout(showSillyToggleButton, timeThreshold);

    function startSilliness() {
        if (silly) return;
        document.addEventListener('mousemove', moveButton);
        document.addEventListener('mousedown', moveButton);
        sillyToggleButton.removeEventListener('click', startSilliness);
        sillyToggleButton.addEventListener('click', stopSilliness);
        buttonToClick.textContent = 'Click!';
        sillyToggleButton.textContent = 'Stop the Silliness!';
        sillyToggleButton.classList = ['stop'];
        silly = true;
    }

    function stopSilliness() {
        if (!silly) return;
        document.removeEventListener('mousemove', moveButton);
        document.removeEventListener('mousedown', moveButton);
        sillyToggleButton.removeEventListener('click', stopSilliness);
        sillyToggleButton.addEventListener('click', startSilliness);
        buttonToClick.style.left = '0px';
        buttonToClick.style.top = '0px';
        buttonToClick.textContent = 'Ok, Click now!';
        sillyToggleButton.textContent = 'Start the Silliness!';
        sillyToggleButton.classList = ['start'];
        silly = false;
    }

    function showSillyToggleButton() {
        sillyToggleButton.hidden = false;
    }

    function moveButton(event) {
        var count = 0;
        // check if the cursor is inside an ellipse with a width and height of the button (plus padding)
        while (Math.sqrt((((buttonToClick.offsetLeft + (buttonToClick.offsetWidth / 2) - event.clientX) ** 2) / ((paddingX + (buttonToClick.offsetWidth / 2)) ** 2)) + (((buttonToClick.offsetTop + (buttonToClick.offsetHeight / 2) - event.clientY) ** 2)) / ((paddingY + (buttonToClick.offsetHeight / 2)) ** 2)) <= 1) {
            var dist = Math.sqrt(((buttonToClick.offsetLeft + (buttonToClick.offsetWidth / 2) - event.clientX)) ** 2 + ((buttonToClick.offsetTop + (buttonToClick.offsetHeight / 2) - event.clientY)) ** 2);

            // take a step away from the cursor along the imaginary line connecting the center of the button and the cursor
            // scale step based on distance from cursor to center of button (nothing significant about the factor of 3, it seemed to work best)
            var rightStep = (buttonToClick.offsetLeft + (buttonToClick.offsetWidth / 2) - event.clientX) * 3 / dist;
            var downStep = (buttonToClick.offsetTop + (buttonToClick.offsetHeight / 2) - event.clientY) * 3 / dist;

            // reposition button away from cursor
            var leftPos = parseFloat(buttonToClick.style.left.replace('px', '')) + rightStep;
            var topPos = parseFloat(buttonToClick.style.top.replace('px', '')) + downStep;

            // only move button if it hasn't run into a border
            if (rightStep < 0) leftPos = Math.max(-buttonToClick.parentElement.offsetLeft, leftPos);
            else if (rightStep > 0) leftPos = Math.min(window.innerWidth - buttonToClick.offsetWidth - buttonToClick.parentElement.offsetLeft, leftPos);

            if (downStep < 0) topPos = Math.max(-buttonToClick.parentElement.offsetTop, topPos);
            else if (downStep > 0) topPos = Math.min(window.innerHeight - buttonToClick.offsetHeight - buttonToClick.parentElement.offsetTop, topPos);

            buttonToClick.style.left = `${leftPos}px`;
            buttonToClick.style.top = `${topPos}px`;

            // track total distance traveled by the box. Show button to stop once it exceeds the threshold
            totalDistance += Math.sqrt((rightStep ** 2) + (downStep ** 2));
            if (totalDistance > distanceThreshold && sillyToggleButton.hidden) showSillyToggleButton();

            // send the button back to the middle of the screen if it is pushed to a corner
            if (Number(buttonToClick.offsetLeft <= 0) +
                Number(buttonToClick.offsetTop <= 0) +
                Number(buttonToClick.offsetLeft + buttonToClick.offsetWidth >= window.innerWidth) +
                Number(buttonToClick.offsetTop + buttonToClick.offsetHeight >= window.innerHeight) == 2) {
                
                const tan = Math.atan2((buttonToClick.offsetTop + (buttonToClick.offsetHeight / 2) - event.clientY), (buttonToClick.offsetLeft + (buttonToClick.offsetWidth / 2) - event.clientX)) * 180 / Math.PI;

                if ((90 <= tan && tan < 155) || (-155 <= tan && tan < -90)) buttonToClick.style.left = `${buttonToClick.offsetWidth - buttonToClick.parentElement.offsetLeft}px`; // right
                else if ((-180 <= tan && tan < -155) || (-15 <= tan && tan < -0)) buttonToClick.style.top = `${buttonToClick.offsetHeight - buttonToClick.parentElement.offsetTop}px`; // down
                else if ((-90 <= tan && tan < -15) || (15 <= tan && tan < 90)) buttonToClick.style.left = `${window.innerWidth - (2 * buttonToClick.offsetWidth) - buttonToClick.parentElement.offsetLeft}px`; // left
                else if ((0 <= tan && tan < 15) || (155 <= tan && tan < 180)) buttonToClick.style.top = `${window.innerHeight - (2 * buttonToClick.offsetHeight) - buttonToClick.parentElement.offsetTop}px`; // up
            }

            count++;
            if (count > 300) {
                console.log('infinite loop avoided');
                break;
            }
        }
    }
}