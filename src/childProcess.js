function randomNumbers(cant) {
  let obj = {};
  for (let i = 0; i <cant; i++) {
    let num = Math.floor(Math.random()*1000)+1;
    obj[num] = (obj[num] || 0) + 1;
  }
  return obj;
}


process.on("message",cant => {
  const result = randomNumbers(cant);
  process.send(result);
});