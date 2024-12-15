import xlsx from "xlsx";
import fs from "fs";
import tf from "@tensorflow/tfjs-node";

// // Baca file Excel
// const workbook = xlsx.readFile("data_aset_baru.xlsx");
// const sheetName = workbook.SheetNames[0];
// const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

// console.log("RUnning");
// // Simpan sebagai JSON
// fs.writeFileSync("data-aset.json", JSON.stringify(data, null, 2));

// ==================================================================================..................>>>>>>>>>>

// // Load data JSON ( data sudah di-convert dari Excel ke JSON)
// const rawData = fs.readFileSync("data-aset.json");
// const data = JSON.parse(rawData);

// // Preprocessing: Pisahkan fitur dan label
// const features = data.map((item) => [
//   item.kondisi, // Numerik
//   item.riwayatPemeliharaan, // Numerik
//   item.penyebabKerusakan, // Numerik
//   item.statusPerbaikan, // Numerik
// ]);
// const labels = data.map((item) => item.estimasiMasaPakai);

// // Konversi ke Tensor
// const featureTensor = tf.tensor2d(features);
// const labelTensor = tf.tensor2d(labels, [labels.length, 1]);

// // Definisikan model sederhana
// const model = tf.sequential();
// model.add(tf.layers.dense({ inputShape: [4], units: 10, activation: "relu" })); // Input 4 fitur
// model.add(tf.layers.dense({ units: 1, activation: "linear" })); // Output 1 nilai

// // Compile model
// model.compile({
//   optimizer: tf.train.adam(),
//   loss: "meanSquaredError",
// });

// // Training model
// async function trainModel() {
//   await model.fit(featureTensor, labelTensor, {
//     epochs: 100,
//     batchSize: 32,
//     verbose: 1,
//   });
//   console.log("Model selesai dilatih!");
// }

// // Prediksi barang baru
// async function predictNewItem(newItem) {
//   const newTensor = tf.tensor2d([newItem], [1, 4]); // Input 4 fitur
//   const prediction = model.predict(newTensor);
//   const predictionValue = prediction.dataSync()[0];
//   console.log(predictionValue); // Cetak hasil prediksi
// }

// // Jalankan training dan prediksi
// (async () => {
//   await trainModel();

//   // Barang baru: [tingkatKerusakan, riwayatPemeliharaan, penyebabKerusakan, statusPerbaikan]
//   const barangBaru = [4, 3, 5, 5]; // Contoh data baru
//   console.log("Prediksi untuk barang baru:");
//   await predictNewItem(barangBaru);
// })();

// ===================================

// Load data JSON (pastikan data sudah di-convert dari Excel ke JSON)
const rawData = fs.readFileSync("data-aset.json");
const data = JSON.parse(rawData);

// Preprocessing: Pisahkan fitur dan label
const features = data.map((item) => [
  item.kondisi, // Numerik
  item.riwayatPemeliharaan, // Numerik
  item.penyebabKerusakan, // Numerik
  item.statusPerbaikan, // Numerik
]);
const labels = data.map((item) => item.estimasiMasaPakai);

// Konversi ke Tensor
const featureTensor = tf.tensor2d(features);
const labelTensor = tf.tensor2d(labels, [labels.length, 1]);

// Definisikan model sederhana
const model = tf.sequential();
model.add(tf.layers.dense({ inputShape: [4], units: 10, activation: "relu" })); // Input 4 fitur
model.add(tf.layers.dense({ units: 1, activation: "linear" })); // Output 1 nilai

// Compile model
model.compile({
  optimizer: tf.train.adam(),
  loss: "meanSquaredError",
});

// Training model
async function trainModel() {
  await model.fit(featureTensor, labelTensor, {
    epochs: 150,
    batchSize: 32,
    verbose: 1,
  });
  console.log("Model selesai dilatih!");
}

// Menyimpan model setelah pelatihan
async function saveModel() {
  await model.save("file://./model"); // Menyimpan model ke folder 'model'
  console.log("Model disimpan!");
}

// Memuat model yang telah disimpan
async function loadModel() {
  const model = await tf.loadLayersModel("file://./model/model.json");
  console.log("Model berhasil dimuat!");
  return model;
}

// Prediksi barang baru menggunakan model yang dimuat
async function predictWithLoadedModel() {
  const model = await loadModel();
  const prediction = model.predict(tf.tensor2d([[4, 3, 5, 5]])); // Gantilah dengan data baru untuk prediksi
  prediction.print();
}

// Fungsi utama untuk melatih, menyimpan dan prediksi
(async () => {
  // Melatih model
  await trainModel();
  // Menyimpan model setelah pelatihan
  await saveModel();

  // Barang baru: [tingkatKerusakan, riwayatPemeliharaan, penyebabKerusakan, statusPerbaikan]
  const barangBaru = [4, 3, 5, 5]; // Contoh data baru
  console.log("Prediksi untuk barang baru:");
  await predictWithLoadedModel(); // Melakukan prediksi setelah memuat model
})();
