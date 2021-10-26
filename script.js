// Collapse functionality for hourly weather section

document.addEventListener("DOMContentLoaded", function() {
    // Grab all the trigger elements on the page
    const triggers = Array.from(document.querySelectorAll('[data-toggle="collapse"]'));
    console.log(triggers);

    // Listen for click events, but only on our triggers
    window.addEventListener('click', (event) => {
        const elm = event.target;
        if (triggers.includes(elm)) {
        const selector = elm.getAttribute('data-target');
        collapse(selector, 'toggle');
        }
    });

    const fnmap = {
        'toggle': 'toggle',
        'show': 'add',
        'hide': 'remove'
    }

    const collapse = (selector, cmd) => {
        const targets = Array.from(document.querySelectorAll(selector));
        console.log(targets);
        targets.forEach(target => {
            target.classList[fnmap[cmd]]('show');
        })
    }
})