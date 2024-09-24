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

const url = window.location.pathname;
const segments = url.split('/');
const id = segments[segments.length - 1];

Dropzone.options.beforeDropzone = {
    paramName: "beforeImages",
    acceptedFiles: "image/*",
    thumbnailWidth: "250",
    thumbnailHeight: "250",
    dictCancelUpload: 'Annuler',
    maxFilesize: 5,
    addRemoveLinks: true,
    clickable: "#add2",
    dictDefaultMessage: '',
    dictRemoveFile: '<i class="fas fa-trash-alt"></i>',
    init: function () {
        let myDropzone = this;
        this.on("error", function (file, response) {
            var deleteButton = file.previewElement.querySelector(".dz-remove");
            if (deleteButton) {
                deleteButton.style.display = "none";
            }

            var errorMark = file.previewElement;
            if (errorMark) {
                errorMark.addEventListener("click", function () {
                    deleteButton.click();
                });
            }
        })

        this.on("success", function (file, response) {
            file.id = response.uploadedFiles[0].fileId;
            file.size = response.uploadedFiles[0].size;
            refreshGallery('after');
        });

        this.on("removedfile", function (file) {
            if (file.id) {
                fetch(`/images/delete/${file.id}`, {
                    method: 'DELETE'
                })
                    .then(response => response.json())
                    .then(result => {
                        if (!result.success) {
                            let mockFile = {
                                name: file.name,
                                size: file.size,
                                id: file.id
                            };
                            this.displayExistingFile(mockFile, `/images/${id}/before/${file.name}`);
                            mockFile.previewElement.classList.add("dz-complete");
                        } else {
                            refreshGallery('before');
                        }
                    }).catch(error => {
                        let mockFile = {
                            name: file.name,
                            size: file.size,
                            id: file.id
                        };
                        this.displayExistingFile(mockFile, `/images/${id}/before/${file.name}`);
                        mockFile.previewElement.classList.add("dz-complete");
                    });
            }
        });

        fetch(`/images/proposition/${id}?type=before`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    data.images.forEach(file => {
                        let mockFile = {
                            name: file.filename,
                            size: file.file_size,
                            id: file.id
                        };
                        this.displayExistingFile(mockFile, `/images/${id}/before/${file.filename}`);
                        mockFile.previewElement.classList.add("dz-complete");
                        const removeButton = mockFile.previewElement.querySelector(".dz-remove");
                        removeButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
                    });
                }
            })
    }
};

Dropzone.options.afterDropzone = {
    paramName: "afterImages",
    acceptedFiles: "image/*",
    thumbnailWidth: "250",
    thumbnailHeight: "250",
    dictCancelUpload: 'Annuler',
    maxFilesize: 5,
    addRemoveLinks: true,
    clickable: "#add2",
    dictDefaultMessage: '',
    dictRemoveFile: '<i class="fas fa-trash-alt"></i>',
    init: function () {
        let myDropzone = this;
        this.on("error", function (file, response) {
            var deleteButton = file.previewElement.querySelector(".dz-remove");
            if (deleteButton) {
                deleteButton.style.display = "none";
            }

            var errorMark = file.previewElement;
            if (errorMark) {
                errorMark.addEventListener("click", function () {
                    deleteButton.click();
                });
            }
        })

        this.on("success", function (file, response) {
            file.id = response.uploadedFiles[0].fileId;
            file.size = response.uploadedFiles[0].size;
            refreshGallery('after');
        });

        this.on("removedfile", function (file) {
            if (file.id) {
                fetch(`/images/delete/${file.id}`, {
                    method: 'DELETE'
                })
                    .then(response => response.json())
                    .then(result => {
                        if (!result.success) {
                            let mockFile = {
                                name: file.name,
                                size: file.size,
                                id: file.id
                            };
                            this.displayExistingFile(mockFile, `/images/${id}/after/${file.name}`);
                            mockFile.previewElement.classList.add("dz-complete");
                        } else {
                            refreshGallery('after');
                        }
                    }).catch(error => {
                        let mockFile = {
                            name: file.name,
                            size: file.size,
                            id: file.id
                        };
                        this.displayExistingFile(mockFile, `/images/${id}/after/${file.name}`);
                        mockFile.previewElement.classList.add("dz-complete");
                    });
            }
        });

        fetch(`/images/proposition/${id}?type=after`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    data.images.forEach(file => {
                        let mockFile = {
                            name: file.filename,
                            size: file.file_size,
                            id: file.id
                        };
                        this.displayExistingFile(mockFile, `/images/${id}/after/${file.filename}`);
                        mockFile.previewElement.classList.add("dz-complete");
                        const removeButton = mockFile.previewElement.querySelector(".dz-remove");
                        removeButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
                    });
                }
            })
    }
};

function openForm(type) {
    if (type === 'before') {
        document.getElementById('popupFormBefore').style.display = 'flex';
    } else if (type === 'after') {
        document.getElementById('popupFormAfter').style.display = 'flex';
    }
}

function closeForm(type) {
    if (type === 'before') {
        document.getElementById('popupFormBefore').style.display = 'none';
    } else if (type === 'after') {
        document.getElementById('popupFormAfter').style.display = 'none';
    }
}

const forms = document.querySelectorAll('.dropzone');
let observing = true;

function updateImages() {
    if (!observing) return;
    observing = false;
    forms.forEach(form => {
        const childCount = form.children.length - 1;
        const image = form.querySelector('.add-wrapper');
        if (childCount < 4) {
            form.appendChild(image);
            image.style.display = 'flex';
        } else {
            image.style.display = 'none';
        }
    });

    setTimeout(() => {
        observing = true;
    }, 0)
}

forms.forEach(form => {
    const observer = new MutationObserver(updateImages);
    observer.observe(form, {
        childList: true
    });
});

function refreshGallery(type) {
    fetch(`/images/proposition/${id}?type=${type}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const galleryContainer = document.querySelector(`.image-gallery[data-type="${type}"]`);
                if (data.images.length > 0) {
                    galleryContainer.innerHTML = data.images.map(image => `
    <div class="image-wrapper" onclick="openModal('/images/${id}/${type}/${image.filename}')">
      <img src="/images/${id}/${type}/${image.filename}" alt="Image ${type === 'before' ? 'Avant' : 'Après'}" class="image-thumbnail">
    </div>
    `).join('');
                } else {
                    galleryContainer.innerHTML = `<p class="no-images-message">Aucune image "${type === 'before' ? 'Avant' : 'Après'}" disponible.</p>`;
                }
            } else {
                console.error('Error fetching images:', data.message);
            }
        })
        .catch(error => {
            console.error('Error updating image gallery:', error);
        });
}

document.addEventListener('DOMContentLoaded', () => {
    refreshGallery('before');
    refreshGallery('after');
    const hash = window.location.hash;

    if (hash === '#before-gallery') {
        const beforeGallery = document.querySelector('.proposition-images .image-gallery[data-type="before"]');
        if (beforeGallery) {
            beforeGallery.scrollIntoView({
                behavior: 'smooth'
            });
        }
        history.replaceState(null, '', window.location.pathname);

        openForm('before');
    }
    setTimeout(() => {
        updateImages();
    }, 2000)
});