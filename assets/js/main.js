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

    // Light Slide Drad Image
    function initComparisons() {
        var x, i;
        x = document.getElementsByClassName("overlayimg");
        for (i = 0; i < x.length; i++) {
            compareImages(x[i]);
        }
        function compareImages(img) {
            var slider,
                img,
                clicked = 0,
                w,
                h;
            w = img.offsetWidth;
            h = img.offsetHeight;
            img.style.width = w / 2 + "px";
            slider = document.createElement("DIV");
            slider.setAttribute("class", "slidetrigger");
            img.parentElement.insertBefore(slider, img);
            slider.style.top = h / 2 - slider.offsetHeight / 2 + "px";
            slider.style.left = w / 2 - slider.offsetWidth / 2 + "px";
            slider.addEventListener("mousedown", slideReady);
            window.addEventListener("mouseup", slideFinish);
            slider.addEventListener("touchstart", slideReady);
            window.addEventListener("touchend", slideFinish);
            function slideReady(e) {
                e.preventDefault();
                clicked = 1;
                window.addEventListener("mousemove", slideMove);
                window.addEventListener("touchmove", slideMove);
            }
            function slideFinish() {
                clicked = 0;
            }
            function slideMove(e) {
                var pos;
                if (clicked == 0) return false;
                pos = getCursorPos(e);
                if (pos < 0) pos = 0;
                if (pos > w) pos = w;
                slide(pos);
            }
            function getCursorPos(e) {
                var a,
                    x = 0;
                e = e.changedTouches ? e.changedTouches[0] : e;
                a = img.getBoundingClientRect();
                x = e.pageX - a.left;
                x = x - window.pageXOffset;
                return x;
            }
            function slide(x) {
                img.style.width = x + "px";
                slider.style.left = img.offsetWidth - slider.offsetWidth / 2 + "px";
            }
        }
    }
    initComparisons();

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
