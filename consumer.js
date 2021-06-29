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

    // Menerima pesan dari Message broker
    /**
     * Queue: Nama dari queue yang dikonsumsi. Consumer akan selalu mengamati untuk menerima pesan masuk yang dikirimkan ke queue tersebut.
     * Callback function: Fungsi yang akan dijalankan ketika ada pesan masuk ke dalam queue yang diamati. Fungsi ini membawa pesan berupa instance dari amqp.ConsumeMessage yang berisikan konten yang dikirim oleh producer. Kita dapat membaca kontennya dalam bentuk string dengan menggunakan fungsi message.content.toString().
     * Options: Objek yang menentukan seperti apa perilaku ketika pesan diterima. Salah satu properti objeknya adalah noAck, yang menunjukkan apakah penerimaan pesan butuh pengakuan (acknowledgement) atau tidak.
     */
    channel.consume(
        queue,
        (payload) => {
            console.log(
                `Menerima pesan dari queue ${queue}: ${payload.content.toString()}`
            );
        },
        {
            noAck: true,
        }
    );

    // Jalankan 'node consumer.js'
    // Setelah di jalankan,Program consumer akan terus berjalan untuk mengamati pesan yang masuk pada queue dicoding.
};

init();
