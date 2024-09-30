const textElements = document.querySelectorAll('input[type="text"], textarea');

textElements.forEach((element) => {
    const counter = element.nextElementSibling;
    const maxLength = element.getAttribute('maxlength');

    const currentLength = element.value.length;
    counter.textContent = `${currentLength} / ${maxLength}`;

    if (currentLength >= maxLength) {
        counter.classList.add('warning');
    } else {
        counter.classList.remove('warning');
    }
    element.addEventListener('input', function () {
        const currentLength = element.value.length;
        counter.textContent = `${currentLength} / ${maxLength}`;

        if (currentLength >= maxLength) {
            counter.classList.add('warning');
        } else {
            counter.classList.remove('warning');
        }
    });
});