document.addEventListener('DOMContentLoaded', () => {
    console.log('userCRUD_qr.js cargado.'); // Puedes dejar esto si quieres, o eliminarlo también

    const showQrLoginModal = document.getElementById('showQrLoginModal');
    const qrcodeCanvas = document.getElementById('qrcodeCanvas');

    // Delegación de eventos para los botones "Ver QR"
    document.getElementById('usersTable').addEventListener('click', (event) => {
        console.log('Evento de clic detectado en usersTable.');
        const target = event.target.closest('.view-qr-btn');
        if (target) {
            console.log('Botón Ver QR clicado.');
            const qrLoginSecret = target.dataset.qrSecret; // Obtener el secreto QR del atributo data-qr-secret
            console.log('qrLoginSecret obtenido:', qrLoginSecret);

            if (qrLoginSecret && qrLoginSecret !== '') {
                console.log('qrLoginSecret es válido, generando QR...');
                // Limpiar cualquier QR anterior
                qrcodeCanvas.innerHTML = '';
                // Generar el nuevo QR
                new QRCode(qrcodeCanvas, {
                    text: qrLoginSecret,
                    width: 256,
                    height: 256,
                    colorDark : "#000000",
                    colorLight : "#ffffff"
                }, QRCode.CorrectLevel.H);
                const modal = new bootstrap.Modal(showQrLoginModal);
                modal.show();
            } else {
                console.error('No se encontró qr_login_secret válido para este usuario.');
                Swal.fire('Error', 'No se pudo generar el QR. El usuario no tiene un secreto de login QR válido.', 'error');
            }
        }
    });

    // Limpiar el QR al cerrar el modal
    showQrLoginModal.addEventListener('hidden.bs.modal', () => {
        console.log('Modal QR cerrado, limpiando canvas.');
        qrcodeCanvas.innerHTML = '';
    });
});