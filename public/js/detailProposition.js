function openModal(imageSrc) {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const downloadLink = document.getElementById('downloadLink');

    modal.style.display = 'flex';
    modalImg.src = imageSrc;
    downloadLink.href = imageSrc;
}

window.onclick = function (event) {
    const modal = document.getElementById('imageModal');
    if (event.target === modal) {
        closeModal();
    }
};

function closeModal() {
    const modal = document.getElementById('imageModal');
    modal.style.display = 'none';
}

