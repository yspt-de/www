function documentReady(fn) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', fn);
    } else {
        fn();
    }
}


//
// Header toggle.
//
(function() {
    const elementTrigger = document.querySelector('.menu_trigger');
    const elementNav = document.querySelector('.header nav');
    const elementHtml = document.documentElement;

    if (elementTrigger && elementNav) {
        elementTrigger.addEventListener('click', (event) => {
            if (elementTrigger.classList.contains('active')) {
                elementTrigger.classList.remove('active');
                elementNav.classList.remove('active');
                elementHtml.classList.remove('active');
            } else {
                elementTrigger.classList.add('active');
                elementNav.classList.add('active');
                elementHtml.classList.add('active');
            }
        }, false);
    }
})();



//
// Add background color to header on scrolling.
//
(function() {
    const elementHeader = document.querySelector('.header');

    if (elementHeader) {
        documentReady(() => {
            if (window.scrollY > 0) {
                elementHeader.classList.add('bg');
            } else {
                elementHeader.classList.remove('bg');
            }
        });

        window.addEventListener('scroll', (event) => {
            if (window.scrollY > 0) {
                elementHeader.classList.add('bg');
            } else {
                elementHeader.classList.remove('bg');
            }
        }, false);
    }
})();



//
// Header nav smooth scroll to sections.
//
(function() {
    const elementsAnchor = document.querySelectorAll('.header_button[data-selector]');

    const elementTrigger = document.querySelector('.menu_trigger');
    const elementHeader = document.querySelector('header');
    const elementNav = document.querySelector('.header nav');
    const elementHtml = document.documentElement;

    for (const elementAnchor of elementsAnchor) {
        const elementTarget = document.querySelector(elementAnchor.dataset.selector);

        if (elementTarget) {
            elementAnchor.addEventListener('click', (event) => {
                event.preventDefault();

                const headerHeight = elementHeader.offsetHeight;
                const targetHeight = elementTarget.offsetTop > 0 ? elementTarget.offsetTop : elementTarget.parentElement.offsetTop;

                elementTrigger.classList.remove('active');
                elementNav.classList.remove('active');
                elementHtml.classList.remove('active');

                window.scrollTo({
                    behavior: 'smooth',
                    left: 0,
                    top: targetHeight - headerHeight,
                });
            }, false);
        }
    }
})();



$(function () {
    // Slider
    $(".slider ul").bxSlider({
        mode: "fade",
        controls: false,
        adaptiveHeight: true,
        touchEnabled: false,
    });
});



//
// Contact form.
//
(function() {
    const elementForm = document.querySelector('.jsContactForm');
    const elementSubmit = document.querySelector('.jsContactFormSubmit')

    if (elementForm && elementSubmit) {
        elementSubmit.dataset.textDefault = elementSubmit.textContent;
        elementForm.addEventListener('submit', handleSubmit, false);
    }

    function messageSuccess() {
        elementForm.reset();
        elementSubmit.textContent = 'Gesendet';
        setTimeout(() => {
            elementSubmit.textContent = elementSubmit.dataset.textDefault;
        }, 2000);
    }

    function messageError(data = null) {
        if (data !== null) {
            if (Object.hasOwn(data, 'errors')) {
                console.log('Error submitting contact form: ' + data['errors'].map(error => error['message']).join(', '));
            }
        }

        elementForm.reset();
        elementSubmit.textContent = 'Error';
        setTimeout(() => {
            elementSubmit.textContent = elementSubmit.dataset.textDefault;
        }, 2000);
    }

    async function handleSubmit(event) {
        event.preventDefault();

        elementSubmit.textContent = 'Senden...';

        fetch(event.target.action, {
            method: elementForm.method,
            body: new FormData(event.target),
            headers: { 'Accept': 'application/json' },
        }).then(response => {
            if (response.ok) {
                messageSuccess();
            } else {
                response.json().then(data => {
                    messageError(data);
                })
            }
        }).catch(error => {
            messageError();
        });
    }
})();



//
// Image comparison slider.
//
(function() {
    const elementsComparison = document.querySelectorAll('.jsImageComparison');

    let activeThumb = null;

    for (const elementComparison of elementsComparison) {
        initiateSlider(elementComparison);
    }

    function initiateSlider(elementComparison) {
        const elementBefore = elementComparison.querySelector('.jsImageComparisonBefore');
        const elementAfter = elementComparison.querySelector('.jsImageComparisonAfter');

        if (!elementBefore || !elementAfter) {
            return;
        }

        const elementThumb = document.createElement('button');
        elementComparison.insertAdjacentElement('beforeend', elementThumb);

        elementThumb.classList.add('cImageComparison__thumb', 'jsImageComparisonThumb');

        documentReady(() => {
            const positionAfter = elementComparison.offsetWidth / 2;
            const positionThumb = (elementComparison.offsetWidth / 2) - (elementThumb.offsetWidth / 2);

            elementComparison.style.setProperty('--cImageComparisonWidth', `${elementComparison.offsetWidth}px`);
            elementComparison.style.setProperty('--cImageComparisonHeight', `${elementComparison.offsetHeight}px`);

            moveImage(elementAfter, positionAfter);
            moveThumb(elementThumb, positionThumb);
        });

        elementThumb.addEventListener('mousedown', pressThumb, false);
        elementThumb.addEventListener('touchstart', pressThumb, false);

        window.addEventListener('mouseup', releaseThumb, false);
        window.addEventListener('touchend', releaseThumb, false);
    }

    function pressThumb(event) {
        event.preventDefault();
        document.addEventListener('mousemove', trackThumb, false);
        document.addEventListener('touchmove', trackThumb, false);
        activeThumb = event.target;
    }

    function releaseThumb() {
        document.removeEventListener('mousemove', trackThumb, false);
        document.removeEventListener('touchmove', trackThumb, false);
    }

    function trackThumb(event) {
        const elementThumb = activeThumb;
        const elementComparison = elementThumb.parentNode;
        const elementAfter = elementComparison.querySelector('.jsImageComparisonAfter');

        const rectComparison = elementComparison.getBoundingClientRect();

        const eventThumb = event.changedTouches ? event.changedTouches[0] : event;

        const positionEdge = Math.max(Math.min((eventThumb.pageX - rectComparison.left - window.scrollX), elementComparison.offsetWidth), 0);

        const positionThumb = positionEdge - (elementThumb.offsetWidth / 2);
        const positionAfter = elementComparison.offsetWidth - positionEdge;

        moveThumb(elementThumb, positionThumb);
        moveImage(elementAfter, positionAfter);
    }

    function moveThumb(element, position) {
        element.style.left = `${position}px`;
    }

    function moveImage(element, position) {
        element.style.width = `${position}px`;
    }
})();
