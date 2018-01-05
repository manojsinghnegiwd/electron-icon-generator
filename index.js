#! /usr/bin/env node

const fs = require('fs');
const sharp = require('sharp');

const args = process.argv.slice(2);

const pathToPng = args[0];
const sizes = [
	512,
	256,
	128,
	96,
	64,
	48,
	32,
	24,
	16
]

fs.access(pathToPng, (err) => {
  if (err) {
    if (err.code === 'ENOENT') {
      console.error(`png file doesn't exist`);
      return;
    }

    throw err;
    process.exit(-1);
  }
});

const savePngPromises = sizes.map(size => {

	return new Promise(
		(resolve, reject) => {
		sharp(pathToPng)
			.resize(size, size)
			.background({r: 0, g: 0, b: 0, alpha: 0})
			.embed()
			.toFormat('png')
			.toBuffer(function(err, outputBuffer) {
				if (err) {
					throw err
					reject(err);
				}

				fs.writeFile(`generated/${size}x${size}.png`, outputBuffer, function (err) {
					if (err) {
						throw err
						return reject(err);
					}

					resolve();
				})
			});
		}
	)

})

fs.mkdir('generated', () => {

	Promise.all(savePngPromises)
		.then(
			values => console.log('created icons')
		)

});