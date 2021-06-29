const amqp = require('amqplib');

const init = async () => {
    // Buat koneksi ke server rabbitMQ
    const connection = await amqp.connect('amqp://localhost');

    // Buat objek channel, digunakan untuk memanggil API di protokol AMQP
    const channel = await connection.createChannel();

    // Tentukan nama Queue yang dituju
    const queue = 'dicoding';

    // Buat message
    const message = 'Selamat belajar message broker';

    // Pastikan Queue dengan nama 'dicoding' sudah dibuat
    // parameter pertama = nama queue, parameter kedua = objek options
    // channel.assertQueue bersifat idempoten = akan membuat channel baru bila channel yang diperiksa tidak ada
    // properti durable pada options berfungsi untuk menjaga agar Queue tetap tersedia ketika server message broker restart
    await channel.assertQueue(queue, {
        durable: true,
    });

    // kirim pesan
    // sendToQueue menerima dua paramaeter, 1. nama queue, 2. pesan dalam bentuk Buffer
    await channel.sendToQueue(queue, Buffer.from(message));
    console.log('Pesan berhasil terkirim');

    // Idealnya setelah mengirim pesan, tutup koneksi yang sebelumnya dibuat
    // Beri jeda 1 detik
    setTimeout(() => {
        connection.close();
    }, 1000);

    // Jalankan 'node producer.js'
};

init();
