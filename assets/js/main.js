function documentReady(fn) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', fn);
    } else {
        fn();
    }
}



$(function () {
    // Responsive menu trigger
    $(".menu_trigger").on("click", function () {
        $(".menu_trigger, .header nav, html").toggleClass("active");
    });

    // Data slide
    $(window).on("scroll load", function () {
        if ($(this).scrollTop() >= 1) {
            $(".header").addClass("bg");
        } else {
            $(".header").removeClass("bg");
        }
    });

    // Data slide
    $("*[data-slide]").on("click", function () {
        var slideTarget = $(this).attr("data-slide");
        $("html, body").animate(
            {
                scrollTop: $(slideTarget).offset().top - 100,
            },
            1000
        );
        $(".menu_trigger, .header nav, html").removeClass("active");
        return false;
    });

    // Slider
    $(".slider ul").bxSlider({
        mode: "fade",
        controls: false,
        adaptiveHeight: true,
        touchEnabled: false,
    });

    // Show/hide input value
    $('input[type="text"], input[type="password"], input[type="email"]').each(function () {
        var valtxt = $(this).attr("value");
        $(this).focus(function () {
            if ($(this).val() == valtxt) {
                $(this).val("");
            }
        });
        $(this).blur(function () {
            if ($(this).val() == "") {
                $(this).val(valtxt);
            }
        });
    });
    $("textarea")
        .focus(function () {
            if (this.value === this.defaultValue) {
                this.value = "";
            }
        })
        .blur(function () {
            if (this.value === "") {
                this.value = this.defaultValue;
            }
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
        // element.style.clipPath = `polygon(0px 0px, ${position}px 0px, ${position}px 100%, 0px 100%)`;
        element.style.width = `${position}px`;
    }
})();
