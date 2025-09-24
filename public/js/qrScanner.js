document.addEventListener('DOMContentLoaded', () => {
    const qrReader = document.getElementById('qr-reader');
    const startQrEntradaBtn = document.getElementById('startQrEntrada');
    const startQrSalidaBtn = document.getElementById('startQrSalida');
    const stopQrScannerBtn = document.getElementById('stopQrScanner');

    let html5QrcodeScanner = null;
    let currentScanType = ''; // 'entrada' o 'salida'

    const showNotification = (message, isSuccess = true) => {
        const modalBody = document.getElementById('notificationModalBody');
        modalBody.innerHTML = `<div class="alert alert-${isSuccess ? 'success' : 'danger'}">${message}</div>`;
        const notificationModal = new bootstrap.Modal(document.getElementById('notificationModal'));
        notificationModal.show();
    };

    const stopScanner = async () => {
        if (html5QrcodeScanner && html5QrcodeScanner.isScanning) {
            await html5QrcodeScanner.stop();
            qrReader.style.display = 'none';
            stopQrScannerBtn.style.display = 'none';
            startQrEntradaBtn.style.display = 'inline-block';
            startQrSalidaBtn.style.display = 'inline-block';
            console.log('Escáner detenido.');
        }
    };

    const startScanner = (scanType) => {
        currentScanType = scanType;
        qrReader.style.display = 'block';
        startQrEntradaBtn.style.display = 'none';
        startQrSalidaBtn.style.display = 'none';
        stopQrScannerBtn.style.display = 'inline-block';

        if (!html5QrcodeScanner) {
            html5QrcodeScanner = new Html5QrcodeScanner(
                "qr-reader",
                { fps: 10, qrbox: { width: 250, height: 250 } },
                /* verbose= */ false
            );
        }

        html5QrcodeScanner.render(qrCodeSuccessCallback, qrCodeErrorCallback);
        console.log(`Escáner iniciado para ${scanType}.`);
    };

    startQrEntradaBtn.addEventListener('click', () => startScanner('entrada'));
    startQrSalidaBtn.addEventListener('click', () => startScanner('salida'));
    stopQrScannerBtn.addEventListener('click', stopScanner);

    const qrCodeSuccessCallback = async (decodedText, decodedResult) => {
        console.log(`QR escaneado: ${decodedText}`, decodedResult);
        await stopScanner(); // Detener el escáner después de un escaneo exitoso

        const qrCodeContent = decodedText; // Ahora el QR contiene el token JWT
        const tipo = currentScanType;

        try {
            const response = await fetch('/qr/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ qrCodeContent, tipo }), // Enviar el contenido completo del QR
            });

            const data = await response.json();

            if (response.ok) {
                showNotification(data.message, true);
                // Opcional: recargar la página o actualizar la lista de asistencia
                // window.location.reload();
            } else {
                showNotification(data.error || 'Error al registrar asistencia', false);
            }
        } catch (error) {
            console.error('Error enviando datos de QR al backend:', error);
            showNotification('Error de conexión con el servidor.', false);
        }
    };

    const qrCodeErrorCallback = (errorMessage) => {
        // Manejar errores del escáner de forma silenciosa si no es crítico
        // console.error(`Error de QR: ${errorMessage}`);
    };
});
