document.addEventListener('DOMContentLoaded', function () {
  function setupDropzone(selector, maxFiles, paramName, existingFiles) {
    Dropzone.options[selector] = {
      paramName: paramName,
      maxFiles: maxFiles,
      acceptedFiles: "image/*",
      maxFilesize: 5,
      dictDefaultMessage: "Upload up to " + maxFiles + " images",
      addRemoveLinks: true,
      dictRemoveFile: "Remove",
      init: function () {
        let myDropzone = this;

        this.on("success", function (file, response) {
          file.id = response.uploadedFiles[0].fileId;
          file.size = response.uploadedFiles[0].size;
        });

        this.on("removedfile", function (file) {
          if (file.id) {
            Swal.fire({
              title: 'Are you sure?',
              text: "You won't be able to revert this!",
              icon: 'warning',
              showCancelButton: true,
              confirmButtonText: 'Yes, delete it!',
              cancelButtonText: 'No, cancel!',
              reverseButtons: true
            }).then((result) => {
              if (result.isConfirmed) {
                document.getElementById('loading-screen').hidden = false;
                fetch(`/propositions/images/delete/${file.id}`, {
                  method: 'DELETE'
                }).then(response => response.json())
                  .then(result => {
                    document.getElementById('loading-screen').hidden = true;
                    if (result.success) {
                      Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
                    } else {
                      Swal.fire('Error!', result.message, 'error');
                    }
                  }).catch(error => {
                    document.getElementById('loading-screen').hidden = true;
                    Swal.fire('Error!', 'Error deleting file.', 'error');
                  });
              }
            });
          }
        });

        existingFiles.forEach(file => {
          let mockFile = { name: file.filename, size: file.file_size || 12345, id: file.id };
          this.displayExistingFile(mockFile, `/propositions/images/<%= proposition.id %>/${paramName}/${file.filename}`);
          mockFile.previewElement.classList.add("dz-complete");
        });
      }
    };
  }

  setupDropzone('beforeDropzone', 3 - <%= beforeImages.length %>, 'beforeImages', <% - JSON.stringify(beforeImages) %>);
  // setupDropzone('afterDropzone', 3 - <%= afterImages.length %>, 'afterImages', <% - JSON.stringify(afterImages) %>);
});
